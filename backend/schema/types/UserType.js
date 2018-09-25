const graphql = require('graphql');

// const CampType = require('./CampType');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
} = graphql;

// A blog type for User
const LocalBlogType = new GraphQLObjectType({
  name: 'LocalBlog',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    content: { type: GraphQLString },
    url: { type: GraphQLString },
    heroImage: { type: GraphQLString },
    heroImageCaption: { type: GraphQLString },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    type: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    jwt: { type: GraphQLString },
    dateOfBirth: { type: GraphQLString },
    isEmailVerified: { type: GraphQLBoolean },
    profilePicture: { type: GraphQLString },
    count: { type: GraphQLInt },
    page: { type: GraphQLInt },
    blogs: {
      type: new GraphQLList(LocalBlogType),
    },
    googleToken: { type: GraphQLString },
    facebookToken: { type: GraphQLString },
    wishlist: { type: new GraphQLList(GraphQLString) },
  }),
});

module.exports = UserType;
