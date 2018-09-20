/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_userId"] }] */
const graphql = require('graphql');
const CampModel = require('../../models/camp.js');
const UserModel = require('../../models/user.js');
const TentModel = require('../../models/tent.js');
const TentType = require('../types/TentType');
const { NotLoggedinError, PrivilegeError } = require('../graphqlErrors');
const auth = require('../../config/auth');

const { GraphQLString, GraphQLBoolean } = graphql;

const addTent = {
  type: TentType,
  args: {
    capacity: { type: GraphQLString },
    type: { type: GraphQLString },
    bookingPrice: { type: GraphQLString },
    preBookPeriod: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserCampOwner = auth.isUserCampOwner(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserCampOwner) {
        throw new PrivilegeError();
      }
      const ownedCamp = await CampModel.findOne(
        { ownerId: userData._id },
        'id',
      );
      const tent = new TentModel({
        capacity: args.capacity,
        type: args.type,
        bookingPrice: args.bookingPrice,
        preBookPeriod: args.preBookPeriod,
        camp: ownedCamp._id,
      });
      return await tent.save();
    } catch (err) {
      return err;
    }
  },
};

const updateTent = {
  type: TentType,
  args: {
    capacity: { type: GraphQLString },
    isBooked: { type: GraphQLBoolean },
    type: { type: GraphQLString },
    bookingPrice: { type: GraphQLString },
    surgePrice: { type: GraphQLString },
    preBookPeriod: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserCampOwner = auth.isUserCampOwner(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserCampOwner) {
        throw new PrivilegeError();
      }

      const ownedCamp = await CampModel.findOne(
        { ownerId: userData._id },
        'id',
      );
      const tent = new TentModel({
        capacity: args.capacity,
        isBooked: args.isBooked,
        type: args.type,
        bookingPrice: args.bookingPrice,
        surgePrice: args.surgePrice,
        preBookPeriod: args.preBookPeriod,
        camp: ownedCamp._id,
      });
      return await tent.save();
    } catch (err) {
      return err;
    }
  },
};

const deleteTent = {
  type: TentType,
  args: {
    id: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserCampOwner = auth.isUserCampOwner(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserCampOwner) {
        throw new PrivilegeError();
      }

      const tent = await TentModel.findById(args.id, 'camp');
      const associatedCamp = await CampModel.findById(tent.camp);
      const newInventory = associatedCamp.inventory.filter(
        value => value !== args.id,
      );
      associatedCamp.inventory = newInventory;
      await associatedCamp.save();
      return await TentModel.findByIdAndRemove(args.id);
    } catch (err) {
      return err;
    }
  },
};

const closeBookings = {
  type: TentType,
  args: {
    id: { type: GraphQLString },
    isAvailable: { type: GraphQLBoolean },
  },
  async resolve(parent, args, context) {
    try {
      console.log(args);
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserCampOwner = auth.isUserCampOwner(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserCampOwner) {
        throw new PrivilegeError();
      }

      const closeBooking = await TentModel.findByIdAndUpdate(
        args.id,
        {
          isAvailable: args.isAvailable,
        },
        { new: true },
      );
      return closeBooking;
    } catch (err) {
      return err;
    }
  },
};

module.exports = {
  addTent,
  updateTent,
  deleteTent,
  closeBookings,
};
