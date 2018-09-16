const graphql = require('graphql');
const CampModel = require('../../models/camp.js');
const UserModel = require('../../models/user.js');
const CampType = require('../types/CampType');
const { NotLoggedinError, PrivilegeError } = require('../graphqlErrors');
const auth = require('../../config/auth');

const { GraphQLString, GraphQLList, GraphQLBoolean } = graphql;

const addCamp = {
  type: CampType,
  args: {
    name: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    email: { type: GraphQLString },
    location: { type: GraphQLString },
    url: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    ownerId: { type: GraphQLString },
    ownedCampId: { type: GraphQLString },
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
      const camp = new CampModel({
        name: args.name,
        phoneNumber: args.phoneNumber,
        email: args.email,
        shortDescription: 'Unfilled Description',
        location: args.location,
        url: args.url,
        tags: args.tags,
        ownerId: args.ownerId,
      });
      const createdCamp = await camp.save();
      return await UserModel.findByIdAndUpdate(args.ownerId, {
        ownedCampId: createdCamp.id,
        type: 'CampOwner',
      });
    } catch (err) {
      return err;
    }
  },
};

const updateCamp = {
  type: CampType,
  args: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    email: { type: GraphQLString },
    location: { type: GraphQLString },
    url: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    ownerId: { type: GraphQLString },
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

      // Remove the relation between old owner of that camp site and camp
      const oldCampData = await CampModel.findById(args.id, 'id ownerId');
      await UserModel.findByIdAndUpdate(oldCampData.ownerId, {
        ownedCampId: null,
        type: 'Camper',
      });

      await CampModel.findByIdAndUpdate(args.id, {
        name: args.name,
        phoneNumber: args.phoneNumber,
        email: args.email,
        location: args.location,
        url: args.url,
        tags: args.tags,
        ownerId: args.ownerId,
      });

      return await UserModel.findByIdAndUpdate(args.ownerId, {
        ownedCampId: args.id,
        type: 'CampOwner',
      });
    } catch (err) {
      return err;
    }
  },
};

const updateUserCamp = {
  type: CampType,
  args: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    email: { type: GraphQLString },
    location: { type: GraphQLString },
    url: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    ownerId: { type: GraphQLString },
    shortDescription: { type: GraphQLString },
    longDescription: { type: GraphQLString },
    amenities: { type: new GraphQLList(GraphQLString) },
    placesOfInterest: { type: new GraphQLList(GraphQLString) },
    campDocuments: { type: new GraphQLList(GraphQLString) },
  },
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

      return await CampModel.findByIdAndUpdate(args.id, {
        name: args.name,
        phoneNumber: args.phoneNumber,
        email: args.email,
        shortDescription: args.shortDescription,
        longDescription: args.longDescription,
        location: args.location,
        url: args.url,
        tags: args.tags,
        ownerId: args.ownerId,
        amenities: args.amenities,
        placesOfInterest: args.placesOfInterest,
        campDocuments: args.campDocuments,
      });
    } catch (err) {
      return err;
    }
  },
};

const updateCampImages = {
  type: CampType,
  args: {
    id: { type: GraphQLString },
    images: { type: GraphQLString },
  },
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
      return await CampModel.findByIdAndUpdate(
        args.id,
        {
          $push: { images: args.images },
        },
        { new: true },
      );
    } catch (err) {
      return err;
    }
  },
};

const deleteCampImage = {
  type: CampType,
  args: {
    id: { type: GraphQLString },
    imageName: { type: GraphQLString },
  },
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
      return await CampModel.findByIdAndUpdate(args.id, {
        $pull: { images: args.imageName },
      });
    } catch (err) {
      return err;
    }
  },
};
const deleteCamp = {
  type: CampType,
  args: {
    id: { type: GraphQLString },
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

      const deleted = await CampModel.findByIdAndRemove(args.id);
      return deleted;
    } catch (err) {
      return err;
    }
  },
};

const campBookingStatus = {
  type: CampType,
  args: {
    id: { type: GraphQLString },
    isAvailable: { type: GraphQLBoolean },
  },
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

      const campStatus = await CampModel.findByIdAndUpdate(
        args.id,
        {
          isAvailable: args.isAvailable,
        },
        { new: true },
      );
      return campStatus;
    } catch (err) {
      return err;
    }
  },
};

module.exports = {
  addCamp,
  updateCamp,
  deleteCamp,
  campBookingStatus,
  updateUserCamp,
  deleteCampImage,
  updateCampImages,
};
