const graphql = require('graphql');
const TentModel = require('../../models/tent.js');
const CampModel = require('../../models/camp.js');
const UserModel = require('../../models/user.js');
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

const getBestTentinCamp = {
  type: new GraphQLList(TentType),
  args: {
    url: { type: GraphQLString },
    tentCount: { type: GraphQLInt },
    personCount: { type: GraphQLInt },
    bookingStartDate: { type: GraphQLInt },
  },
  async resolve(parent, args) {
    try {
      const camp = await CampModel.findOne({ url: `${args.url}` })
        .populate({
          path: 'inventory',
          match: {
            isAvailable: { $eq: true },
            isBooked: { $eq: false },
            preBookPeriod: { $gte: args.bookingStartDate },
            capacity: { $gte: args.personCount },
          },
          select: 'bookingPrice id capacity',
          sort: 'bookingPrice',
        })
        .select('id inventory');

      const tents = [];

      for (let i = 0; i < camp.inventory.length; i += 1) {
        if (tents.length === args.tentCount) {
          break;
        }
        tents.push(camp.inventory[i]);
      }

      // If we don't have enough tents send null response.
      if (tents.length < args.tentCount) {
        return [];
      }

      // Get the best tent according to provided tent and person count
      return tents;
    } catch (err) {
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
  getBestTentinCamp,
  countCampInventory,
  countBookedTent,
};
