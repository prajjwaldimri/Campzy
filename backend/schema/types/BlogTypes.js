const graphql = require('graphql');

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
    authorId: { type: GraphQLString },
  }),
});

module.exports = BlogType;
