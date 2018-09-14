const graphql = require('graphql');
const { GraphQLDate } = require('graphql-iso-date');
const moment = require('moment');
const BookingType = require('../types/BookingType');
const CampModel = require('../../models/camp.js');
// const UserModel = require('../../models/user.js');
const auth = require('../../config/auth');

const {
  NotLoggedinError,
  TentNotAvailableError,
  CampNotAvailableError,
} = require('../graphqlErrors');

const { GraphQLString, GraphQLInt } = graphql;

// Checks if camp can book user on provided parameters
const bookCheck = {
  type: BookingType,
  args: {
    campId: { type: GraphQLString },
    adultCount: { type: GraphQLInt },
    childrenCount: { type: GraphQLInt },
    fromDate: { type: GraphQLDate },
  },
  async resolve(parent, args, context) {
    const user = await auth.getAuthenticatedUser(context.req);

    if (!user) {
      throw new NotLoggedinError();
    }
    const seatsRequired = args.adultCount + args.childrenCount;
    let availableCamp = {};

    const preBookPeriod = moment(args.fromDate).diff(Date.now(), 'days');

    // Get Camp's Tents
    const campData = await CampModel.findOne({
      _id: args.campId,
      // TODO: Uncomment this before production
      // isAvailable: { $eq: true },
    })
      .select('inventory')
      .populate({
        path: 'inventory',
        match: {
          isBooked: { $eq: false },
          preBookPeriod: { $gte: preBookPeriod },
        },
      });

    if (!campData) {
      throw new CampNotAvailableError();
    }

    campData.inventory.forEach((tent) => {
      // TODO: Check also for availability of tent
      if (tent.capacity <= seatsRequired) {
        availableCamp = tent;
      }
    });

    if (availableCamp) {
      return 'Booking Possible!';
    }
    throw new TentNotAvailableError();
  },
};

module.exports = { bookCheck };
