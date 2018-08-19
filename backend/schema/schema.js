/* eslint-disable */

const graphql = require('graphql');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.js');
const CampModel = require('../models/camp.js');
const auth = require('../config/auth');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList } = graphql;

const CampType = new GraphQLObjectType({
  name: 'Camp',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    owner: {
      type: UserType, // eslint-disable-line
      resolve(parent, args) {
        // TODO: Get Camp Owners
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
    ownedCamps: {
      type: new GraphQLList(CampType),
      resolve(parent, args) {
        // TODO: Get Owned Camps
      },
    },
    bookedCamps: {
      type: new GraphQLList(CampType),
      resolve(parent, args) {
        // TODO: Get Booked Camps
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    camp: {
      type: CampType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args, context) {
        // TODO:
      },
    },
    camps: {
      type: new GraphQLList(CampType),
      async resolve(parent, args, context) {
        try {
          const user = await auth.getAuthenticatedUser(context.req);
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
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args, context) {
        // TODO:
      },
    },
  },
});

// GraphQL Mutations

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
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
          let user = await userDocument.save();
          return 'Successfully created account';
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
      },
      resolve(parent, args, context) {
        // TODO:
      },
    },
    loginUser: {
      type: UserType,
      async resolve(parent, args, context) {
        try {
          if (!context.req.body) {
            return new Error('Please fill both email and password');
          }

          if (!context.req.body.variables) {
            return new Error('Please fill both email and password');
          }

          const email = context.req.body.variables.email;
          const password = context.req.body.variables.email;

          if (!email || !password) {
            return new Error('Please fill both email and password');
          }

          const userDocument = await UserModel.findOne({ email: email });
          const passwordsMatch = await bcrypt.compare(password, userDocument.password);
          if (passwordsMatch) {
            // Returns the jwt containing user's id, email and token
            return { jwt: JSON.stringify(userDocument.toAuthJSON()) };
          } else {
            return new Error('Invalid Username or Password');
          }
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
