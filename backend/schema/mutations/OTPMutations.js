const graphql = require('graphql');
const OTPType = require('../types/OTPType');
const auth = require('../../config/auth');

const { GraphQLString } = graphql;

const sendOTP = {
  type: OTPType,
  args: {
    phoneNumber: { type: GraphQLString },
  },
  async resolve(parent, args) {
    try {
      await auth.sendUserOTP(args.phoneNumber);
      return 'Sent OTP';
    } catch (err) {
      return err;
    }
  },
};

module.exports = { sendOTP };
