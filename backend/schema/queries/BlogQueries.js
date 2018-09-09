// const graphql = require('graphql');
const BlogModel = require('../../models/blog.js');
const UserModel = require('../../models/user.js');
const BlogType = require('../types/BlogTypes');
const { NotLoggedinError, PrivilegeError } = require('../graphqlErrors');
const auth = require('../../config/auth');

// const { GraphQLString, GraphQLList, GraphQLInt } = graphql;

const getAllBlogs = {
  type: BlogType,
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
      return await BlogModel.find({});
    } catch (err) {
      return err;
    }
  },
};

const getCurrentUserBlog = {
  type: BlogType,
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
      return await BlogModel.findById(userData.authoredBlogId);
    } catch (err) {
      return err;
    }
  },
};

module.exports = { getCurrentUserBlog, getAllBlogs };
