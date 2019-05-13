const graphql = require('graphql');
const UserModel = require('../../models/user');
const RequestsModel = require('../../models/requests');
const RequestsType = require('../types/RequestsType');
const auth = require('../../config/auth');

const { NotLoggedinError } = require('../graphqlErrors');

const { GraphQLList } = graphql;
const { PrivilegeError } = require('../graphqlErrors');

const allRequests = {
  type: new GraphQLList(RequestsType),
  args: {},
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
      const contactRequests = await RequestsModel.find({});
      return contactRequests;
    } catch (err) {
      return err;
    }
  },
};

module.exports = { allRequests };
