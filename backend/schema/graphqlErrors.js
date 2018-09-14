const ApolloError = require('apollo-errors');

const UsernamePasswordError = ApolloError.createError('UsernamePasswordError', {
  message: 'Invalid Username or Password',
});

// Only used when user is logged in
const WrongPasswordError = ApolloError.createError('WrongPasswordError', {
  message: 'Wrong Password',
});

const BlackListedError = ApolloError.createError('BlacklistedError', {
  message: 'Your Account is blacklisted. Please contact Campzy Support',
});

const PrivilegeError = ApolloError.createError('PrivilegeError', {
  message: 'Your account does not have the capability to perform this action.',
});

const NotLoggedinError = ApolloError.createError('NotLoggedinError', {
  message: 'Your session has expired. Please login again.',
});

const EmailSendError = ApolloError.createError('EmailSendError', {
  message: 'Unable to send email to your address.',
});

const WrongEmailTokenError = ApolloError.createError('WrongEmailTokenError', {
  message: 'Wrong email verification code.',
});

const OTPSendError = ApolloError.createError('OTPSendError', {
  message: 'Unable to send OTP to that number. Please try again!',
});

const WrongOTPTokenError = ApolloError.createError('WrongOTPTokenError', {
  message: 'Provided OTP is wrong.',
});

const EmailAlreadyInUseError = ApolloError.createError(
  'EmailAlreadyInUseError',
  {
    message: 'Email already in use',
  },
);

const PhoneNumberAlreadyInUseError = ApolloError.createError(
  'PhoneNumberAlreadyInUseError',
  {
    message: 'Phone Number already in use',
  },
);

const UserNotFoundError = ApolloError.createError('UserNotFoundError', {
  message: 'No user exists with those details',
});

const TentNotAvailableError = ApolloError.createError('TentNotAvailableError', {
  message: 'No tents can be booked with the provided criteria',
});

const CampNotAvailableError = ApolloError.createError('CampNotAvailableError', {
  message: 'Camp is not available to take bookings at this moment',
});

const UnknownError = ApolloError.createError('UnknownError', {
  message:
    'An unknown error has occurred. We have logged the error and are working on it.',
});

module.exports = {
  UsernamePasswordError,
  WrongPasswordError,
  BlackListedError,
  UnknownError,
  PrivilegeError,
  NotLoggedinError,
  EmailSendError,
  WrongEmailTokenError,
  OTPSendError,
  WrongOTPTokenError,
  EmailAlreadyInUseError,
  PhoneNumberAlreadyInUseError,
  UserNotFoundError,
  TentNotAvailableError,
  CampNotAvailableError,
};
