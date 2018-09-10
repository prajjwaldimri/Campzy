const graphql = require('graphql');
const BlogType = require('./BlogType');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
} = graphql;

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
    blogs: { type: new GraphQLList(BlogType) },
  }),
});

module.exports = UserType;
