// HACK: Remove eslint disable after integrating mlab
/* eslint-disable */

const graphql = require('graphql');
const User = require('../models/user.js');
const Camp = require('../models/camp.js');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList } = graphql;

const CampType = new GraphQLObjectType({
  name: 'Camp',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    tags: new GraphQLList(GraphQLString),
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
    phoneNumber: { type: GraphQLString },
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
        // TODO: Write code to retrieve camp from database
      },
    },
    camps: {
      type: new GraphQLList(CampType),
      resolve(parent, args) {
        // TODO: Return all camps
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // TODO: Write code to retrieve user from database
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        // TODO: Return all users
      },
    },
  },
});

// GraphQL Mutations

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: User,
      args: {
        name: { type: GraphQLString },
      },
      resolve(parent, args) {},
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
