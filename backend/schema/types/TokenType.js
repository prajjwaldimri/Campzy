const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString } = graphql;

const TokenType = new GraphQLObjectType({
  name: 'Token',
  fields: () => ({
    tokenValue: { type: GraphQLString },
  }),
});

module.exports = TokenType;
