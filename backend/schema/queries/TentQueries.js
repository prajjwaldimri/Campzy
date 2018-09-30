/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const graphql = require('graphql');
const moment = require('moment');
const { filter } = require('p-iteration');
const { GraphQLDate } = require('graphql-iso-date');
const TentModel = require('../../models/tent.js');
const CampModel = require('../../models/camp.js');
const UserModel = require('../../models/user.js');
const BookingModel = require('../../models/booking');
const TentType = require('../types/TentType');
const auth = require('../../config/auth');

const { GraphQLList, GraphQLString, GraphQLInt } = graphql;

const getTent = {
  type: TentType,
  args: {
    id: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserCampOwner = await auth.isUserCampOwner(userData);
      if (userData === null) {
        return new Error('Not Logged In');
      }
      if (!isUserCampOwner) {
        return new Error('Not Privileged Enough');
      }
      return await TentModel.findById(args.id);
    } catch (err) {
      return err;
    }
  },
};

const getAllTents = {
  type: new GraphQLList(TentType),
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserCampOwner = await auth.isUserCampOwner(userData);
      if (userData === null) {
        return new Error('Not Logged In');
      }
      if (!isUserCampOwner) {
        return new Error('Not Privileged Enough');
      }
      const allTents = await TentModel.find({
        camp: userData.ownedCampId,
      }).populate('bookedBy');
      return allTents;
    } catch (err) {
      return err;
    }
  },
};

const getBestTentInCamp = {
  type: new GraphQLList(TentType),
  args: {
    url: { type: GraphQLString },
    tentCount: { type: GraphQLInt },
    personCount: { type: GraphQLInt },
    preBookPeriod: { type: GraphQLInt },
    bookingStartDate: { type: GraphQLDate },
    bookingEndDate: { type: GraphQLDate },
  },
  async resolve(parent, args) {
    try {
      const camp = await CampModel.findOne({ url: `${args.url}` })
        .populate({
          path: 'inventory',
          match: {
            isAvailable: { $eq: true },
            preBookPeriod: { $gte: args.preBookPeriod },
            capacity: { $gte: args.personCount },
          },
          select: 'bookingPrice id capacity disabledDates',
        })
        .select('id inventory');

      let { inventory } = camp;
      inventory = inventory.filter((tent) => {
        // Check if any of the disabled dates fall between the booking start and end date
        const isDisableDateInBetween = tent.disabledDates.some(date => moment(date).isBetween(
          moment(args.bookingStartDate).subtract(1, 'day'),
          moment(args.bookingEndDate).add(1, 'day'),
          'days',
        ));
        return !isDisableDateInBetween;
      });

      inventory = await filter(inventory, async (tent) => {
        // Get all bookings of tents
        // Check whether the provided clashes with other bookings
        const bookings = await BookingModel.find({ tents: tent._id });
        const isDisableDateInBetween = bookings.some(
          booking => moment(args.bookingStartDate).isBetween(
            moment(booking.startDate).subtract(1, 'day'),
            moment(booking.endDate).add(1, 'day'),
            'days',
          )
            || moment(args.bookingEndDate).isBetween(
              moment(booking.startDate).subtract(1, 'day'),
              moment(booking.endDate).add(1, 'day'),
              'days',
            ),
        );

        return !isDisableDateInBetween;
      });

      const tents = inventory
        .sort((a, b) => a.bookingPrice - b.bookingPrice)
        .slice(0, args.tentCount);

      // If we don't have enough tents send empty response.
      if (tents.length < args.tentCount) {
        return [];
      }

      return tents;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};

const countCampInventory = {
  type: TentType,
  args: {},

  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserCampOwner = await auth.isUserCampOwner(userData);
      if (userData === null) {
        return new Error('Not Logged In');
      }
      if (!isUserCampOwner) {
        return new Error('Not Privileged Enough');
      }
      const count = await TentModel.count({
        camp: userData.ownedCampId,
      });
      return { count };
    } catch (err) {
      return err;
    }
  },
};

const countBookedTent = {
  type: TentType,
  args: {},
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserCampOwner = await auth.isUserCampOwner(userData);
      if (userData === null) {
        return new Error('Not Logged In');
      }
      if (!isUserCampOwner) {
        return new Error('Not Privileged Enough');
      }
      const bookedTentCount = await TentModel.count({
        camp: userData.ownedCampId,
        isBooked: true,
      });
      return { bookedTentCount };
    } catch (err) {
      return err;
    }
  },
};

module.exports = {
  getTent,
  getAllTents,
  getBestTentInCamp,
  countCampInventory,
  countBookedTent,
};
