/* eslint no-underscore-dangle: ["error", {"allow" : ["_id"]}] */
const graphql = require('graphql');
const moment = require('moment');
const ReviewModel = require('../../models/review');
const CampModel = require('../../models/camp');
const BookingModel = require('../../models/booking');

const ReviewType = require('../types/ReviewType');
const CampType = require('../types/CampType');

const { GraphQLString, GraphQLList } = graphql;

const { NotLoggedinError, CampNotAvailableError } = require('../graphqlErrors');
const auth = require('../../config/auth');

const getLatestCampForReview = {
  type: CampType,
  args: {},
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      if (user === null) {
        throw new NotLoggedinError();
      }
      const latestBooking = await BookingModel.findOne({ user: user.id })
        .sort('createdAt')
        .limit(1)
        .select('id camp endDate')
        .populate('camp');
      if (!latestBooking) {
        return null;
      }
      const dateDifference = moment(Date.now()).diff(
        latestBooking.endDate,
        'days',
      );
      if (dateDifference < 0) {
        return null;
      }
      const isRatingPresent = await ReviewModel.findOne({
        booking: latestBooking._id, // eslint-disable-line
      });
      if (isRatingPresent) {
        return null;
      }
      return latestBooking.camp;
    } catch (err) {
      return err;
    }
  },
};

const getReviewsForCamp = {
  type: new GraphQLList(ReviewType),
  args: {
    campId: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const camp = await CampModel.findById(args.campId).select('id');
    if (camp === null) {
      throw new CampNotAvailableError();
    }
    return ReviewModel.find({ camp: camp._id }).populate({
      path: 'user',
      select: 'name',
    });
  },
};

module.exports = { getLatestCampForReview, getReviewsForCamp };
