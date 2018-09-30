const graphql = require('graphql');
const CampModel = require('../../models/camp.js');
const UserModel = require('../../models/user.js');
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
    bookingStartDate: { type: GraphQLInt },
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
            preBookPeriod: { $gte: args.bookingStartDate },
          },
          select: 'bookingPrice capacity',
        })
        .limit(10)
        .skip((args.page - 1) * 10)
        .sort({ score: { $meta: 'textScore' } });

      results = results.filter((result) => {
        const requiredCapacity = args.tentCount * args.personCount;
        let availableCapacity = 0;
        for (let j = 0; j < result.inventory.length; j += 1) {
          availableCapacity += result.inventory[j].capacity;

          // Get all bookings of tents
          // Check whether the provided clashes with other bookings
        }
        return (
          result.inventory.length === 0
          || result.inventory.length < args.tentCount
          || availableCapacity < requiredCapacity
        );
      });

      return results;
    } catch (err) {
      console.log(err);
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
