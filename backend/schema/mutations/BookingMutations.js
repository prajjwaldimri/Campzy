const graphql = require('graphql');
const { GraphQLDate } = require('graphql-iso-date');
const moment = require('moment');
const BookingType = require('../types/BookingType');
// const CampModel = require('../../models/camp.js');
const TentModel = require('../../models/tent.js');
const BookingModel = require('../../models/booking');
const auth = require('../../config/auth');

const {
  NotLoggedinError,
  TentNotAvailableError,
  // CampNotAvailableError,
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

async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const book = {
  type: BookingType,
  args: {
    razorpayPaymentId: { type: GraphQLString },
    tentId: { type: GraphQLString },
    tentCount: { type: GraphQLInt },
    personCount: { type: GraphQLInt },
    fromDate: { type: GraphQLDate },
    toDate: { type: GraphQLDate },
  },
  async resolve(parent, args, context) {
    // Check user login and get user's details
    const user = await auth.getAuthenticatedUser(context.req);

    if (!user) {
      throw new NotLoggedinError();
    }

    // Check if the provided tentId is correct and if the tent can be booked
    const seatsRequired = args.adultCount + args.childrenCount;
    const preBookPeriod = moment(args.fromDate).diff(Date.now(), 'days');
    const tent = await TentModel.findById(args.tentId);

    if (
      !tent
      || tent.isBooked
      || tent.capacity < seatsRequired
      || tent.preBookPeriod < preBookPeriod
    ) {
      throw new TentNotAvailableError();
    }

    // TODO: Verify Razorpay Id and collect money
    await wait(5000); // Simulates wait of razorpay

    const amount = 20400; // Collect the amount from razorpay. Also check the amount with the tent's booking amount.

    // Generate a booking token
    const booking = await BookingModel.create({
      razorpayPaymentId: args.razorpayPaymentId,
      tent: args.tentId,
      user: user.id,
      startDate: args.fromDate,
      endDate: args.toDate,
      adultCount: args.adultCount,
      childrenCount: args.childrenCount,
      amount,
    });

    // TODO: Send an email to user and camp owner

    // TODO: Send sms alerts to camp owner and user

    // Update the tent's status
    tent.isBooked = true;
    await tent.save();
    // Return the booking token's id
    return booking;
  },
};

module.exports = { bookCheck, book };
