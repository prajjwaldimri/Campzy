const graphql = require('graphql');
const OTPType = require('../types/OTPType');
const UserModel = require('../../models/user.js');
const auth = require('../../config/auth');
const { PhoneNumberAlreadyInUseError } = require('../graphqlErrors');

const { GraphQLString } = graphql;

const sendOTP = {
  type: OTPType,
  args: {
    phoneNumber: { type: GraphQLString },
  },
  async resolve(parent, args) {
    try {
      const user = await UserModel.findOne({ phoneNumber: args.phoneNumber });
      if (user) {
        throw new PhoneNumberAlreadyInUseError();
      }
      await auth.sendUserOTP(args.phoneNumber);
      return 'OTP sent!';
    } catch (err) {
      return err;
    }
  },
};

module.exports = { sendOTP };
