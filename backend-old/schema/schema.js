/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_userId"] }] */

const graphql = require('graphql');

const UserQueries = require('./queries/UserQueries');
const CampQueries = require('./queries/CampQueries');
const TentQueries = require('./queries/TentQueries');
const TokenQueries = require('./queries/TokenQueries');
const BlogQueries = require('./queries/BlogQueries');
const BookingQueries = require('./queries/BookingQueries');
const ReviewQueries = require('./queries/ReviewQueries');
const RequestsQueries = require('./queries/RequestsQueries');

const UserMutations = require('./mutations/UserMutations');
const CampMutations = require('./mutations/CampMutations');
const TentMutations = require('./mutations/TentMutations');
const TokenMutations = require('./mutations/TokenMutations');
const OTPMutations = require('./mutations/OTPMutations');
const BlogMutations = require('./mutations/BlogMutations');
const BookingMutations = require('./mutations/BookingMutations');
const ReviewMutations = require('./mutations/ReviewMutations');
const BankMutations = require('./mutations/BankMutations');
const RequestsMutations = require('./mutations/RequestsMutation');

const {
  GraphQLObjectType,
  GraphQLSchema,
} = graphql;

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    camp: CampQueries.getCamp,
    campUser: CampQueries.getCampUser,
    getImagesOfCamp: CampQueries.getImagesOfCamp,
    currentUserCamp: CampQueries.getCurrentUserCamp,
    countCamps: CampQueries.countTotalCamps,
    allCamps: CampQueries.getAllCamps,
    searchCamp: CampQueries.searchParticularCamp,
    campSearchUser: CampQueries.campSearchUser,
    isCampUrlAvailable: CampQueries.isCampUrlAvailable,
    getCampsInPlace: CampQueries.getCampsInPlace,
    getCampsLocation: CampQueries.getCampsLocation,

    tent: TentQueries.getTent,
    allTents: TentQueries.getAllTents,
    bestTentInCamp: TentQueries.getBestTentInCamp,
    countCampTents: TentQueries.countCampInventory,
    countBookedTent: TentQueries.countBookedTent,

    currentUser: UserQueries.currentUser,
    user: UserQueries.getUser,
    searchUser: UserQueries.searchUser,
    allUsers: UserQueries.getAllUsers,
    loginUser: UserQueries.loginUser,
    isEmailAvailable: UserQueries.isEmailAvailable,
    sendResetPasswordToken: TokenQueries.sendResetPasswordToken,
    countUsers: UserQueries.countTotalUsers,
    searchUniqueUser: UserQueries.searchParticularUser,
    getUserWishlist: UserQueries.getWishlist,
    getWishlistInProfile: UserQueries.getWishlistInProfile,

    currentUserBlogs: UserQueries.getCurrentUserBlog,
    getBlog: BlogQueries.getBlog,
    getUpdateBlog: BlogQueries.getUpdateBlog,
    getUserBookings: BookingQueries.getUserBookings,
    getAllBlogs: BlogQueries.getAllBlogs,

    campBookings: BookingQueries.getCampBookings,
    countCampActiveBookings: BookingQueries.countCampActiveBookings,
    allBookings: BookingQueries.allBookings,
    countAdminPastBookings: BookingQueries.countAdminPastBookings,
    countCampPastBookings: BookingQueries.countCampPastBookings,

    getLatestCampForReview: ReviewQueries.getLatestCampForReview,
    getReviewsForCamp: ReviewQueries.getReviewsForCamp,
    isIFSCValid: BankMutations.isIFSCValid,
    getIFSCDetails: BankMutations.getIFSCDetails,
    getBankDetails: BankMutations.getBank,

    getAllRequests: RequestsQueries.allRequests,
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
    addCampToWishlist: UserMutations.addCampToWishlist,
    removeFromWishlist: UserMutations.removeFromWishlist,

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
    saveAmenities: CampMutations.saveAmenities,
    saveActivities: CampMutations.saveActivities,
    acceptAgreement: CampMutations.acceptAgreement,
    setHeroImage: CampMutations.setHeroImage,

    addTent: TentMutations.addTent,
    updateTent: TentMutations.updateTent,
    deleteTent: TentMutations.deleteTent,
    closeBookingByDates: TentMutations.disabledTentBookings,

    addBlogger: BlogMutations.addBlogger,
    addBlog: BlogMutations.addBlog,
    updateBlog: BlogMutations.updateBlog,
    deleteBlog: BlogMutations.deleteBlog,

    bookCampCheck: BookingMutations.bookCheck,
    bookCamp: BookingMutations.book,
    cancelBooking: BookingMutations.cancelBooking,

    addReview: ReviewMutations.addReview,

    addBank: BankMutations.addBank,

    addRequests: RequestsMutations.addRequests,
    deleteRequests: RequestsMutations.deleteRequests,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});