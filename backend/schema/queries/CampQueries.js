/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/* eslint no-param-reassign: ["error", { "props": false }] */
const graphql = require('graphql');
const moment = require('moment');
const { filter, forEach } = require('p-iteration');
const { GraphQLDate } = require('graphql-iso-date');
const CampModel = require('../../models/camp.js');
const UserModel = require('../../models/user.js');
const BookingModel = require('../../models/booking');
const CampType = require('../types/CampType');
const PlaceType = require('../types/PlaceType');
const { NotLoggedinError, PrivilegeError } = require('../graphqlErrors');
const auth = require('../../config/auth');

const {
  GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull,
} = graphql;

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

const getImagesOfCamp = {
  type: CampType,
  args: {
    url: { type: GraphQLString },
  },
  async resolve(parent, args) {
    try {
      return await CampModel.findOne({ url: `${args.url}` }).select(
        'id name images',
      );
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
      return await CampModel.findById(userData.ownedCampId).populate(
        'ownerId',
        'id',
      );
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
        .populate('ownerId', 'name')
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
    searchTerm: { type: new GraphQLNonNull(GraphQLString) },
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
        .skip((args.page - 1) * 8)
        .populate('ownerId', 'id name');
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
    amenities: { type: new GraphQLList(GraphQLString) },
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
          select: 'id bookingPrice capacity disabledDates',
        })
        .limit(20)
        .skip((args.page - 1) * 20)
        .sort({ score: { $meta: 'textScore' } });

      results = await filter(results, async (result) => {
        const requiredCapacity = args.tentCount * args.personCount;
        let { inventory } = result;
        inventory = await filter(inventory, (tent) => {
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

          const isDisableDateInBetween = bookings.some((booking) => {
            if (booking.isCancelled) {
              return false;
            }
            return (
              moment(args.bookingStartDate).isBetween(
                moment(booking.startDate).subtract(1, 'day'),
                moment(booking.endDate).add(1, 'day'),
                'days',
              )
              || moment(args.bookingEndDate).isBetween(
                moment(booking.startDate).subtract(1, 'day'),
                moment(booking.endDate).add(1, 'day'),
                'days',
              )
            );
          });

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

      // Remove unnecessary tents
      await forEach(results, async (result) => {
        result.inventory = result.inventory.sort(
          (a, b) => a.bookingPrice - b.bookingPrice,
        );
        result.inventory = result.inventory.slice(0, args.tentCount);
      });

      // Check for amenities
      results = await filter(results, async (result) => {
        if (
          args.amenities.includes('Attached Washroom')
          && !result.amenities.washRoomAttached
        ) {
          return false;
        }
        if (
          args.amenities.includes('Charging Points')
          && !result.amenities.chargingPoints
        ) {
          return false;
        }
        if (
          args.amenities.includes('Meals Included')
          && !result.amenities.mealsInclude
        ) {
          return false;
        }
        if (
          args.amenities.includes('Mobile Connectivity')
          && !result.amenities.mobileConnectivity
        ) {
          return false;
        }
        if (args.amenities.includes('Bonfire') && !result.amenities.bonfire) {
          return false;
        }
        if (
          args.amenities.includes('Pets Allowed')
          && !result.amenities.petsAllowed
        ) {
          return false;
        }
        return true;
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

const isCampUrlAvailable = {
  type: CampType,
  args: {
    url: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const user = await CampModel.findOne({ url: args.url });
    if (user) {
      throw new Error('Url is already taken');
    } else {
      return 'Url Available!';
    }
  },
};

const getCampsInPlace = {
  type: PlaceType,
  args: {
    place: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args) {
    try {
      const place = {
        luxuryCamps: [],
        premiumCamps: [],
        normalCamps: [],
        cheapCamps: [],
      };
      const results = await CampModel.find(
        { $text: { $search: args.place } },
        { score: { $meta: 'textScore' } },
      )
        .populate({
          path: 'inventory',
          select: 'id bookingPrice capacity disabledDates',
          options: { sort: { bookingPrice: -1 }, limit: 1 },
        })
        .limit(20)
        .sort({ score: { $meta: 'textScore' } });

      await forEach(results, async (result) => {
        if (result.inventory[0].bookingPrice > 40000) {
          place.luxuryCamps.push(result);
        } else if (result.inventory[0].bookingPrice > 20000) {
          place.premiumCamps.push(result);
        } else if (result.inventory[0].bookingPrice > 10000) {
          place.normalCamps.push(result);
        } else {
          place.cheapCamps.push(result);
        }
      });

      return place;
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
  getImagesOfCamp,
  isCampUrlAvailable,
  getCampsInPlace,
};
