const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
} = graphql;

// A blog type for User
const LocalBlogType = new GraphQLObjectType({
  name: 'LocalBlog',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    content: { type: GraphQLString },
    url: { type: GraphQLString },
    heroImage: { type: GraphQLString },
    heroImageCaption: { type: GraphQLString },
  }),
});

const CampBookingsType = new GraphQLObjectType({
  name: 'CampBooking',
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: GraphQLID },
    camp: { type: GraphQLID },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    type: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    jwt: { type: GraphQLString },
    dateOfBirth: { type: GraphQLString },
    isEmailVerified: { type: GraphQLBoolean },
    profilePicture: { type: GraphQLString },
    count: { type: GraphQLInt },
    page: { type: GraphQLInt },
    blogs: {
      type: new GraphQLList(LocalBlogType),
    },
    googleToken: { type: GraphQLString },
    facebookToken: { type: GraphQLString },
    bookings: { type: new GraphQLList(CampBookingsType) },
  }),
});

module.exports = UserType;
