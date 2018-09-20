const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
} = graphql;

const TentType = new GraphQLObjectType({
  name: 'Tent',
  fields: () => ({
    id: { type: GraphQLID },
    capacity: { type: GraphQLString },
    type: { type: GraphQLString },
    isBooked: { type: GraphQLBoolean },
    bookingPrice: { type: GraphQLInt },
    surgePrice: { type: GraphQLInt },
    preBookPeriod: { type: GraphQLString },
    bookedBy: { type: GraphQLID },
    isAvailable: { type: GraphQLBoolean },
  }),
});

module.exports = TentType;
