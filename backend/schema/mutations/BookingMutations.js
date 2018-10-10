const graphql = require('graphql');
const { GraphQLDate } = require('graphql-iso-date');
const moment = require('moment');
const Razorpay = require('razorpay');
const pluralize = require('pluralize');
const BookingType = require('../types/BookingType');
const CampModel = require('../../models/camp.js');
const UserModel = require('../../models/user');
const TentModel = require('../../models/tent');
const BookingModel = require('../../models/booking');
const auth = require('../../config/auth');
const sms = require('../../communication/sms');
const emailer = require('../../communication/email');

const {
  NotLoggedinError,
  TentNotAvailableError,
  AmountNotCapturedError,
} = require('../graphqlErrors');

const { GraphQLString, GraphQLInt, GraphQLList } = graphql;

// Checks if camp can book user on provided parameters
const bookCheck = {
  type: BookingType,
  args: {
    tentIds: { type: new GraphQLList(GraphQLString) },
    fromDate: { type: GraphQLDate },
    toDate: { type: GraphQLDate },
  },
  async resolve(parent, args, context) {
    const user = await auth.getAuthenticatedUser(context.req);

    if (!user) {
      throw new NotLoggedinError();
    }

    const preBookPeriod = moment(args.fromDate).diff(Date.now(), 'days');

    const tents = await TentModel.find({
      _id: { $in: args.tentIds },
      isAvailable: { $eq: true },
      preBookPeriod: { $gte: preBookPeriod },
    });

    if (!tents || tents.length < args.tentIds.length) {
      throw new TentNotAvailableError();
    }

    // Calculates the payable amount
    let amount = tents.reduce((price, tent) => price + tent.bookingPrice, 0);

    // Multiply by trip duration
    amount *= moment(args.toDate).diff(args.fromDate, 'days');
    return { amount };
  },
};

/*
Calculates the GST and Commission on any given amount
Takes amount parameter in Rupees.
Returns the amount, commission and tax in paise.
*/
function calculateTransferAmount(amount) {
  let returnAmount = 0;
  const commissionPercent = 12;
  const commissionAmount = (amount * commissionPercent) / 100;
  // GST on Commission (Rate 18% constant)
  const GST = (commissionAmount * 18) / 100;
  returnAmount = amount - commissionAmount - GST;
  // Convert Rupees to Paise
  return {
    returnAmount: returnAmount * 100,
    tax: GST * 100,
    commissionAmount: commissionAmount * 100,
  };
}

const book = {
  type: BookingType,
  args: {
    razorpayPaymentId: { type: GraphQLString },
    tentIds: { type: new GraphQLList(GraphQLString) },
    tentCount: { type: GraphQLInt },
    personCount: { type: GraphQLInt },
    fromDate: { type: GraphQLDate },
    toDate: { type: GraphQLDate },
  },
  async resolve(parent, args, context) {
    try {
      // Check user login and get user's details
      const user = await auth.getAuthenticatedUser(context.req);
      if (!user) {
        throw new NotLoggedinError();
      }

      // Check if the provided tentId is correct and if the tent can be booked
      const preBookPeriod = moment(args.fromDate).diff(Date.now(), 'days');

      const tents = await TentModel.find({
        _id: { $in: args.tentIds },
        preBookPeriod: { $gte: preBookPeriod },
      });

      if (!tents || tents.length < args.tentIds.length) {
        throw new TentNotAvailableError();
      }

      // Calculates the payable amount
      let amount = 0;
      for (let i = 0; i < tents.length; i += 1) {
        amount += tents[i].bookingPrice;
      }
      // Multiply by trip duration
      amount *= moment(args.toDate).diff(args.fromDate, 'days');

      if (!tents || tents.length < args.tentIds.length) {
        throw new TentNotAvailableError();
      }

      // Verify Razorpay Id and collect money

      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_API_SECRET,
      });

      const razorpayAmount = amount * 100; // Razorpay processes amount in paise

      const payment = await instance.payments.capture(
        args.razorpayPaymentId,
        razorpayAmount,
      );
      if (payment.status !== 'captured' || payment.error_code !== null) {
        throw new AmountNotCapturedError();
      }

      // Generate a booking token
      const booking = await BookingModel.create({
        razorpayPaymentId: payment.id,
        tents: args.tentIds,
        user: user.id,
        startDate: args.fromDate,
        endDate: args.toDate,
        tentCount: args.tentCount,
        personCount: args.personCount,
        camp: tents[0].camp,
        amount,
      });

      const userData = await UserModel.findById(user.id).select(
        'name phoneNumber email',
      );
      const campData = await CampModel.findById(tents[0].camp).select(
        'name phoneNumber email credits',
      );
      // Send sms to user
      await sms.sendSMS(
        userData.phoneNumber,
        `Successfully booked ${
          campData.name
        }. Your booking starts from ${moment(args.fromDate).format(
          'dddd, MMMM Do YYYY',
        )} and ends on ${moment(args.toDate).format(
          'dddd, MMMM Do YYYY',
        )}. You can see your bookings @ https://campzy.in/profile/activeBookings. Enjoy!`,
      );

      // Send email to user
      await emailer.sendSuccessBookingEmail(
        booking,
        userData,
        campData,
        amount,
      );

      // Send sms to camp owner
      await sms.sendSMS(
        campData.phoneNumber,
        `${userData.name} has booked ${pluralize(
          'tent',
          args.tentCount,
          true,
        )} in your camp ${campData.name} from ${moment(args.fromDate).format(
          'dddd, MMMM Do YYYY',
        )} to ${moment(args.toDate).format(
          'dddd, MMMM Do YYYY',
        )} for ₹ ${amount}. Congrats!`,
      );

      if (campData.razorpayAccountId) {
        // Send Money to Camp Owner's Account
        await instance.payments.transfer(payment.id, {
          account: campData.razorpayAccountId,
          amount: calculateTransferAmount(amount).returnAmount,
          currency: 'INR',
        });

        // Generate Invoice For Camp Owner
        if (!campData.razorpayCustomerId) {
          // If no customer Id exists for the camp-owner create one
          const customer = await instance.customer.create({
            name: campData.name,
            email: campData.email,
            contact: campData.phoneNumber,
          });
          campData.razorpayCustomerId = customer.id;
          await campData.save();
        }

        await instance.invoices.create({
          type: 'invoice',
          customer_id: campData.razorpayCustomerId,
          currency: 'INR',
          line_items: [
            {
              name: 'Campzy Service Charge',
              amount: calculateTransferAmount(amount).commissionAmount,
              currency: 'INR',
              tax: calculateTransferAmount(amount).tax,
            },
          ],
        });
      } else {
        // Add Credits to the Camp Owner's Account if the account is not present.
        campData.credits += amount;
        await campData.save();
      }

      // Return the booking token's id
      return booking;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};

const cancelBooking = {
  type: BookingType,
  args: {
    bookingCode: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    console.log(context);
  },
};

module.exports = { bookCheck, book, cancelBooking };
