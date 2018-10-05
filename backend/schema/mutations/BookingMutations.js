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
        'name phoneNumber email',
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

      // TODO: Send an email to camp owner

      // Return the booking token's id
      return booking;
    } catch (err) {
      return err;
    }
  },
};

// function AddComissionandTaxes(amount) {
//   return Promise((resolve, reject) => {
//     if (parseFloat(amount) === undefined) {
//       reject('Amount is not valid');
//     }
//     const commission = math.fraction(0);
//     const gst = math.fraction(0);
//     if (amount < 1000) {
//     } else if (amount < 2500) {
//     } else if (amount < 7500) {
//     } else {
//     }
//     resolve(amount + gst);
//   });
// }

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
