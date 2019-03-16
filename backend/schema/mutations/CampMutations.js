const graphql = require('graphql');
const CampModel = require('../../models/camp.js');
const UserModel = require('../../models/user.js');
const CampType = require('../types/CampType');
const {
  NotLoggedinError,
  PrivilegeError,
} = require('../graphqlErrors');
const auth = require('../../config/auth');

const {
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLNonNull,
} = graphql;

const addCamp = {
  type: CampType,
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    phoneNumber: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    gst: {
      type: new GraphQLNonNull(GraphQLString),
    },
    location: {
      type: new GraphQLNonNull(GraphQLString),
    },
    url: {
      type: new GraphQLNonNull(GraphQLString),
    },
    tags: {
      type: new GraphQLList(GraphQLString),
    },
    ownerId: {
      type: new GraphQLNonNull(GraphQLString),
    },
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
        gst: args.gst,
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
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: GraphQLString,
    },
    phoneNumber: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    gst: {
      type: GraphQLString,
    },
    location: {
      type: GraphQLString,
    },
    tags: {
      type: new GraphQLList(GraphQLString),
    },
    ownerId: {
      type: GraphQLString,
    },
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
        gst: args.gst,
        location: args.location,
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
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    phoneNumber: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    url: {
      type: new GraphQLNonNull(GraphQLString),
    },
    tags: {
      type: new GraphQLList(GraphQLString),
    },
    shortDescription: {
      type: new GraphQLNonNull(GraphQLString),
    },
    longDescription: {
      type: new GraphQLNonNull(GraphQLString),
    },
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
        tags: args.tags,
        url: args.url,
      });
    } catch (err) {
      return err;
    }
  },
};

const saveAmenities = {
  type: CampType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    washRoomAttached: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    bonfire: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    hotWater: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    mobileConnectivity: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    mealsInclude: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    petsAllowed: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    chargingPoints: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
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
        amenities: {
          washRoomAttached: args.washRoomAttached,
          bonfire: args.bonfire,
          hotWater: args.hotWater,
          mobileConnectivity: args.mobileConnectivity,
          mealsInclude: args.mealsInclude,
          petsAllowed: args.petsAllowed,
          chargingPoints: args.chargingPoints,
        },
      });
    } catch (err) {
      return err;
    }
  },
};

const savePlacesOfInterest = {
  type: CampType,
  args: {
    id: {
      type: GraphQLString,
    },
    placesOfInterest: {
      type: new GraphQLList(GraphQLString),
    },
    distance: {
      type: GraphQLFloat,
    },
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

      const places = await CampModel.findByIdAndUpdate(
        args.id, {
          $push: {
            placesOfInterest: {
              name: args.name,
              distance: args.distance,
            },
          },
        }, {
          new: true,
        },
      );
      return places;
    } catch (err) {
      return err;
    }
  },
};

const updateCampImages = {
  type: CampType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    images: {
      type: new GraphQLNonNull(GraphQLString),
    },
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
        args.id, {
          $push: {
            images: args.images,
          },
        }, {
          new: true,
        },
      );
    } catch (err) {
      return err;
    }
  },
};

const updateCampDocuments = {
  type: CampType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    campDocuments: {
      type: new GraphQLNonNull(GraphQLString),
    },
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
        args.id, {
          $push: {
            campDocuments: args.campDocuments,
          },
        }, {
          new: true,
        },
      );
    } catch (err) {
      return err;
    }
  },
};

const deleteCampImage = {
  type: CampType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    imageName: {
      type: new GraphQLNonNull(GraphQLString),
    },
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
        $pull: {
          images: args.imageName,
        },
      });
    } catch (err) {
      return err;
    }
  },
};

const deleteCampDocument = {
  type: CampType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    documentName: {
      type: new GraphQLNonNull(GraphQLString),
    },
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
        $pull: {
          campDocuments: args.documentName,
        },
      });
    } catch (err) {
      return err;
    }
  },
};
const deleteCamp = {
  type: CampType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
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
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    isAvailable: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
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
        args.id, {
          isAvailable: args.isAvailable,
        }, {
          new: true,
        },
      );
      return campStatus;
    } catch (err) {
      return err;
    }
  },
};

const acceptAgreement = {
  type: CampType,
  args: {
    agreementAccepted: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
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
      const campAgreement = await CampModel.findByIdAndUpdate({
        _id: userData.ownedCampId,
      }, {
        agreementAccepted: args.agreementAccepted,
      }, {
        new: true,
      });
      return campAgreement;
    } catch (err) {
      return err;
    }
  },
};

const setHeroImage = {
  type: CampType,
  args: {
    heroImage: {
      type: new GraphQLNonNull(GraphQLString),
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
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
        heroImage: args.heroImage,
      }, {
        new: true,
      });
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
  updateCampDocuments,
  deleteCampDocument,
  saveAmenities,
  savePlacesOfInterest,
  acceptAgreement,
  setHeroImage,
};
