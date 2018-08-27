const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

const TentType = new GraphQLObjectType({
  name: 'Tent',
  fields: () => ({
    id: { type: GraphQLID },
    capacity: { type: GraphQLString },
    type: { type: GraphQLString },
    isBooked: { type: GraphQLString },
    bookingPrice: { type: GraphQLString },
    surgePrice: { type: GraphQLString },
    preBookPeriod: { type: GraphQLString },
    bookedBy: { type: GraphQLID },
  }),
});

module.exports = TentType;
