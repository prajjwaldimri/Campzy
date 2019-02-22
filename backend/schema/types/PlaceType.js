const graphql = require('graphql');

const { GraphQLObjectType, GraphQLList } = graphql;

const CampType = require('./CampType');

const PlaceType = new GraphQLObjectType({
  name: 'Place',
  fields: () => ({
    premiumCamps: { type: new GraphQLList(CampType) },
    normalCamps: { type: new GraphQLList(CampType) },
    cheapCamps: { type: new GraphQLList(CampType) },
  }),
});

module.exports = PlaceType;
