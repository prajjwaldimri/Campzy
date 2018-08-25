/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const graphql = require('graphql');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.js');
const CampModel = require('../models/camp.js');
const TentModel = require('../models/tent.js');
const auth = require('../config/auth');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean,
} = graphql;

const CampType = new GraphQLObjectType({
  name: 'Camp',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    email: { type: GraphQLString },
    isEmailVerified: { type: GraphQLBoolean },
    isBlacklisted: { type: GraphQLBoolean },
    location: { type: GraphQLString },
    url: { type: GraphQLString },
    owner: {
      type: UserType, // eslint-disable-line
      resolve(parent) {
        return UserModel.findById(parent.ownerId, 'name email');
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    jwt: { type: GraphQLString },
    dateOfBirth: { type: GraphQLString },
  }),
});

const TentType = new GraphQLObjectType({
  name: 'Tent',
  fields: () => ({
    id: { type: GraphQLID },
    capacity: { type: GraphQLString },
    type: { type: GraphQLBoolean },
    isBooked: { type: GraphQLString },
    bookingPrice: { type: GraphQLString },
    surgePrice: { type: GraphQLString },
    preBookPeriod: { type: GraphQLString },
    bookedBy: { type: GraphQLID },
  }),
});

const TokenType = new GraphQLObjectType({
  name: 'Token',
  fields: () => ({
    tokenValue: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    camp: {
      type: CampType,
      args: { id: { type: GraphQLString } },
      async resolve(parent, args, context) {
        try {
          const user = await auth.getAuthenticatedUser(context.req);
          const userData = await UserModel.findById(user.id);
          const isUserAdmin = await auth.isUserAdmin(userData);
          if (userData === null) {
            return new Error('Not Logged In');
          }
          if (!isUserAdmin) {
            return new Error('Not Privileged Enough');
          }
          return await CampModel.findById(args.id);
        } catch (err) {
          return err;
        }
      },
    },
    allCamps: {
      // Returns all camps
      type: new GraphQLList(CampType),
      async resolve(parent, args, context) {
        try {
          const user = await auth.getAuthenticatedUser(context.req);
          const userData = await UserModel.findById(user.id);
          const isUserAdmin = await auth.isUserAdmin(userData);
          if (userData === null) {
            return new Error('Not Logged In');
          }
          if (!isUserAdmin) {
            return new Error('Not Privileged Enough');
          }
          return await CampModel.find({});
        } catch (err) {
          return err;
        }
      },
    },
    currentUser: {
      type: UserType,
      args: {},
      async resolve(parent, args, context) {
        try {
          const user = await auth.getAuthenticatedUser(context.req);
          const userData = await UserModel.findById(user.id);
          if (userData === null) {
            return new Error('Not Logged In');
          }
          return userData;
        } catch (err) {
          return err;
        }
      },
    },
    user: {
      // Returns a specific user by id
      type: UserType,
      args: { id: { type: GraphQLString } },
      async resolve(parent, args, context) {
        try {
          const user = await auth.getAuthenticatedUser(context.req);
          const userData = await UserModel.findById(user.id);
          const isUserAdmin = await auth.isUserAdmin(userData);
          if (userData === null) {
            return new Error('Not Logged In');
          }
          if (!isUserAdmin) {
            return new Error('Not Privileged Enough');
          }
          return await UserModel.findById(args.id);
        } catch (err) {
          return err;
        }
      },
    },
    searchUser: {
      type: new GraphQLList(UserType),
      args: {
        searchTerm: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        try {
          const user = await auth.getAuthenticatedUser(context.req);
          const userData = await UserModel.findById(user.id);
          const isUserAdmin = auth.isUserAdmin(userData);
          if (userData === null) {
            return new Error('Not Logged In');
          }
          if (!isUserAdmin) {
            return new Error('Not Privileged Enough');
          }
          return await UserModel.find({ name: { $regex: args.searchTerm } });
        } catch (err) {
          return err;
        }
      },
    },
    allUsers: {
      // Returns all users from DB
      type: new GraphQLList(UserType),
      async resolve(parent, args, context) {
        try {
          const user = await auth.getAuthenticatedUser(context.req);
          const userData = await UserModel.findById(user.id);
          const isUserAdmin = auth.isUserAdmin(userData);
          if (userData === null) {
            return new Error('Not Logged In');
          }
          if (!isUserAdmin) {
            return new Error('Not Privileged Enough');
          }
          return await UserModel.find({});
        } catch (err) {
          return err;
        }
      },
    },
    loginUser: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try {
          const { email } = args;
          const { password } = args;

          if (!email || !password) {
            return new Error('Please fill both email and password');
          }

          const userDocument = await UserModel.findOne({ email });
          if (userDocument.isBlacklisted) {
            return new Error('Your account has been disabled. Please contact Campzy support');
          }
          const passwordsMatch = await bcrypt.compare(password, userDocument.password);
          if (!passwordsMatch) {
            return new Error('Invalid Username or Password');
          }
          // Returns the jwt containing user's id, email and token

          return { jwt: JSON.stringify(userDocument.generateJWT()) };
        } catch (err) {
          return err;
        }
      },
    },
  },
});

