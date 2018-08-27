const graphql = require('graphql');
const UserType = require('../types/UserType');
const auth = require('../../config/auth');
const { NotLoggedinError, PrivilegeError } = require('../graphqlErrors');
const UserModel = require('../../models/user.js');

const { GraphQLString } = graphql;

const currentUser = {
  type: UserType,
  args: {},
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      return userData;
    } catch (err) {
      return err;
    }
  },
};

const getUser = {
  // Returns a specific user by id
  type: UserType,
  args: { id: { type: GraphQLString } },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserAdmin = await auth.isUserAdmin(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserAdmin) {
        throw new PrivilegeError();
      }
      return await UserModel.findById(args.id);
    } catch (err) {
      return err;
    }
  },
};

module.exports = { currentUser, getUser };
