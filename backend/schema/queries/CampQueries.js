/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const graphql = require('graphql');
const moment = require('moment');
const { filter } = require('p-iteration');
const { GraphQLDate } = require('graphql-iso-date');
const CampModel = require('../../models/camp.js');
const UserModel = require('../../models/user.js');
const BookingModel = require('../../models/booking');
const CampType = require('../types/CampType');
const { NotLoggedinError, PrivilegeError } = require('../graphqlErrors');
const auth = require('../../config/auth');

const { GraphQLString, GraphQLList, GraphQLInt } = graphql;

const getCamp = {
  type: CampType,
  args: {
    id: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserAdmin = await auth.isUserAdmin(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserAdmin) {
        throw new PrivilegeError();
      }
      return await CampModel.findById(args.id);
    } catch (err) {
      return err;
    }
  },
};

const getCurrentUserCamp = {
  type: CampType,
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserCampOwner = await auth.isUserCampOwner(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserCampOwner) {
        throw new PrivilegeError();
      }
      return await CampModel.findById(userData.ownedCampId);
    } catch (err) {
      return err;
    }
  },
};

const getAllCamps = {
  // Returns all camps
  type: new GraphQLList(CampType),
  args: {
    page: { type: GraphQLInt },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserAdmin = await auth.isUserAdmin(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserAdmin) {
        throw new PrivilegeError();
      }
      return await CampModel.find({})
        .limit(8)
        .skip((args.page - 1) * 8);
    } catch (err) {
      return err;
    }
  },
};

const countTotalCamps = {
  // Return total camps length
  type: CampType,
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserAdmin = await auth.isUserAdmin(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserAdmin) {
        throw new PrivilegeError();
      }
      const count = await CampModel.estimatedDocumentCount({});
      return { count };
    } catch (err) {
      return err;
    }
  },
};

const searchParticularCamp = {
  type: new GraphQLList(CampType),
  args: {
    searchTerm: { type: GraphQLString },
    page: { type: GraphQLInt },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserAdmin = auth.isUserAdmin(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserAdmin) {
        throw new PrivilegeError();
      }
      return await CampModel.find({ $text: { $search: args.searchTerm } })
        .limit(8)
        .skip((args.page - 1) * 8);
    } catch (err) {
      return err;
    }
  },
};

// The front page search of Campzy
const campSearchUser = {
  type: new GraphQLList(CampType),
  args: {
    searchTerm: { type: GraphQLString },
    preBookPeriod: { type: GraphQLInt },
    bookingStartDate: { type: GraphQLDate },
    bookingEndDate: { type: GraphQLDate },
    tripDuration: { type: GraphQLInt },
    minPrice: { type: GraphQLInt },
    maxPrice: { type: GraphQLInt },
    page: { type: GraphQLInt },
    tentCount: { type: GraphQLInt },
    personCount: { type: GraphQLInt },
  },
  async resolve(parent, args) {
    try {
      let results = await CampModel.find(
        { $text: { $search: args.searchTerm } },
        { score: { $meta: 'textScore' } },
      )
        .and({ isAvailable: { $eq: true } })
        .populate({
          path: 'inventory',
          match: {
            isAvailable: { $eq: true },
            bookingPrice: {
              $gte: parseInt(args.minPrice / args.tripDuration, 10),
              $lte: parseInt(args.maxPrice / args.tripDuration, 10),
            },
            preBookPeriod: { $gte: args.preBookPeriod },
            capacity: { $gte: args.personCount },
          },
          select: 'id bookingPrice capacity',
        })
        .limit(10)
        .skip((args.page - 1) * 10)
        .sort({ score: { $meta: 'textScore' } });

      results = await filter(results, async (result) => {
        const requiredCapacity = args.tentCount * args.personCount;
        let { inventory } = result;
        inventory = inventory.filter((tent) => {
          // Check if any of the disabled dates fall between the booking start and end date
          if (!tent.disabledDates) {
            return true;
          }
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

        const availableCapacity = inventory.reduce(
          (prevCapacity, tent) => prevCapacity + tent.capacity,
          0,
        );

        return (
          inventory.length !== 0
          && inventory.length >= args.tentCount
          && availableCapacity >= requiredCapacity
        );
      });

      return results;
    } catch (err) {
      return err;
    }
  },
};

// Gets Camp Details from url
const getCampUser = {
  type: CampType,
  args: {
    url: { type: GraphQLString },
    tentCount: { type: GraphQLInt },
    personCount: { type: GraphQLInt },
  },
  async resolve(parent, args) {
    try {
      return await CampModel.findOne({ url: `${args.url}` }).populate({
        path: 'inventory',
        select: 'capacity',
      });
    } catch (err) {
      return err;
    }
  },
};

module.exports = {
  getCamp,
  getCurrentUserCamp,
  getAllCamps,
  countTotalCamps,
  searchParticularCamp,
  campSearchUser,
  getCampUser,
};
