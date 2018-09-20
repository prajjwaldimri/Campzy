const graphql = require('graphql');
const ReviewModel = require('../../models/review');

const ReviewType = require('../types/ReviewType');

const { GraphQLString, GraphQLFloat } = graphql;

const { NotLoggedinError } = require('../graphqlErrors');
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

    const review = await ReviewModel.create({
      stars: args.stars,
      comment: args.comment,
      camp: args.campId,
      user: user.id,
    });

    return review;
  },
};

module.exports = { addReview };
