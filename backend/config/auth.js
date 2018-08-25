const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailjet = require('node-mailjet').connect(
  process.env.MAILJET_PUBLIC,
  process.env.MAILJET_PRIVATE,
);

const TokenModel = require('../models/token');
const UserModel = require('../models/user');

// Gets the JWT from HTTP Header
const getTokenFromHeaders = (req) => {
  const {
    headers: { authorization },
  } = req;

  // Remove the word 'Bearer' from the header value.
  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
};

// Retrieves the authenticated user details from JWT
const getAuthenticatedUser = request => new Promise((resolve, reject) => {
  const token = getTokenFromHeaders(request);
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      reject(new Error('Incorrect or Expired JWT'));
    }
    resolve(payload);
  });
});

// Checks if a user owns any camps
const isUserCampOwner = (user) => {
  if (!user) {
    return false;
  }
  if (user.type === 'CampOwner') {
    return true;
  }
  return false;
};

const isUserAdmin = (user) => {
  if (!user) {
    return false;
  }
  if (user.type === 'Admin') {
    return true;
  }
  return false;
};

const sendUserToken = async (userId, email) => {
  try {
    const token = new TokenModel({
      _userId: userId,
      tokenValue: crypto.randomBytes(16).toString('hex'),
    });
    await token.save();
    // TODO: Switch to main domain
    return await mailjet.post('send').request({
      FromEmail: 'support@campzy.in',
      From: 'Mailjet Pilot',
      Subject: 'Campzy Verification Email',
      'Html-part': `<html><body>Hi, Please enter this verification code into the prompt at Campzy. \n ${
        token.tokenValue
      }</body></html>`,
      Recipients: [{ Email: email }],
    });
  } catch (err) {
    return err;
  }
};

const verifyUserToken = async (tokenValue) => {
  try {
    const token = await TokenModel.findOne({ tokenValue });
    // eslint-disable-next-line
    const matchingUser = await UserModel.findById(token._userId);
    if (!matchingUser.isEmailVerified) {
      matchingUser.isEmailVerified = true;
      await matchingUser.save();
    }
    return true;
  } catch (err) {
    return err;
  }
};

module.exports = {
  getAuthenticatedUser,
  isUserCampOwner,
  isUserAdmin,
  sendUserToken,
  verifyUserToken,
};
