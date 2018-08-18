const getTokenFromHeaders = (req) => {
  // Get JWT from header
  const {
    headers: { authorization },
  } = req;

  // Remove the word 'Token' from the header value.
  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
};

module.exports = getTokenFromHeaders;
