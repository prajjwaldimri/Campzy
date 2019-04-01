const graphql = require('graphql');
const RequestsModel = require('../../models/requests.js');
const UserModel = require('../../models/user.js');
const RequestsType = require('../types/RequestsType');
const { NotLoggedinError, PrivilegeError } = require('../graphqlErrors');
const auth = require('../../config/auth');

const { GraphQLString, GraphQLNonNull } = graphql;

const addRequests = {
  type: RequestsType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      const requests = new RequestsModel({
        name: args.name,
        phoneNumber: args.phoneNumber,
      });
      const createRequests = await requests.save();
      return createRequests;
    } catch (err) {
      return err;
    }
  },
};

const deleteRequests = {
  type: RequestsType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserAdmin = auth.isUserAdmin(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserAdmin) {
        throw new PrivilegeError();
      }
      return await RequestsModel.findByIdAndRemove(args.id);
    } catch (err) {
      return err;
    }
  },
};
module.exports = {
  addRequests,
  deleteRequests,
};
