const graphql = require('graphql');
const TokenType = require('../types/TokenType');
const auth = require('../../config/auth');

const { GraphQLString } = graphql;

const confirmEmailToken = {
  type: TokenType,
  args: {
    tokenValue: { type: GraphQLString },
  },
  async resolve(parent, args) {
    try {
      await auth.verifyUserToken(args.tokenValue);
      return 'Successfully Verified';
    } catch (err) {
      return err;
    }
  },
};

const resendEmailToken = {
  type: TokenType,
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      await auth.sendUserToken(user.id, user.email);
      return 'Sent Verification Email';
    } catch (err) {
      return err;
    }
  },
};

module.exports = { confirmEmailToken, resendEmailToken };
