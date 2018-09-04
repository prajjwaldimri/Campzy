const graphql = require('graphql');

const {
  GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLBoolean,
} = graphql;

const TentType = new GraphQLObjectType({
  name: 'Tent',
  fields: () => ({
    id: { type: GraphQLID },
    capacity: { type: GraphQLString },
    type: { type: GraphQLString },
    isBooked: { type: GraphQLBoolean },
    bookingPriceAdult: { type: GraphQLInt },
    bookingPriceChildren: { type: GraphQLInt },
    surgePriceAdult: { type: GraphQLInt },
    surgePriceChildren: { type: GraphQLInt },
    preBookPeriod: { type: GraphQLString },
    bookedBy: { type: GraphQLID },
  }),
});

module.exports = TentType;
