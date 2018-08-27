const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString } = graphql;

const OTPType = new GraphQLObjectType({
  name: 'OTP',
  fields: () => ({
    otpValue: { type: GraphQLString },
  }),
});

module.exports = OTPType;
