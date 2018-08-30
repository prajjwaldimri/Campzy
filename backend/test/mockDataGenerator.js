/* eslint-disable */
require('dotenv').config();
const faker = require('faker');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Camp = require('../models/camp');
const Tent = require('../models/tent');

faker.locale = 'en_IND';

// Add 100 users, camps and their tents
const userTypes = ['Camper', 'CampOwner', 'Admin'];
const campTypes = ['Dome', 'Triangle', 'Hexagonal'];

async function CreateCamp(userId, phoneNumber) {
  let camp;
  let tents = [];
  try {
    camp = await Camp.create({
      name: faker.company.companyName(),
      phoneNumber: phoneNumber,
      email: faker.internet.email(),
      url: faker.random.word(),
      shortDescription: faker.lorem.sentence(),
      longDescription: faker.lorem.paragraph(),
      location: faker.fake('{{address.city}}, {{address.state}}'),
      'coordinates.latitude': faker.address.latitude(),
      'coordinates.longitude': faker.address.longitude(),
      ownerId: userId,
      images: new Array(10).fill(null).map(e => (e = faker.image.nature())),
      amenities: new Array(8).fill(null).map(e => (e = faker.random.word())),
      altitude: faker.random.number({ min: 100, max: 2000 }),
      tags: new Array(8).fill(null).map(e => (e = faker.random.word())),
      placesOfInterest: new Array(4).fill(null).map(e => (e = faker.hacker.noun())),
    });
    for (let i = 0; i < 3; i++) {
      let tent = await Tent.create({
        capacity: faker.random.number({ min: 1, max: 4 }),
        type: faker.random.arrayElement(campTypes),
        bookingPrice: faker.random.number({ min: 1000, max: 80000 }),
        surgePrice: faker.random.number({ min: 1000, max: 80000 }),
        preBookPeriod: faker.random.number({ min: 2, max: 15 }),
        camp: camp._id,
      });
      camp.inventory.push(tent._id);
    }
    await camp.save();
    return camp._id;
  } catch (err) {
    console.error(err);
  }
}

async function CreateUser() {
  try {
    const password = await bcrypt.hash('test@123#', 10);

    const createdUser = await User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      type: faker.random.arrayElement(userTypes),
      phoneNumber: faker.phone.phoneNumber().replace(/-/g, ''),
    });
    if (createdUser.type === 'CampOwner') {
      createdUser.ownedCampId = await CreateCamp(createdUser._id, createdUser.phoneNumber);
      await createdUser.save();
    }
    console.info('User added');
  } catch (err) {
    console.warn('Cannot add user!');
  }
}

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true },
);
mongoose.connection.once('open', async () => {
  // Remove all data
  await User.remove({});
  await Tent.remove({});
  await Camp.remove({});
  for (let i = 0; i < 100; i++) {
    await CreateUser();
  }
  process.exit(0);
});
