/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_userId"] }] */
const graphql = require('graphql');
const bcrypt = require('bcrypt');
const {
  OAuth2Client
} = require('google-auth-library');
const {
  FB
} = require('fb');
const UserType = require('../types/UserType');
const auth = require('../../config/auth');
const {
  WrongOTPTokenError,
  WrongEmailTokenError,
  WrongPasswordError,
  UserNotFoundError,
  NotLoggedinError,
} = require('../graphqlErrors');
const UserModel = require('../../models/user.js');
const TokenModel = require('../../models/token');
const sms = require('../../communication/sms');

const {
  GraphQLString
} = graphql;

const registerUser = {
  type: UserType,
  args: {
    email: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
    phoneNumber: {
      type: GraphQLString
    },
    otp: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    googleToken: {
      type: GraphQLString
    },
    facebookToken: {
      type: GraphQLString
    },
  },
  async resolve(parent, args) {
    try {
      const otpVerified = await auth.verifyUserOTP(args.otp, args.phoneNumber);
      if (!otpVerified) {
        throw new WrongOTPTokenError();
      }
      const passwordHash = await bcrypt.hash(args.password, 10);
      const userDocument = new UserModel({
        name: args.name,
        email: args.email,
        password: passwordHash,
        phoneNumber: args.phoneNumber,
        googleToken: args.googleToken,
        facebookToken: args.facebookToken,
      });
      const createdUser = await userDocument.save();
      await auth.sendEmailVerificationToken(createdUser._id, args.email);
      return {
        jwt: JSON.stringify(createdUser.generateJWT())
      };
    } catch (err) {
      return err;
    }
  },
};

// Google Auth
const clientID = '566978873203-tp4eadl6alv9s6pkk8nrvhg3n1grqlsc.apps.googleusercontent.com';
const client = new OAuth2Client(clientID);
const googleAuth = {
  type: UserType,
  args: {
    token: {
      type: GraphQLString
    },
  },
  async resolve(parent, args) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: args.token,
        audience: clientID,
      });

      const user = await UserModel.findOne({
        email: ticket.payload.email
      });
      if (user) {
        // User already exists in database. Link user's account to google OAuth Token
        user.googleToken = args.token;
        await user.save();
        return {
          jwt: JSON.stringify(user.generateJWT())
        };
      }
      throw new UserNotFoundError();
    } catch (err) {
      return err;
    }
  },
};

// Facebook Auth
const facebookAuth = {
  type: UserType,
  args: {
    token: {
      type: GraphQLString
    },
  },
  async resolve(parent, args) {
    try {
      FB.setAccessToken(args.token);
      const res = await FB.api('/me?fields=id,name,email');
      if (!res || res.error) {
        throw new Error('Wrong Access Token');
      }
      const user = await UserModel.findOne({
        email: res.email
      });
      if (user) {
        // User already exists in system
        user.facebookToken = args.token;
        await user.save();
        return {
          jwt: JSON.stringify(user.generateJWT())
        };
      }
      throw new UserNotFoundError();
    } catch (err) {
      return err;
    }
  },
};

const resetPassword = {
  type: UserType,
  args: {
    newPassword: {
      type: GraphQLString
    },
    confirmNewPassword: {
      type: GraphQLString
    },
    resetToken: {
      type: GraphQLString
    },
  },
  async resolve(parent, args) {
    try {
      const token = await TokenModel.findOne({
        tokenValue: args.resetToken
      });
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
    name: {
      type: GraphQLString
    },
    currentPassword: {
      type: GraphQLString
    },
    newPassword: {
      type: GraphQLString
    },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      let userData = await UserModel.findById(user.id, 'password');
      const isPasswordCorrect = await bcrypt.compare(
        args.currentPassword,
        userData.password,
      );

      if (isPasswordCorrect) {
        if (args.newPassword) {
          const password = await bcrypt.hash(args.newPassword, 10);
          userData = await UserModel.findByIdAndUpdate(
            user.id, {
              name: args.name,
              password
            }, {
              select: 'email name'
            },
          );
        } else {
          userData = await UserModel.findByIdAndUpdate(
            user.id, {
              name: args.name
            }, {
              select: 'email name'
            },
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

const addCampToWishlist = {
  type: UserType,
  args: {
    campId: {
      type: GraphQLString
    },
  },
  async resolve(parent, args, context) {
    const user = await auth.getAuthenticatedUser(context.req);
    const userData = await UserModel.findById(user.id).select('wishlist');
    if (userData === null) {
      throw new NotLoggedinError();
    }

    userData.wishlist.push(args.campId);
    await userData.save();
  },
};

const removeFromWishlist = {
  type: UserType,
  args: {
    campId: {
      type: GraphQLString
    },
  },
  async resolve(parent, args, context) {
    const user = await auth.getAuthenticatedUser(context.req);
    const userData = await UserModel.findById(user.id).select('wishlist');
    if (userData === null) {
      throw new NotLoggedinError();
    }
    if (userData.wishlist.indexOf(args.campId) > -1) {
      userData.wishlist.splice(userData.wishlist.indexOf(args.campId), 1);
    }
    await userData.save();
  },
};

const bookTrip = {
  type: UserType,
  args: {
    name: GraphQLString,
    phoneNumber: GraphQLString,
    tripDate: GraphQLString,
    packageType: GraphQLString,
    totalPerson: GraphQLString,
    payableAmount: GraphQLString
  },
  async resolve(parent, args, context) {
    await sms.sendSMS(
      args.phoneNumber,
      `Hey! ${
        args.name
      }, your trip is successfully booked with Campzy. Your trip will starts from ${args.tripDate}. For further assistance contact details are given below.
      Priyanshu Agarwal
      Trip Manager
      Mob: +919810325245. 
      Enjoy!`,
    )

  }
  return
}

module.exports = {
  registerUser,
  resetPassword,
  updateUser,
  googleAuth,
  facebookAuth,
  addCampToWishlist,
  removeFromWishlist,
  bookTrip
};