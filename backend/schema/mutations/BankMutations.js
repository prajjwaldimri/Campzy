/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_userId"] }] */
// Mutations for Bank On-boarding of Camp Owners
const graphql = require('graphql');
const axios = require('axios');
const UserModel = require('../../models/user.js');
const CampModel = require('../../models/camp');

const { GraphQLString, GraphQLNonNull } = graphql;
const { NotLoggedinError, PrivilegeError } = require('../graphqlErrors');
const auth = require('../../config/auth');

const BankType = {
  RazorpayID: { type: GraphQLString },
};

const addBank = {
  type: BankType,
  args: {
    accountNumber: { type: new GraphQLNonNull(GraphQLString) },
    accountType: { type: new GraphQLNonNull(GraphQLString) },
    IFSCCode: { type: new GraphQLNonNull(GraphQLString) },
    beneficiaryName: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      if (userData === null) {
        throw new NotLoggedinError();
      }

      const campData = await CampModel.find({ owner: userData._id });

      if (!auth.isUserCampOwner(userData)) {
        throw new PrivilegeError();
      }

      const instance = axios.create({
        baseURL: 'https://api.razorpay.com/v1/',
        headers: {
          Authorization: `${process.env.RAZORPAY_API_KEY}:${
            process.env.RAZORPAY_API_SECRET
          }`,
        },
      });

      const response = await instance.post('/beta/accounts', {
        name: userData.name,
        email: userData.email,
        tnc_accepted: true,
        account_details: {
          mobile: userData.phoneNumber,
          landline: campData.phoneNumber,
          business_name: campData.name,
          business_type: 'individual',
        },
        bank_account: {
          ifsc_code: args.IFSCCode,
          beneficiary_name: args.beneficiaryName,
          account_type: args.accountType,
          account_number: args.accountNumber,
        },
      });
      console.log(response);
      return response;
    } catch (err) {
      return err;
    }
  },
};

module.exports = { addBank };
