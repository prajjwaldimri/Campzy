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

const UnknownError = ApolloError.createError('UnknownError', {
  message: 'An unknown error has occurred. We have logged the error and are working on it.',
});

module.exports = {
  UsernamePasswordError,
  WrongPasswordError,
  BlackListedError,
  UnknownError,
  PrivilegeError,
  NotLoggedinError,
};
