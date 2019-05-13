/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_userId"] }] */
// Mutations for Bank On-boarding of Camp Owners
const graphql = require('graphql');
const axios = require('axios');
const ifsc = require('ifsc');
const Razorpay = require('razorpay');

const authKey = Buffer.from(
  `${process.env.RAZORPAY_API_KEY}:${process.env.RAZORPAY_API_SECRET}`,
).toString('base64');

axios.defaults.headers.common.Authorization = `Basic ${authKey}`;

axios.defaults.headers.post['Content-Type'] = 'application/json';
const UserModel = require('../../models/user.js');
const CampModel = require('../../models/camp');
const CampType = require('../types/CampType.js');

const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLBoolean,
} = graphql;
const {
  NotLoggedinError,
  PrivilegeError,
  BankAccountExistsError,
} = require('../graphqlErrors');
const auth = require('../../config/auth');

const BankType = new GraphQLObjectType({
  name: 'Bank',
  fields: () => ({
    id: { type: GraphQLString },
    entity: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

const IFSCType = new GraphQLObjectType({
  name: 'IFSC',
  fields: () => ({
    BRANCH: { type: GraphQLString },
    ADDRESS: { type: GraphQLString },
    CITY: { type: GraphQLString },
    DISTRICT: { type: GraphQLString },
    STATE: { type: GraphQLString },
    BANK: { type: GraphQLString },
    BRANCHCODE: { type: GraphQLString },
    IFSC: { type: GraphQLString },
  }),
});

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

      const campData = await CampModel.findOne({ ownerId: userData._id });

      if (campData.razorpayAccountId) {
        throw new BankAccountExistsError();
      }

      if (!auth.isUserCampOwner(userData)) {
        throw new PrivilegeError();
      }

      const response = await axios.post(
        'https://api.razorpay.com/v1/beta/accounts',
        {
          name: userData.name,
          email: userData.email,
          tnc_accepted: true,
          account_details: {
            business_name: campData.name,
            business_type: 'individual',
            landline: campData.phoneNumber,
            mobile: userData.phoneNumber,
          },
          bank_account: {
            ifsc_code: args.IFSCCode,
            beneficiary_name: args.beneficiaryName,
            account_type: args.accountType,
            account_number: args.accountNumber,
          },
        },
      );
      campData.razorpayAccountId = response.data.id;
      campData.bank.beneficiary = args.beneficiaryName;
      campData.bank.IFSCCode = args.IFSCCode;
      campData.bank.accountType = args.accountType;
      campData.bank.accountNumber = args.accountNumber;
      await campData.save();

      // Create a customer ID for the camp if not present
      if (!campData.razorpayCustomerId) {
        const instance = new Razorpay({
          key_id: process.env.RAZORPAY_API_KEY,
          key_secret: process.env.RAZORPAY_API_SECRET,
        });
        // If no customer Id exists for the camp-owner create one
        const customer = await instance.customers.create({
          name: campData.name,
          email: campData.email,
          contact: campData.phoneNumber,
        });
        campData.razorpayCustomerId = customer.id;
        await campData.save();
      }
      return response.data.id;
    } catch (err) {
      return err;
    }
  },
};

const getBank = {
  type: CampType,
  args: {},
  async resolve(parent, args, context) {
    const user = await auth.getAuthenticatedUser(context.req);
    const userData = await UserModel.findById(user.id);
    if (userData === null) {
      throw new NotLoggedinError();
    }

    const campData = await CampModel.findOne({ ownerId: userData._id }).select(
      'razorpayAccountId bank agreementAccepted',
    );

    if (!auth.isUserCampOwner(userData)) {
      throw new PrivilegeError();
    }

    return campData;
  },
};

const isIFSCValid = {
  type: GraphQLBoolean,
  args: {
    IFSCCode: { type: GraphQLString },
  },
  async resolve(parent, args) {
    try {
      return ifsc.validate(args.IFSCCode);
    } catch (err) {
      return err;
    }
  },
};

const getIFSCDetails = {
  type: IFSCType,
  args: {
    IFSCCode: { type: GraphQLString },
  },
  async resolve(parent, args) {
    try {
      return ifsc.fetchDetails(args.IFSCCode);
    } catch (err) {
      return err;
    }
  },
};

module.exports = {
  addBank,
  getBank,
  isIFSCValid,
  getIFSCDetails,
};
