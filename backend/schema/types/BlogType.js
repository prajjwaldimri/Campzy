const graphql = require('graphql');
const { GraphQLDate } = require('graphql-iso-date');
const UserType = require('./UserType');

const {
  GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLID,
} = graphql;

const BlogType = new GraphQLObjectType({
  name: 'Blog',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    content: { type: GraphQLString },
    url: { type: GraphQLString },
    heroImage: { type: GraphQLString },
    heroImageCaption: { type: GraphQLString },
    authorId: { type: UserType },
    createdAt: { type: GraphQLDate },
    darkTheme: { type: GraphQLBoolean },
  }),
});

module.exports = BlogType;
