const graphql = require('graphql');
const UserModel = require('../../models/user.js');
const UserType = require('./UserType');
const TentType = require('./TentType');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
} = graphql;

const CoordinateType = new GraphQLObjectType({
  name: 'Coordinate',
  fields: () => ({
    latitude: { type: GraphQLString },
    longitude: { type: GraphQLString },
  }),
});

const CampType = new GraphQLObjectType({
  name: 'Camp',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    email: { type: GraphQLString },
    isAvailable: { type: GraphQLBoolean },
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
    coordinates: { type: CoordinateType },
    terrain: { type: GraphQLString },
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
    inventory: { type: new GraphQLList(TentType) },
    campDocuments: { type: new GraphQLList(GraphQLString) },
  }),
});

module.exports = CampType;
