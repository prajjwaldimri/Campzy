/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_userId"] }] */
const graphql = require('graphql');
const bcrypt = require('bcrypt');
const UserType = require('../types/UserType');
const auth = require('../../config/auth');
const {
  WrongOTPTokenError,
  WrongEmailTokenError,
  WrongPasswordError,
} = require('../graphqlErrors');
const UserModel = require('../../models/user.js');
const TokenModel = require('../../models/token');

const { GraphQLString } = graphql;

const registerUser = {
  type: UserType,
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    otp: { type: GraphQLString },
  },
  async resolve(parent, args) {
    try {
      const otpVerified = await auth.verifyUserOTP(args.otp, args.phoneNumber);
      if (!otpVerified) {
        throw new WrongOTPTokenError();
      }
      const passwordHash = await bcrypt.hash(args.password, 10);
      const userDocument = new UserModel({
        email: args.email,
        password: passwordHash,
        phoneNumber: args.phoneNumber,
      });
      const createdUser = await userDocument.save();
      await auth.sendUserToken(createdUser._id, args.email);
      return { jwt: JSON.stringify(createdUser.generateJWT()) };
    } catch (err) {
      return err;
    }
  },
};

const resetPassword = {
  type: UserType,
  args: {
    newPassword: { type: GraphQLString },
    confirmNewPassword: { type: GraphQLString },
    resetToken: { type: GraphQLString },
  },
  async resolve(parent, args) {
    try {
      const token = await TokenModel.findOne({ tokenValue: args.resetToken });
      if (!token) {
        throw new WrongEmailTokenError();
      }
      const user = await UserModel.findById(token._userId);
      if (!user) {
        throw new WrongEmailTokenError();
      }
      const passwordHash = await bcrypt.hash(args.newPassword, 10);
      user.password = passwordHash;
      await token.remove();
      return await user.save();
    } catch (err) {
      return err;
    }
  },
};

const updateUser = {
  type: UserType,
  args: {
    name: { type: GraphQLString },
    currentPassword: { type: GraphQLString },
    newPassword: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      let userData = await UserModel.findById(user.id, 'password');
      const isPasswordCorrect = await bcrypt.compare(args.currentPassword, userData.password);
      console.log(isPasswordCorrect);

      if (isPasswordCorrect) {
        if (args.newPassword) {
          const password = await bcrypt.hash(args.newPassword, 10);
          userData = await UserModel.findByIdAndUpdate(
            user.id,
            { name: args.name, password },
            { select: 'email name' },
          );
        } else {
          userData = await UserModel.findByIdAndUpdate(
            user.id,
            { name: args.name },
            { select: 'email name' },
          );
        }
        return userData;
      }
      throw WrongPasswordError();
    } catch (err) {
      return err;
    }
  },
};

module.exports = { registerUser, resetPassword, updateUser };