// GraphQL Mutations

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    register: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try {
          const passwordHash = await bcrypt.hash(args.password, 10);
          const userDocument = new UserModel({
            email: args.email,
            password: passwordHash,
            phoneNumber: args.phoneNumber,
          });
          const createdUser = await userDocument.save();
          await auth.sendUserToken(createdUser._id, args.email);
          return 'Successfully created account';
        } catch (err) {
          return err;
        }
      },
    },
    // Confirms the user's email
    confirmEmailToken: {
      type: TokenType,
      args: {
        tokenValue: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try {
          await auth.verifyUserToken(args.tokenValue);
          return 'Successfully Verified';
        } catch (err) {
          return err;
        }
      },
    },
    // Resends the email token
    resendEmailToken: {
      type: UserType,
      async resolve(parent, args, context) {
        try {
          const user = await auth.getAuthenticatedUser(context.req);
          await auth.sendUserToken(user.id, user.email);
          return 'Sent Verification Email';
        } catch (err) {
          return err;
        }
      },
    },
    updateUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        currentPassword: { type: GraphQLString },
        newPassword: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        try {
          const user = await auth.getAuthenticatedUser(context.req);
          let userData = await UserModel.findById(user.id, 'password');
          const isPasswordCorrect = await bcrypt.compare(args.currentPassword, userData.password);

          if (isPasswordCorrect) {
            if (args.newPassword) {
              const password = await bcrypt.hash(args.newPassword, 10);
              userData = await UserModel.findByIdAndUpdate(
                user.id,
                { name: args.name, password },
                { select: 'email name' },
              );
            } else {
              userData = await UserModel.findByIdAndUpdate(
                user.id,
                { name: args.name },
                { select: 'email name' },
              );
            }
            return userData;
          }
          return new Error('Wrong Password');
        } catch (err) {
          return err;
        }
      },
    },
    addCamp: {
      type: CampType,
      args: {
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
            return new Error('Not Logged In');
          }
          if (!isUserAdmin) {
            return new Error('Not Privileged Enough');
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
    },
    updateCamp: {
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
            return new Error('Not Logged In');
          }
          if (!isUserAdmin) {
            return new Error('Not Privileged Enough');
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
            shortDescription: 'Unfilled Description',
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
    },
    deleteCamp: {
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
            return new Error('Not Logged In');
          }
          if (!isUserAdmin) {
            return new Error('Not Privileged Enough');
          }

          const deleted = await CampModel.findByIdAndRemove(args.id);
          return deleted;
        } catch (err) {
          return err;
        }
      },
    },
    // Inventory Management
    addTent: {
      type: TentType,
      args: {
        capacity: { type: GraphQLString },
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
            return new Error('Not Logged In');
          }
          if (!isUserCampOwner) {
            return new Error('Not Privileged Enough');
          }
          const ownedCamp = await CampModel.findOne({ ownerId: userData._id }, 'id');
          const tent = new TentModel({
            capacity: args.capacity,
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
    },
    updateTent: {
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
            return new Error('Not Logged In');
          }
          if (!isUserCampOwner) {
            return new Error('Not Privileged Enough');
          }

          const ownedCamp = await CampModel.findOne({ ownerId: userData._id }, 'id');
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
    },
    deleteTent: {
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
            return new Error('Not Logged In');
          }
          if (!isUserCampOwner) {
            return new Error('Not Privileged Enough');
          }

          const tent = await TentModel.findById(args.id, 'camp');
          const associatedCamp = await CampModel.findById(tent.camp);
          const newInventory = associatedCamp.inventory.filter(value => value !== args.id);
          associatedCamp.inventory = newInventory;
          await associatedCamp.save();
          return await TentModel.findByIdAndRemove(args.id);
        } catch (err) {
          return err;
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
