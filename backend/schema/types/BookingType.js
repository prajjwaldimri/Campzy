const { GraphQLDate } = require('graphql-iso-date');

const graphql = require('graphql');
const UserType = require('./UserType');
const TentType = require('./TentType');

const {
  GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat,
} = graphql;

const BookingType = new GraphQLObjectType({
  name: 'Booking',
  fields: () => ({
    code: { type: GraphQLString },
    user: { type: UserType },
    tent: { type: TentType },
    adultCount: { type: GraphQLInt },
    childrenCount: { type: GraphQLInt },
    amount: { type: GraphQLFloat },
    startDate: { type: GraphQLDate },
    endDate: { type: GraphQLDate },
  }),
});

module.exports = BookingType;
