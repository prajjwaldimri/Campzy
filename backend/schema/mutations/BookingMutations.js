const graphql = require('graphql');
const BookingType = require('../types/BookingType');

const { GraphQLString, GraphQLInt } = graphql;

const book = {
  type: BookingType,
  args: {
    campId: { type: GraphQLString },
    adultCount: { type: GraphQLInt },
    childrenCount: { type: GraphQLInt },
  },
};

module.exports = { book };
