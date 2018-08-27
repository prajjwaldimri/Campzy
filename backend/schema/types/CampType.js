const graphql = require('graphql');
const UserModel = require('../../models/user.js');
const UserType = require('./UserType');

const {
  GraphQLObjectType, GraphQLString, GraphQLID, GraphQLBoolean, GraphQLList,
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
    ownerId: { type: GraphQLID },
  }),
});

module.exports = CampType;
