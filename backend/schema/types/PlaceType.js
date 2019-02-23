const graphql = require('graphql');

const { GraphQLObjectType, GraphQLList } = graphql;

const CampType = require('./CampType');

const PlaceType = new GraphQLObjectType({
  name: 'Place',
  fields: () => ({
    luxuryCamps: { type: new GraphQLList(CampType) },
    premiumCamps: { type: new GraphQLList(CampType) },
    normalCamps: { type: new GraphQLList(CampType) },
    cheapCamps: { type: new GraphQLList(CampType) },
  }),
});

module.exports = PlaceType;
