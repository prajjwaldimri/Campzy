const graphql = require('graphql');
const bcrypt = require('bcrypt');
const UserType = require('../types/UserType');
const auth = require('../../config/auth');
const {
  UsernamePasswordError,
  BlackListedError,
  PrivilegeError,
  NotLoggedinError,
} = require('../graphqlErrors');
const UserModel = require('../../models/user.js');

const { GraphQLString, GraphQLList } = graphql;

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

const searchUser = {
  type: new GraphQLList(UserType),
  args: {
    searchTerm: { type: GraphQLString },
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
      return await UserModel.find({ name: { $regex: args.searchTerm } });
    } catch (err) {
      return err;
    }
  },
};

const getAllUsers = {
  // Returns all users from DB
  type: new GraphQLList(UserType),
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
      return await UserModel.find({});
    } catch (err) {
      return err;
    }
  },
};

const loginUser = {
  type: UserType,
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, args) {
    try {
      const { email } = args;
      const { password } = args;

      if (!email || !password) {
        throw new UsernamePasswordError();
      }

      const userDocument = await UserModel.findOne({ email });
      if (!userDocument) {
        throw new UsernamePasswordError();
      }
      if (userDocument.isBlacklisted) {
        throw new BlackListedError();
      }
      const passwordsMatch = await bcrypt.compare(password, userDocument.password);
      if (!passwordsMatch) {
        throw new UsernamePasswordError();
      }
      // Returns the jwt containing user's id, email and token

      return { jwt: JSON.stringify(userDocument.generateJWT()) };
    } catch (err) {
      return err;
    }
  },
};

module.exports = {
  currentUser,
  getUser,
  searchUser,
  getAllUsers,
  loginUser,
};
