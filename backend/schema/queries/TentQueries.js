const graphql = require('graphql');
const TentModel = require('../../models/tent.js');
const UserModel = require('../../models/user.js');
const TentType = require('../types/TentType');
const auth = require('../../config/auth');

const { GraphQLList, GraphQLString } = graphql;

const getTent = {
  type: new GraphQLList(TentType),
  args: {
    id: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserCampOwner = await auth.isUserCampOwner(userData);
      if (userData === null) {
        return new Error('Not Logged In');
      }
      if (!isUserCampOwner) {
        return new Error('Not Privileged Enough');
      }
      return await TentModel.findById(args.id);
    } catch (err) {
      return err;
    }
  },
};

const getAllTents = {
  type: new GraphQLList(TentType),
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserCampOwner = await auth.isUserCampOwner(userData);
      if (userData === null) {
        return new Error('Not Logged In');
      }
      if (!isUserCampOwner) {
        return new Error('Not Privileged Enough');
      }
      return await TentModel.find({ camp: userData.ownedCampId });
    } catch (err) {
      return err;
    }
  },
};

module.exports = { getTent, getAllTents };
