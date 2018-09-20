const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLFloat } = graphql;

const UserType = require('./UserType');
const CampType = require('./CampType');

const ReviewType = new GraphQLObjectType({
  name: 'Review',
  fields: () => ({
    stars: { type: GraphQLFloat },
    comment: { type: GraphQLString },
    user: { type: UserType },
    camp: { type: CampType },
  }),
});

module.exports = ReviewType;
