/* eslint-disable */
require('dotenv').config();
const faker = require('faker');
const mongoose = require('mongoose');
const User = require('../models/user');
const Camp = require('../models/camp');
const Tent = require('../models/tent');

faker.locale = 'en_IND';

// Add 100 users, camps and their tents
const userTypes = ['Camper', 'CampOwner'];
const createdUsers = [];
const createdCamps = [];
const createdTents = [];

async function CreateUser() {
  createdUsers.push(
    (await User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      type: userTypes[Math.floor(Math.random() * userTypes.length)],
      phoneNumber: faker.phone.phoneNumber(),
    }))._id,
  );
}

async function CreateCamps() {
  const randomUserId = createdUsers[Math.floor(Math.random() * createdUsers.length)];
  const camp = await Tent.create({
    name: faker.company.companyName(),
    phoneNumber: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    url: faker.random.word(),
    location: faker.fake('{{address.city}}, {{address.state}}'),
    coordinates: faker.fake('{{address.latitude}}, {{address.longitude}}'),
    ownerId: randomUserId,
    tags: new Array(8).fill(null).map(e => (e = faker.random.word())),
  });
}

async function CreateTents() {}

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true },
);
mongoose.connection.once('open', async () => {
  await CreateUser();
  await CreateCamps();
  // await CreateTents();
  process.exit(0);
});
