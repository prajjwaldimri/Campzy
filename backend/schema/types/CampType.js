const graphql = require('graphql');
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
    lat: {
      type: GraphQLString,
    },
    lng: {
      type: GraphQLString,
    },
  }),
});

const AmenitiesType = new GraphQLObjectType({
  name: 'Amenities',
  fields: () => ({
    washRoomAttached: {
      type: GraphQLBoolean,
    },
    bonfire: {
      type: GraphQLBoolean,
    },
    hotWater: {
      type: GraphQLBoolean,
    },
    mobileConnectivity: {
      type: GraphQLBoolean,
    },
    mealsInclude: {
      type: GraphQLBoolean,
    },
    petsAllowed: {
      type: GraphQLBoolean,
    },
    chargingPoints: {
      type: GraphQLBoolean,
    },
  }),
});

const PlacesOfInterestType = new GraphQLObjectType({
  name: 'PlacesOfInterest',
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    distance: {
      type: GraphQLFloat,
    },
  }),
});

const BankType = new GraphQLObjectType({
  name: 'BankDetails',
  fields: () => ({
    beneficiary: {
      type: GraphQLString,
    },
    accountNumber: {
      type: GraphQLString,
    },
    IFSCCode: {
      type: GraphQLString,
    },
    accountType: {
      type: GraphQLString,
    },
  }),
});

const TerrainType = new GraphQLObjectType({
  name: 'Terrain',
  fields: () => ({
    glacier: {
      type: GraphQLBoolean,
    },
    forest: {
      type: GraphQLBoolean,
    },
    desert: {
      type: GraphQLBoolean,
    },
    ocean: {
      type: GraphQLBoolean,
    },
    hill: {
      type: GraphQLBoolean,
    },
    river: {
      type: GraphQLBoolean,
    },
  }),
});

const CampType = new GraphQLObjectType({
  name: 'Camp',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    phoneNumber: {
      type: GraphQLString,
    },
    tags: {
      type: new GraphQLList(GraphQLString),
    },
    email: {
      type: GraphQLString,
    },
    isAvailable: {
      type: GraphQLBoolean,
    },
    isEmailVerified: {
      type: GraphQLBoolean,
    },
    isBlacklisted: {
      type: GraphQLBoolean,
    },
    location: {
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
    },
    gst: {
      type: GraphQLString,
    },
    owner: {
      type: UserType,
    },
    coordinates: {
      type: CoordinateType,
    },
    terrain: {
      type: TerrainType,
    },
    ownerId: {
      type: UserType,
    },
    shortDescription: {
      type: GraphQLString,
    },
    longDescription: {
      type: GraphQLString,
    },
    amenities: {
      type: AmenitiesType,
    },
    placesOfInterest: {
      type: new GraphQLList(PlacesOfInterestType),
    },
    images: {
      type: new GraphQLList(GraphQLString),
    },
    heroImage: {
      type: GraphQLString,
    },
    count: {
      type: GraphQLInt,
    },
    page: {
      type: GraphQLInt,
    },
    rating: {
      type: GraphQLFloat,
    },
    altitude: {
      type: GraphQLString,
    },
    temperature: {
      type: GraphQLString,
    },
    temperatureSummary: {
      type: GraphQLString,
    },
    inventory: {
      type: new GraphQLList(TentType),
    },
    campDocuments: {
      type: new GraphQLList(GraphQLString),
    },
    averageRating: {
      type: GraphQLFloat,
    },
    ratingsCount: {
      type: GraphQLInt,
    },
    razorpayAccountId: {
      type: GraphQLString,
    },
    bank: {
      type: BankType,
    },
    agreementAccepted: {
      type: GraphQLBoolean,
    },
  }),
});

module.exports = CampType;