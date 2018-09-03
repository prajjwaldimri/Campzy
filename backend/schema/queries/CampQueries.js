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
    minPrice: { type: GraphQLInt },
    maxPrice: { type: GraphQLInt },
    page: { type: GraphQLInt },
  },
  async resolve(parent, args) {
    console.log(args);
    const results = await CampModel.find(
      { $text: { $search: args.searchTerm } },
      { score: { $meta: 'textScore' } },
    )
      .and({ isAvailable: { $eq: false } }) // TODO: Change this to true
      .populate({
        path: 'inventory',
        match: {
          isBooked: { $eq: false },
          // bookingPrice: { $gte: args.minPrice, $lte: args.maxPrice },
          preBookPeriod: { $gte: args.bookingStartDate },
        },
        select: 'bookingPrice, preBookPeriod',
      })
      .limit(10)
      .skip((args.page - 1) * 10)
      .sort({ score: { $meta: 'textScore' } });

    // Delete camps with no inventory
    for (let i = 0; i < results.length; i += 1) {
      if (results[i].inventory.length === 0) {
        delete results[i];
      }
    }
    // console.log(results);
    return results;
  },
};

module.exports = {
  getCamp,
  getCurrentUserCamp,
  getAllCamps,
  countTotalCamps,
  searchParticularCamp,
  campSearchUser,
};
