const { GraphQLDate } = require('graphql-iso-date');

const graphql = require('graphql');

const UserType = require('./UserType');
const TentType = require('./TentType');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
} = graphql;

const BookingType = new GraphQLObjectType({
  name: 'Booking',
  fields: () => ({
    code: { type: GraphQLString },
    razorpayPaymentId: { type: GraphQLString },
    user: { type: UserType },
    tent: { type: new GraphQLList(TentType) },
    tentCount: { type: GraphQLInt },
    personCount: { type: GraphQLInt },
    amount: { type: GraphQLFloat },
    startDate: { type: GraphQLDate },
    endDate: { type: GraphQLDate },
  }),
});

module.exports = BookingType;
