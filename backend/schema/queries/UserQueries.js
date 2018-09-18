const graphql = require('graphql');
const bcrypt = require('bcrypt');
const UserType = require('../types/UserType');
const auth = require('../../config/auth');
const {
  UsernamePasswordError,
  BlackListedError,
  PrivilegeError,
  NotLoggedinError,
  EmailAlreadyInUseError,
} = require('../graphqlErrors');
const UserModel = require('../../models/user.js');
const BlogModel = require('../../models/blog.js');
const BookingModel = require('../../models/booking.js');

const { GraphQLString, GraphQLList, GraphQLInt } = graphql;

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

const searchParticularUser = {
  type: new GraphQLList(UserType),
  args: {
    searchTerm: { type: GraphQLString },
    page: { type: GraphQLInt },
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
      return await UserModel.find({ $text: { $search: args.searchTerm } })
        .limit(8)
        .skip((args.page - 1) * 8);
    } catch (err) {
      return err;
    }
  },
};

const getAllUsers = {
  // Returns all users from DB
  type: new GraphQLList(UserType),
  args: {
    page: { type: GraphQLInt },
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
      return await UserModel.find({})
        .limit(8)
        .skip((args.page - 1) * 8);
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
      const passwordsMatch = await bcrypt.compare(
        password,
        userDocument.password,
      );
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

const countTotalUsers = {
  // Return total camps length
  type: UserType,
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
      const count = await UserModel.estimatedDocumentCount({});
      return { count };
    } catch (err) {
      return err;
    }
  },
};
const getCurrentUserBlog = {
  type: UserType,
  args: {},
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserBlogger = await auth.isUserBlogger(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserBlogger) {
        throw new PrivilegeError();
      }
      const blogDetails = await BlogModel.find({ authorId: user.id });
      return { blogs: blogDetails };
    } catch (err) {
      return err;
    }
  },
};

const getCampBookings = {
  type: UserType,
  args: {
    id: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserCampOwner = await auth.isUserCampOwner(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserCampOwner) {
        throw new PrivilegeError();
      }

      const getBooking = await BookingModel.find({ camp: args.id });
      return { bookings: getBooking };
    } catch (err) {
      return err;
    }
  },
};

const isEmailAvailable = {
  type: UserType,
  args: {
    email: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const user = await UserModel.findOne({ email: args.email });
    if (user) {
      throw new EmailAlreadyInUseError();
    } else {
      return 'Email Available!';
    }
  },
};

module.exports = {
  currentUser,
  getUser,
  searchUser,
  getAllUsers,
  loginUser,
  countTotalUsers,
  searchParticularUser,
  getCurrentUserBlog,
  isEmailAvailable,
  getCampBookings,
};
