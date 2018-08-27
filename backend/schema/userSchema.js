const graphql = require('graphql');
const { PrivilegeError, NotLoggedinError } = require('./graphqlErrors');
const UserModel = require('../models/user.js');
const auth = require('../config/auth');

const {
  GraphQLObjectType, GraphQLString, GraphQLID, GraphQLBoolean,
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    type: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    jwt: { type: GraphQLString },
    dateOfBirth: { type: GraphQLString },
    isEmailVerified: { type: GraphQLBoolean },
  }),
});

const getUser = {
  // Returns a specific user by id
  type: UserType,
  args: { id: { type: GraphQLString } },
  async resolve(parent, args, context) {
    try {
      const userAuth = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(userAuth.id);
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

module.exports = { getUser };
