/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_userId"] }] */
const graphql = require('graphql');
const UserModel = require('../../models/user.js');
const TokenType = require('../types/TokenType');
const auth = require('../../config/auth');

const { GraphQLString } = graphql;

const sendResetPasswordToken = {
  type: TokenType,
  args: {
    email: { type: GraphQLString },
  },
  async resolve(parent, args) {
    try {
      const user = await UserModel.findOne({ email: args.email });
      return await auth.sendResetPasswordToken(user._id, args.email);
    } catch (err) {
      return err;
    }
  },
};

module.exports = { sendResetPasswordToken };
