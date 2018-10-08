// Mutations for Bank On-boarding of Camp Owners
const graphql = require('graphql');
const UserModel = require('../../models/user.js');

const { GraphQLString, GraphQLNonNull } = graphql;
const { NotLoggedinError, PrivilegeError } = require('../graphqlErrors');
const auth = require('../../config/auth');

const BankType = {
  RazorpayID: { type: GraphQLString },
};

const addBank = {
  type: BankType,
  args: {
    AccountNumber: { type: new GraphQLNonNull(GraphQLString) },
    AccountType: { type: new GraphQLNonNull(GraphQLString) },
    IFSCCode: { type: new GraphQLNonNull(GraphQLString) },
    BeneficiaryName: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, context) {
    const user = await auth.getAuthenticatedUser(context.req);
    const userData = await UserModel.findById(user.id);
    if (userData === null) {
      throw new NotLoggedinError();
    }

    if (!auth.isUserCampOwner(userData)) {
      throw new PrivilegeError();
    }
  },
};

module.exports = { addBank };
