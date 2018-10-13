/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/* eslint no-param-reassign: ["error", { "props": false }] */
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
const InvoiceModel = require('../../models/invoice');
const auth = require('../../config/auth');
const sms = require('../../communication/sms');
const emailer = require('../../communication/email');

const {
  NotLoggedinError,
  TentNotAvailableError,
  AmountNotCapturedError,
  BookingNotCancelled,
} = require('../graphqlErrors');

const {
  GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull,
} = graphql;

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
  const commissionPercent = 12;
  const GSTPercent = 18;

  const cumulativePercent = commissionPercent + (commissionPercent / 100) * (GSTPercent / 100) * 100;

  const returnAmount = amount / (1 + cumulativePercent / 100); // Reversing the percentage by adding 1

  const commissionAmount = returnAmount * (commissionPercent / 100);

  // GST on Commission (Rate 18% constant)

  const GST = commissionAmount * (GSTPercent / 100);

  // Return in Paise
  return {
    returnAmount: returnAmount.toPrecision(2) * 100,
    tax: GST.toPrecision(2) * 100,
    commissionAmount: commissionAmount.toPrecision(2) * 100,
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
      let amount = tents.reduce((price, tent) => price + tent.bookingPrice, 0);
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
        'name phoneNumber email credits razorpayAccountId razorpayCustomerId location',
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

      const transferAmount = calculateTransferAmount(amount);

      if (campData.razorpayAccountId) {
        // Send Money to Camp Owner's Account
        await instance.transfers.create({
          account: campData.razorpayAccountId,
          amount: parseInt(transferAmount.returnAmount, 10),
          currency: 'INR',
        });

        const invoice = await InvoiceModel.create({
          serviceCharge: transferAmount.commissionAmount,
          tax: transferAmount.tax,
          totalAmount: transferAmount.returnAmount,
          booking: booking._id,
          camp: campData._id,
        });
        // Send Camp Owner the bill for booking
        await emailer.sendCampOwnerBill(
          booking,
          campData,
          transferAmount,
          invoice,
        );

        if (!campData.razorpayCustomerId) {
          // If no customer Id exists for the camp-owner create one
          // Remove commas from name (if any)
          campData.name = campData.name.replace(',', '');
          const customer = await instance.customers.create({
            name: campData.name,
            email: campData.email,
            contact: campData.phoneNumber,
          });
          campData.razorpayCustomerId = customer.id;
          await campData.save();
        }
      } else {
        // Add Credits to the Camp Owner's Account if the account is not present.
        campData.credits += transferAmount.returnAmount;
        await campData.save();
      }

      // Return the booking token's id
      return booking;
    } catch (err) {
      return err;
    }
  },
};

// Calculates User's Refund Amount
function RefundAmountCalculator(booking) {
  const daysLeft = moment(booking.startDate).diff(moment(), 'days');
  let refundPercent = 0;

  if (daysLeft >= 15) {
    refundPercent = 75;
  } else if (daysLeft >= 7 && daysLeft < 15) {
    refundPercent = 60;
  } else if (daysLeft >= 2 && daysLeft < 7) {
    refundPercent = 40;
  } else if (daysLeft >= 0 && daysLeft < 2) {
    refundPercent = 20;
  } else {
    refundPercent = 0;
  }

  const refundAmount = (parseInt(booking.amount.toString(), 10) * refundPercent) / 100;

  const commissionPercent = 12;
  const campzyCommission = (parseInt(booking.amount.toString(), 10) * commissionPercent) / 100;

  const campOwnerCredit = parseInt(booking.amount.toString(), 10) - refundAmount - campzyCommission;

  return {
    userRefund: refundAmount.toPrecision(2),
    campzyCommission: campzyCommission.toPrecision(2),
    campOwnerCredit: campOwnerCredit.toPrecision(2),
  };
}

const cancelBooking = {
  type: BookingType,
  args: {
    bookingCode: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, context) {
    const user = await auth.getAuthenticatedUser(context.req);
    if (!user) {
      throw new NotLoggedinError();
    }

    // Reverse the Refund Amount To User from the back-end amount
    const booking = await BookingModel.findOne({
      code: args.bookingCode,
    });
    if (booking === null) {
      throw new BookingNotCancelled();
    }
    const refundAmount = RefundAmountCalculator(booking);

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET,
    });

    const campData = CampModel.findById(booking.camp);
    campData.credit
      -= parseInt(booking.amount.toString(), 10) - refundAmount.campOwnerCredit;

    const userData = UserModel.findById(booking.user);

    await instance.payments.refund(booking.razorpayPaymentId, {
      amount: refundAmount.userRefund * 100, // Razorpay takes money in paise
    });

    booking.isCancelled = true;
    await booking.save();

    // TODO: Send an email and sms to user
    await sms.sendSMS(
      userData.phoneNumber,
      `We have cancelled your booking for ${
        campData.name
      }. ₹ ${refundAmount} will be refunded to your account within 48 hours.`,
    );

    // TODO: Send an email and sms to camp owner
    await sms.sendSMS(
      campData.phoneNumber,
      `${userData.name} has cancelled their booking for your camp ${
        campData.name
      }. You will be paid ₹ ${
        refundAmount.campOwnerCredit
      } for your troubles by Campzy.`,
    );
  },
};

module.exports = { bookCheck, book, cancelBooking };
