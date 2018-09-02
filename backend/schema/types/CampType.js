const graphql = require('graphql');
const UserModel = require('../../models/user.js');
const UserType = require('./UserType');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
} = graphql;

const CampType = new GraphQLObjectType({
  name: 'Camp',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    email: { type: GraphQLString },
    isEmailVerified: { type: GraphQLBoolean },
    isBlacklisted: { type: GraphQLBoolean },
    location: { type: GraphQLString },
    url: { type: GraphQLString },
    owner: {
      type: UserType,
      resolve(parent) {
        return UserModel.findById(parent.ownerId, 'name email');
      },
    },
    ownerId: { type: GraphQLString },
    shortDescription: { type: GraphQLString },
    longDescription: { type: GraphQLString },
    amenities: { type: new GraphQLList(GraphQLString) },
    placesOfInterest: { type: new GraphQLList(GraphQLString) },
    images: { type: new GraphQLList(GraphQLString) },
    heroImage: { type: GraphQLString },
    count: { type: GraphQLInt },
    page: { type: GraphQLInt },
    rating: { type: GraphQLFloat },
    altitude: { type: GraphQLString },
  }),
});

module.exports = CampType;
