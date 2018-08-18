/* eslint-disable */

const graphql = require('graphql');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.js');
const CampModel = require('../models/camp.js');
const auth = require('../config/auth');
const jwt = require('jsonwebtoken');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList } = graphql;

const CampType = new GraphQLObjectType({
  name: 'Camp',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    phone_number: { type: GraphQLString },
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
    phone_number: { type: GraphQLString },
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
      resolve(parent, args) {
        return CampModel.findById(args.id);
      },
    },
    camps: {
      type: new GraphQLList(CampType),
      resolve(parent, args, context) {
        // TODO:
        let token = auth(context);
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
          if (err) console.log(err);
          console.log(payload);
        });
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return UserModel.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return UserModel.find({});
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
            phone_number: args.phoneNumber,
          });
          let user = userDocument.save();
          console.log(userDocument.generateJWT());
          console.log(userDocument.toAuthJSON());
        } catch (error) {
          throw new Error(error);
        }
      },
    },
    addCamp: {
      type: CampType,
      args: {
        name: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
      },
      resolve(parent, args, context) {},
    },
    loginUser: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args, context) {},
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
