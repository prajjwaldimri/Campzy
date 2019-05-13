/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const graphql = require('graphql');
const { filter } = require('p-iteration');
const BookingType = require('../types/BookingType');
const UserModel = require('../../models/user');
const BookingModel = require('../../models/booking');
const auth = require('../../config/auth');

const { NotLoggedinError } = require('../graphqlErrors');

const {
  GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt,
} = graphql;
const { PrivilegeError } = require('../graphqlErrors');

const getUserBookings = {
  type: new GraphQLList(BookingType),
  args: {
    active: { type: GraphQLBoolean },
    past: { type: GraphQLBoolean },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id).select('id');

      if (!userData) {
        throw new NotLoggedinError();
      }

      const currentDate = new Date();

      let bookings = [];

      if (args.active) {
        bookings = await BookingModel.find({
          // eslint-disable-next-line
          user: userData._id,
          endDate: { $gte: currentDate },
        }).populate('user camp tent');
        bookings = await filter(bookings, booking => !booking.isCancelled);
      } else {
        bookings = await BookingModel.find({
          user: userData._id,
          $or: [{ isCancelled: true }, { endDate: { $lt: currentDate } }],
        }).populate('user camp tent');
      }

      const finalBookings = [];

      bookings.forEach((booking) => {
        let newBooking = {};
        // Deep Copy of object
        newBooking = JSON.parse(JSON.stringify(booking));
        // Convert Decimal128 BSON Type to string amount
        newBooking.amount = booking.amount.toString();
        // GraphQL Iso Date has problems with how Mongo stores Dates
        newBooking.startDate = new Date(booking.startDate);
        newBooking.endDate = new Date(booking.endDate);
        finalBookings.push(newBooking);
      });

      return finalBookings;
    } catch (err) {
      return err;
    }
  },
};

const getCampBookings = {
  type: new GraphQLList(BookingType),
  args: {
    id: { type: GraphQLString },
    active: { type: GraphQLBoolean },
    past: { type: GraphQLBoolean },
    page: { type: GraphQLInt },
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

      const currentDate = new Date();

      let getBooking = [];

      if (args.page) {
        if (args.active) {
          getBooking = await BookingModel.find({
            camp: args.id,
            endDate: { $gte: currentDate },
          })
            .populate('user tent')
            .limit(8)
            .skip((args.page - 1) * 8);
        } else {
          getBooking = await BookingModel.find({
            camp: args.id,
            endDate: { $lt: currentDate },
          })
            .populate('user tent')
            .limit(8)
            .skip((args.page - 1) * 8);
        }
      } else if (args.active) {
        getBooking = await BookingModel.find({
          camp: args.id,
          endDate: { $gte: currentDate },
        }).populate('user tent');
      } else {
        getBooking = await BookingModel.find({
          camp: args.id,
          endDate: { $lt: currentDate },
        }).populate('user tent');
      }

      const campBookings = [];

      getBooking.forEach((campBooking) => {
        let newCampBooking = {};

        newCampBooking = JSON.parse(JSON.stringify(campBooking));
        newCampBooking.startDate = new Date(campBooking.startDate);
        newCampBooking.endDate = new Date(campBooking.endDate);
        newCampBooking.amount = campBooking.amount.toString();
        campBookings.push(newCampBooking);
      });
      return campBookings;
    } catch (err) {
      return err;
    }
  },
};

const countCampActiveBookings = {
  type: BookingType,
  args: {
    id: { type: GraphQLString },
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

      const countActiveBooking = await BookingModel.count({ camp: args.id });
      return { countActiveBooking };
    } catch (err) {
      return err;
    }
  },
};

const allBookings = {
  type: new GraphQLList(BookingType),
  args: {
    active: { type: GraphQLBoolean },
    past: { type: GraphQLBoolean },
    page: { type: GraphQLInt },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserAdmin = await auth.isUserAdmin(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserAdmin) {
        throw new PrivilegeError();
      }
      const currentDate = new Date();
      let allBooking = [];
      if (args.page) {
        if (args.active) {
          allBooking = await BookingModel.find({
            endDate: { $gte: currentDate },
          })
            .populate('user', 'name')
            .populate('camp', 'name url code')
            .limit(8)
            .skip((args.page - 1) * 8);
        } else {
          allBooking = await BookingModel.find({
            endDate: { $lt: currentDate },
          })
            .populate('user', 'name')
            .populate('camp', 'name url code')
            .limit(8)
            .skip((args.page - 1) * 8);
        }
      } else if (args.active) {
        allBooking = await BookingModel.find({
          endDate: { $gte: currentDate },
        })
          .populate('user', 'name')
          .populate('camp', 'name url code');
      } else {
        allBooking = await BookingModel.find({
          endDate: { $lt: currentDate },
        })
          .populate('user', 'name')
          .populate('camp', 'name url code');
      }

      const adminBookings = [];

      allBooking.forEach((booking) => {
        let newCampBooking = {};

        newCampBooking = JSON.parse(JSON.stringify(booking));
        newCampBooking.startDate = new Date(booking.startDate);
        newCampBooking.endDate = new Date(booking.endDate);
        newCampBooking.amount = booking.amount.toString();
        adminBookings.push(newCampBooking);
      });
      return adminBookings;
    } catch (err) {
      return err;
    }
  },
};

const countAdminPastBookings = {
  type: BookingType,
  args: {},

  async resolve(args, parent, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserAdmin = await auth.isUserAdmin(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserAdmin) {
        throw new PrivilegeError();
      }
      const currentDate = new Date();
      const bookingCount = await BookingModel.estimatedDocumentCount({
        endDate: { $lt: currentDate },
      });
      console.log(bookingCount);
      return { bookingCount };
    } catch (err) {
      return err;
    }
  },
};

const countCampPastBookings = {
  type: BookingType,
  args: {
    id: { type: GraphQLString },
  },

  async resolve(args, parent, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserCampOwner = await auth.isUserAdmin(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserCampOwner) {
        throw new PrivilegeError();
      }
      const currentDate = new Date();
      const bookingCount = await BookingModel.estimatedDocumentCount({
        id: args.id,
        endDate: { $lt: currentDate },
      });
      console.log(bookingCount);
      return { bookingCount };
    } catch (err) {
      return err;
    }
  },
};

module.exports = {
  getUserBookings,
  getCampBookings,
  countCampActiveBookings,
  allBookings,
  countAdminPastBookings,
  countCampPastBookings,
};