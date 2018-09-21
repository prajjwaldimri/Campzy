const graphql = require('graphql');
const UserType = require('./UserType');

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
    bookedBy: { type: UserType },
    isAvailable: { type: GraphQLBoolean },
    count: { type: GraphQLInt },
    bookedTentCount: { type: GraphQLInt },
  }),
});

module.exports = TentType;
