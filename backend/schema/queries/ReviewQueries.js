const graphql = require('graphql');
// const ReviewModel = require('../../models/review');
const CampModel = require('../../models/camp');

const ReviewType = require('../types/ReviewType');
const CampType = require('../types/CampType');

const { GraphQLString, GraphQLList } = graphql;

const { NotLoggedinError, CampNotAvailableError } = require('../graphqlErrors');
const auth = require('../../config/auth');

const getLatestCampForReview = {
  type: CampType,
  args: {},
  async resolve(parent, args, context) {
    const user = await auth.getAuthenticatedUser(context.req);
    if (user === null) {
      throw new NotLoggedinError();
    }
  },
};

const getReviewsForCamp = {
  type: new GraphQLList(ReviewType),
  args: {
    campId: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const camp = await CampModel.findById(args.campId);
    if (camp === null) {
      throw new CampNotAvailableError();
    }
  },
};

module.exports = { getLatestCampForReview, getReviewsForCamp };
