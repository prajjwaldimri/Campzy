import jwt from "jsonwebtoken";
import crypto from "crypto";
import mailjet from "node-mailjet";

import { ApolloError, AuthenticationError } from "apollo-server-express";

import { sms } from "../communication/sms";
import { emailer } from "../communication/email";

import { TokenModel } from "../models/token";
import { OTPModel } from "../models/otp";
import { UserModel, User } from "../models/user";
import { Twilio } from "twilio";

const EmailSendError = (): ApolloError =>
  new ApolloError("Error sending email!");

/**
 * Gets the authentication JWT token from the HTTP header
 * @param  {Object} req Express's request object
 */
const getTokenFromHeaders = (req: any): string => {
  const {
    headers: { authorization }
  } = req;

  // Remove the word 'Bearer' from the header value.
  if (authorization && authorization.split(" ")[0] === "Bearer") {
    return authorization.split(" ")[1];
  }
  return "";
};

interface DecryptedUser {
  email: string;
  id: string;
  exp: number;
  iat: number;
}

// Retrieves the authenticated user details from JWT
const getAuthenticatedUser = (req: Express.Request): Promise<DecryptedUser> =>
  new Promise(
    (resolve, reject): void => {
      const token = getTokenFromHeaders(req);
      jwt.verify(
        token,
        process.env.JWT_SECRET || "",
        (err, payload): void => {
          if (err) {
            reject(new Error("NotLoggedInError"));
          }
          resolve(payload as DecryptedUser);
        }
      );
    }
  );

// Checks if a user owns any camps
const isUserCampOwner = (user: User): boolean => {
  if (!user) {
    return false;
  }
  if (user.type === "CampOwner") {
    return true;
  }
  return false;
};

const isUserAdmin = (user: User): boolean => {
  if (!user) {
    return false;
  }
  if (user.type === "Admin") {
    return true;
  }
  return false;
};

const isUserBlogger = (user: User): boolean => {
  if (!user) {
    return false;
  }
  if (user.type === "Blogger") {
    return true;
  }
  return false;
};

const sendResetPasswordToken = async (
  userId: string,
  email: string
): Promise<mailjet.Email.Response> => {
  try {
    let token = await TokenModel.findOne({ _userId: userId });
    if (!token) {
      token = new TokenModel({
        _userId: userId,
        tokenValue: crypto.randomBytes(16).toString("hex")
      });
      await token.save();
    }
    return await emailer.sendResetPasswordToken(email, token);
  } catch (err) {
    throw EmailSendError();
  }
};

const sendEmailVerificationToken = async (
  userId: string,
  email: string
): Promise<mailjet.Email.Response> => {
  try {
    let token = await TokenModel.findOne({ userId: userId });
    const user: User | null = await UserModel.findById(userId).select("name");
    if (!token) {
      token = new TokenModel({
        userId: userId,
        tokenValue: crypto.randomBytes(16).toString("hex")
      });
      await token.save();
    }
    if (!user) {
      throw EmailSendError();
    }
    return await emailer.sendEmailVerificationToken(
      email,
      token.tokenValue,
      user.name || "Campzy User"
    );
  } catch (err) {
    throw EmailSendError();
  }
};

const verifyUserToken = async (tokenValue: string): Promise<boolean> => {
  try {
    const token = await TokenModel.findOne({ tokenValue });
    if (!token) {
      throw new AuthenticationError("Wrong/Expired Email token!");
    }
    const matchingUser = await UserModel.findById(token.userId);
    if (!matchingUser) {
      throw new AuthenticationError("Wrong/Expired Email token!");
    }
    if (!matchingUser.isEmailVerified) {
      matchingUser.isEmailVerified = true;
      await matchingUser.save();
    }
    return true;
  } catch (err) {
    throw err;
  }
};

function generateRandomNumbers(n: number): string {
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

const sendUserOTP = async (
  phoneNumber: string,
  userId: string
): Promise<Twilio.TwilioClientOptions> => {
  try {
    let otp = await OTPModel.findOne({ phoneNumber });
    if (!otp) {
      otp = new OTPModel({
        user: userId,
        phoneNumber,
        otpValue: `${generateRandomNumbers(6)}`
      });
      await otp.save();
    }
    return await sms.sendSMS(phoneNumber, `${otp.otpValue} is your Campzy OTP`);
  } catch (err) {
    throw new ApolloError("Cannot send OTP at this time!");
  }
};

export {
  getAuthenticatedUser,
  isUserCampOwner,
  isUserAdmin,
  isUserBlogger,
  verifyUserToken,
  sendUserOTP,
  sendResetPasswordToken,
  sendEmailVerificationToken
};
