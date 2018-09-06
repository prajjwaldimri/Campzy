const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString } = graphql;

const DocumentType = new GraphQLObjectType({
  name: 'Documents',
  fields: () => ({
    name: { type: GraphQLString },
    location: { type: GraphQLString },
  }),
});

module.exports = DocumentType;
