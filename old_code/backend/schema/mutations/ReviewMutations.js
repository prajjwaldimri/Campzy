const graphql = require('graphql');
const ReviewModel = require('../../models/review');
const CampModel = require('../../models/camp');
const BookingModel = require('../../models/booking');
const ReviewType = require('../types/ReviewType');

const { GraphQLString, GraphQLFloat } = graphql;

const { NotLoggedinError, CampNotAvailableError } = require('../graphqlErrors');
const auth = require('../../config/auth');

const addReview = {
  type: ReviewType,
  args: {
    stars: { type: GraphQLFloat },
    comment: { type: GraphQLString },
    campId: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    const user = await auth.getAuthenticatedUser(context.req);
    if (user === null) {
      throw new NotLoggedinError();
    }

    const camp = await CampModel.findById(args.campId);

    if (camp === null) {
      throw new CampNotAvailableError();
    }

    const latestBooking = await BookingModel.findOne({ user: user.id })
      .sort('createdAt')
      .limit(1)
      .select('id camp endDate');

    const review = await ReviewModel.create({
      stars: args.stars,
      comment: args.comment,
      camp: args.campId,
      user: user.id,
      booking: latestBooking._id, // eslint-disable-line
    });

    // Calculate the average review
    const allCampReviews = await ReviewModel.find({ camp: args.campId });
    let averageRating = 0;

    for (let i = 0; i < allCampReviews.length; i += 1) {
      averageRating += allCampReviews[i].stars;
    }

    camp.averageRating = averageRating / allCampReviews.length;
    camp.ratingsCount = allCampReviews.length;
    await camp.save();

    return review;
  },
};

module.exports = { addReview };
