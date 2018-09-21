const graphql = require('graphql');
const BookingType = require('../types/BookingType');
const UserModel = require('../../models/user');
const BookingModel = require('../../models/booking');
const auth = require('../../config/auth');

const { NotLoggedinError } = require('../graphqlErrors');

const { GraphQLList, GraphQLString } = graphql;
const { PrivilegeError } = require('../graphqlErrors');

const getUserActiveBookings = {
  type: new GraphQLList(BookingType),
  args: {},
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id).select('id');

      if (!userData) {
        throw new NotLoggedinError();
      }

      const bookings = await BookingModel.find({
        // eslint-disable-next-line
        user: userData._id,
      }).populate('user camp tent');

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

      const getBooking = await BookingModel.find({ camp: args.id }).populate(
        'user tent',
      );
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

const getUserPastBookings = {};

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

module.exports = {
  getUserActiveBookings,
  getUserPastBookings,
  getCampBookings,
  countCampActiveBookings,
};
