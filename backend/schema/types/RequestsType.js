const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

const RequestType = new GraphQLObjectType({
  name: 'Requests',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    phoneNumber: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
  }),
});

module.exports = RequestType;
