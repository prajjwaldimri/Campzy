/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_userId"] }] */

const graphql = require('graphql');

const UserQueries = require('./queries/UserQueries');
const CampQueries = require('./queries/CampQueries');
const TentQueries = require('./queries/TentQueries');
const TokenQueries = require('./queries/TokenQueries');

const UserMutations = require('./mutations/UserMutations');
const CampMutations = require('./mutations/CampMutations');
const TentMutations = require('./mutations/TentMutations');
const TokenMutations = require('./mutations/TokenMutations');
const OTPMutations = require('./mutations/OTPMutations');

const { GraphQLObjectType, GraphQLSchema } = graphql;

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    camp: CampQueries.getCamp,
    campUser: CampQueries.getCampUser,
    currentUserCamp: CampQueries.getCurrentUserCamp,
    countCamps: CampQueries.countTotalCamps,
    allCamps: CampQueries.getAllCamps,
    searchCamp: CampQueries.searchParticularCamp,
    campSearchUser: CampQueries.campSearchUser,
    tent: TentQueries.getTent,
    allTents: TentQueries.getAllTents,
    currentUser: UserQueries.currentUser,
    user: UserQueries.getUser,
    searchUser: UserQueries.searchUser,
    allUsers: UserQueries.getAllUsers,
    loginUser: UserQueries.loginUser,
    sendResetPasswordToken: TokenQueries.sendResetPasswordToken,
    countUsers: UserQueries.countTotalUsers,
    searchUniqueUser: UserQueries.searchParticularUser,
  },
});

// GraphQL Mutations

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    register: UserMutations.registerUser,
    confirmEmailToken: TokenMutations.confirmEmailToken,
    resendEmailToken: TokenMutations.resendEmailToken,
    sendOTP: OTPMutations.sendOTP,
    resetPassword: UserMutations.resetPassword,
    updateUser: UserMutations.updateUser,
    addCamp: CampMutations.addCamp,
    updateCamp: CampMutations.updateCamp,
    deleteCamp: CampMutations.deleteCamp,
    addTent: TentMutations.addTent,
    updateTent: TentMutations.updateTent,
    deleteTent: TentMutations.deleteTent,
    closeTentBooking: TentMutations.closeBookings,
    campAvailability: CampMutations.campBookingStatus,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
