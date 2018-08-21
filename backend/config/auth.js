const jwt = require('jsonwebtoken');

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

module.exports = { getAuthenticatedUser, isUserCampOwner, isUserAdmin };
