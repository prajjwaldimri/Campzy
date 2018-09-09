const graphql = require('graphql');
const UserType = require('./UserType');

const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

const BlogType = new GraphQLObjectType({
  name: 'Blog',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    content: { type: GraphQLString },
    url: { type: GraphQLString },
    heroImage: { type: GraphQLString },
    authorId: { type: UserType },
  }),
});

module.exports = BlogType;
