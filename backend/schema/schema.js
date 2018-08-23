const graphql = require('graphql');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.js');
const CampModel = require('../models/camp.js');
const auth = require('../config/auth');

const {
  GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList,
} = graphql;

const CampType = new GraphQLObjectType({
  name: 'Camp',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    owner: {
      type: UserType, // eslint-disable-line
      resolve(parent) {
        return UserModel.findById(parent.ownerId, 'name');
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

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    camp: {
      type: CampType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        try {
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
          return await UserModel.find(
            { $text: { $search: args.searchTerm } },
            { score: { $meta: 'textScore' } },
          ).sort({ score: { $meta: 'textScore' } });
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
          const passwordsMatch = await bcrypt.compare(password, userDocument.password);
          if (passwordsMatch) {
            // Returns the jwt containing user's id, email and token
            return { jwt: JSON.stringify(userDocument.generateJWT()) };
          }
          return new Error('Invalid Username or Password');
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
          await userDocument.save();
          return 'Successfully created account';
        } catch (err) {
          console.log(err);
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
          });
          return await camp.save();
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
