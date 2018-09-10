const graphql = require('graphql');
const BlogModel = require('../../models/blog.js');
const UserModel = require('../../models/user.js');
const BlogType = require('../types/BlogType');
// const UserType = require('../types/UserType');
const { NotLoggedinError, PrivilegeError } = require('../graphqlErrors');
const auth = require('../../config/auth');

const { GraphQLString } = graphql;

const addBlogger = {
  type: BlogType,
  args: {
    id: { type: GraphQLString },
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
      return await UserModel.findByIdAndUpdate(args.id, {
        type: 'Blogger',
      });
    } catch (err) {
      return err;
    }
  },
};
const addBlog = {
  type: BlogType,
  args: {
    title: { type: GraphQLString },
    url: { type: GraphQLString },
    content: { type: GraphQLString },
    heroImage: { type: GraphQLString },
    authorId: { type: GraphQLString },
    description: { type: GraphQLString },
    heroImageCaption: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserBlogger = auth.isUserBlogger(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserBlogger) {
        throw new PrivilegeError();
      }
      const blog = new BlogModel({
        title: args.title,
        url: args.url,
        content: args.content,
        heroImage: args.heroImage,
        description: args.description,
        heroImageCaption: args.heroImageCaption,
        authorId: user.id,
      });
      const createBlog = await blog.save();
      return await UserModel.findByIdAndUpdate(
        user.id,
        { $push: { authoredBlogId: createBlog.id } },
        { new: true },
      );
    } catch (err) {
      return err;
    }
  },
};

const updateBlog = {
  type: BlogType,
  args: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    url: { type: GraphQLString },
    content: { type: GraphQLString },
    heroImage: { type: GraphQLString },
    description: { type: GraphQLString },
    heroImageCaption: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    try {
      console.log(args.id);
      const user = await auth.getAuthenticatedUser(context.req);
      const userData = await UserModel.findById(user.id);
      const isUserBlogger = auth.isUserBlogger(userData);
      if (userData === null) {
        throw new NotLoggedinError();
      }
      if (!isUserBlogger) {
        throw new PrivilegeError();
      }
      return await BlogModel.findByIdAndUpdate(
        args.id,
        {
          title: args.title,
          url: args.url,
          content: args.content,
          heroImage: args.heroImage,
          description: args.description,
          heroImageCaption: args.heroImageCaption,
        },
        { new: true },
      );
    } catch (err) {
      return err;
    }
  },
};
module.exports = { addBlog, addBlogger, updateBlog };
