/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_userId"] }] */

const graphql = require('graphql');

const UserQueries = require('./queries/UserQueries');
const CampQueries = require('./queries/CampQueries');
const TentQueries = require('./queries/TentQueries');
const TokenQueries = require('./queries/TokenQueries');
const BlogQueries = require('./queries/BlogQueries');
const BookingQueries = require('./queries/BookingQueries');

const UserMutations = require('./mutations/UserMutations');
const CampMutations = require('./mutations/CampMutations');
const TentMutations = require('./mutations/TentMutations');
const TokenMutations = require('./mutations/TokenMutations');
const OTPMutations = require('./mutations/OTPMutations');
const BlogMutations = require('./mutations/BlogMutations');
const BookingMutations = require('./mutations/BookingMutations');

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
    bestTentinCamp: TentQueries.getBestTentinCamp,

    currentUser: UserQueries.currentUser,
    user: UserQueries.getUser,
    searchUser: UserQueries.searchUser,
    allUsers: UserQueries.getAllUsers,
    loginUser: UserQueries.loginUser,
    isEmailAvailable: UserQueries.isEmailAvailable,
    sendResetPasswordToken: TokenQueries.sendResetPasswordToken,
    countUsers: UserQueries.countTotalUsers,
    searchUniqueUser: UserQueries.searchParticularUser,

    currentUserBlogs: UserQueries.getCurrentUserBlog,
    getBlog: BlogQueries.getBlog,
    getUpdateBlog: BlogQueries.getUpdateBlog,
    getUserActiveBookings: BookingQueries.getUserActiveBookings,

    campBookings: BookingQueries.getCampBookings,
  },
});

// GraphQL Mutations

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    register: UserMutations.registerUser,
    googleAuth: UserMutations.googleAuth,
    facebookAuth: UserMutations.facebookAuth,
    confirmEmailToken: TokenMutations.confirmEmailToken,
    resendEmailToken: TokenMutations.resendEmailToken,
    sendOTP: OTPMutations.sendOTP,
    resetPassword: UserMutations.resetPassword,
    updateUser: UserMutations.updateUser,

    addCamp: CampMutations.addCamp,
    updateCamp: CampMutations.updateCamp,
    updateUserCamp: CampMutations.updateUserCamp,
    deleteCamp: CampMutations.deleteCamp,
    closeTentBooking: TentMutations.closeBookings,
    campAvailability: CampMutations.campBookingStatus,
    updateCampImages: CampMutations.updateCampImages,
    deleteCampImage: CampMutations.deleteCampImage,
    updateCampDocuments: CampMutations.updateCampDocuments,
    deleteCampDocument: CampMutations.deleteCampDocument,

    addTent: TentMutations.addTent,
    updateTent: TentMutations.updateTent,
    deleteTent: TentMutations.deleteTent,

    addBlogger: BlogMutations.addBlogger,
    addBlog: BlogMutations.addBlog,
    updateBlog: BlogMutations.updateBlog,
    deleteBlog: BlogMutations.deleteBlog,

    bookCampCheck: BookingMutations.bookCheck,
    bookCamp: BookingMutations.book,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
