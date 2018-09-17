const graphql = require('graphql');
const BookingType = require('../types/BookingType');
const UserModel = require('../../models/user');
const BookingModel = require('../../models/booking');
const auth = require('../../config/auth');

const { NotLoggedinError } = require('../graphqlErrors');

const { GraphQLList } = graphql;

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

const getUserPastBookings = {};

module.exports = { getUserActiveBookings, getUserPastBookings };
