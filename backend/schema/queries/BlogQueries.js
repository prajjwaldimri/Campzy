const graphql = require('graphql');
const { markdown } = require('markdown');
const BlogModel = require('../../models/blog.js');
const UserModel = require('../../models/user.js');
const BlogType = require('../types/BlogType');
const { NotLoggedinError, PrivilegeError } = require('../graphqlErrors');
const auth = require('../../config/auth');

const { GraphQLString, GraphQLInt, GraphQLList } = graphql;

const getAllBlogs = {
  type: new GraphQLList(BlogType),
  args: {
    page: { type: GraphQLInt },
  },
  async resolve(parent, args) {
    try {
      return BlogModel.find({})
        .limit(12)
        .skip(args.page * 12)
        .sort('-createdAt');
    } catch (err) {
      return err;
    }
  },
};

const getUpdateBlog = {
  type: BlogType,
  args: {
    id: { type: GraphQLString },
  },
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
      return await BlogModel.findById(args.id);
    } catch (err) {
      return err;
    }
  },
};

const getBlog = {
  type: BlogType,
  args: {
    url: { type: GraphQLString },
  },
  async resolve(parent, args) {
    try {
      const blog = await BlogModel.findOne({ url: args.url }).populate(
        'authorId',
        'name',
      );
      if (blog) {
        blog.content = markdown.toHTML(blog.content);
      }
      return blog;
    } catch (err) {
      return err;
    }
  },
};

module.exports = {
  getAllBlogs,
  getBlog,
  getUpdateBlog,
};
