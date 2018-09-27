const graphql = require('graphql');
const { GraphQLDate } = require('graphql-iso-date');
const moment = require('moment');
const Razorpay = require('razorpay');
const BookingType = require('../types/BookingType');
// const CampModel = require('../../models/camp.js');
const TentModel = require('../../models/tent.js');
const BookingModel = require('../../models/booking');
const auth = require('../../config/auth');

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
      isBooked: { $eq: false },
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
        isBooked: { $eq: false },
        bookedBy: { $eq: null },
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

      // Collect the amount from razorpay. Also check the amount with the tent's booking amount.

      // Compare the collected amount with payable amount

      // TODO: Send sms and emails to the user with their booking tickets

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

      // TODO: Send an email to user and camp owner

      // TODO: Send sms alerts to camp owner and user

      // Update the tent's status
      tents.forEach(async (tent) => {
        const modifiedTent = tent;
        modifiedTent.isBooked = true;
        modifiedTent.bookedBy = user.id;
        await modifiedTent.save();
      });
      // Return the booking token's id
      return booking;
    } catch (err) {
      return err;
    }
  },
};

module.exports = { bookCheck, book };
