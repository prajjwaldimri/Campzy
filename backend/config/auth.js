const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailjet = require('node-mailjet').connect(
  process.env.MAILJET_PUBLIC,
  process.env.MAILJET_PRIVATE,
);

const client = require('twilio')('ACabc517de4bcf13d79c5c4268f6aa90f5', process.env.TWILIO_API_KEY);

const { EmailSendError, WrongEmailTokenError, OTPSendError } = require('../schema/graphqlErrors');

const TokenModel = require('../models/token');
const OTPModel = require('../models/otp');
const UserModel = require('../models/user');

/**
 * Gets the authentication JWT token from the HTTP header
 * @param  {Object} req Express's request object
 */
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

const isUserBlogger = (user) => {
  if (!user) {
    return false;
  }
  if (user.type === 'Blogger') {
    return true;
  }
  return false;
};

const sendUserToken = async (userId, email) => {
  try {
    let token = await TokenModel.findOne({ _userId: userId });
    if (!token) {
      token = new TokenModel({
        _userId: userId,
        tokenValue: crypto.randomBytes(16).toString('hex'),
      });
      await token.save();
    }
    return await mailjet.post('send').request({
      FromEmail: 'support@campzy.in',
      From: 'Campzy',
      Subject: 'Campzy Verification Email',
      'Html-part': `<html><body>Hi, Please enter this verification code into the prompt at Campzy. \n ${
        token.tokenValue
      }</body></html>`,
      Recipients: [{ Email: email }],
    });
  } catch (err) {
    throw new EmailSendError();
  }
};

const sendResetPasswordToken = async (userId, email) => {
  try {
    let token = await TokenModel.findOne({ _userId: userId });
    if (!token) {
      token = new TokenModel({
        _userId: userId,
        tokenValue: crypto.randomBytes(16).toString('hex'),
      });
      await token.save();
    }
    // TODO: Switch to main domain
    return await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'support@campzy.in',
            Name: 'Campzy',
          },
          To: [
            {
              Email: email,
            },
          ],
          TemplateID: 514379,
          TemplateLanguage: true,
          Subject: 'Password Reset Request at Campzy',
          Variables: {
            resetToken: token.tokenValue,
          },
        },
      ],
    });
  } catch (err) {
    throw new EmailSendError();
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
    throw new WrongEmailTokenError();
  }
};

function generateRandomNumbers(n) {
  const add = 1;
  let max = 12 - add;
  // 12 is the min safe number Math.random() can generate without it starting to
  // pad the end with zeros.

  if (n > max) {
    return generateRandomNumbers(max) + generateRandomNumbers(n - max);
  }

  max = 10 ** (n + add);
  const min = max / 10; // Math.pow(10, n) basically
  const number = Math.floor(Math.random() * (max - min + 1)) + min;

  return `${number}`.substring(add);
}

const sendUserOTP = async (phoneNumber) => {
  try {
    let otp = await OTPModel.findOne({ phoneNumber });
    if (!otp) {
      otp = new OTPModel({
        phoneNumber: `+91${phoneNumber}`,
        otpValue: `${generateRandomNumbers(6)}`,
      });
      await otp.save();
    }
    return await client.messages.create({
      from: '+15172251199',
      body: `Your Campzy OTP is ${otp.otpValue}`,
      to: `+91${phoneNumber}`,
    });
  } catch (err) {
    throw new OTPSendError();
  }
};

const verifyUserOTP = async (otpValue, phoneNumber) => {
  try {
    const otp = await OTPModel.findOne({ otpValue });
    if (!otp) {
      return false;
    }
    if (`+91${phoneNumber}` === otp.phoneNumber) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

module.exports = {
  getAuthenticatedUser,
  isUserCampOwner,
  isUserAdmin,
  isUserBlogger,
  sendUserToken,
  verifyUserToken,
  sendUserOTP,
  verifyUserOTP,
  sendResetPasswordToken,
};
