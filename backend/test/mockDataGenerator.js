/* eslint-disable */
require('dotenv').config();
const faker = require('faker');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Camp = require('../models/camp');
const Tent = require('../models/tent');
const Review = require('../models/review');

faker.locale = 'en_IND';

// Add 100 users, camps and their tents
const userTypes = ['Camper', 'CampOwner', 'Admin', 'Blogger'];
const campTypes = ['Dome', 'Triangle', 'Hexagonal'];
const terrainTypes = ['glacier', 'forest', 'desert', 'ocean', 'hill', 'river'];
const s3Images = [
  '1538556993356__camp1.jpeg',
  '1538556993388__camp2.jpeg',
  '1538556993391__camp3.jpeg',
  '1538556993395__camp4.jpeg',
  '1538556993405__camp5.jpeg',
  '1538556993407__camp6.jpeg',
  '1538556993411__camp7.jpeg',
  '1538556993420__camp8.jpeg',
];

async function CreateCamp(userId, phoneNumber) {
  let camp;
  const tents = [];
  try {
    camp = await Camp.create({
      name: faker.company.companyName(),
      isAvailable: true,
      phoneNumber,
      email: faker.internet.email(),
      [`terrain.${faker.random.arrayElement(terrainTypes)}`]: true,
      url: faker.random.uuid(),
      shortDescription: faker.lorem.sentence(),
      longDescription: faker.lorem.paragraph(),
      location: faker.fake('{{address.city}}, {{address.state}}'),
      'coordinates.latitude': faker.address.latitude(),
      'coordinates.longitude': faker.address.longitude(),
      'amenities.washRoomAttached': faker.random.boolean(),
      'amenities.mealsInclude': faker.random.boolean(),
      'amenities.bonfire': faker.random.boolean(),
      'amenities.hotWater': faker.random.boolean(),
      'amenities.mobileConnectivity': faker.random.boolean(),
      'amenities.chargingPoints': faker.random.boolean(),
      'amenities.petsAllowed': faker.random.boolean(),
      ownerId: userId,
      images: new Array(10)
        .fill(null)
        .map(e => (e = faker.random.arrayElement(s3Images))),
      heroImage: faker.random.arrayElement(s3Images),
      averageRating: faker.random.number({ min: 1, max: 5 }),
      ratingsCount: faker.random.number({ min: 100, max: 10000 }),
      altitude: faker.random.number({ min: 100, max: 2000 }),
      tags: new Array(8).fill(null).map(e => (e = faker.random.word())),
      placesOfInterest: new Array(4).fill(null).map(
        e =>
          (e = {
            name: faker.hacker.noun(),
            distance: faker.random.number({
              min: 0,
              max: 10,
              precision: 0.1,
            }),
          }),
      ),
    });
    for (let i = 0; i < faker.random.number({ min: 1, max: 10 }); i++) {
      const tent = await Tent.create({
        capacity: faker.random.number({ min: 1, max: 4 }),
        isAvailable: true,
        type: faker.random.arrayElement(campTypes),
        bookingPrice: faker.random.number({ min: 1000, max: 80000 }),
        surgePrice: faker.random.number({ min: 1000, max: 80000 }),
        preBookPeriod: faker.random.number({ min: 2, max: 15 }),
        camp: camp._id,
      });
      await Review.create({
        stars: faker.random.number({ min: 1, max: 5 }),
        comment: faker.lorem.sentences(),
        camp: camp._id,
        user: userId,
      });
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
      createdUser.ownedCampId = await CreateCamp(
        createdUser._id,
        createdUser.phoneNumber,
      );
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

function handleRejection(p) {
  return p.catch(err => ({ error: err }));
}
mongoose.connection.once('open', async () => {
  // Remove all data
  await User.remove({});
  await Tent.remove({});
  await Camp.remove({});
  await Review.remove({});
  for (let i = 0; i < 10000; i++) {
    await Promise.all(
      [CreateUser(), CreateUser(), CreateUser(), CreateUser()].map(
        handleRejection,
      ),
    );
  }
  process.exit(0);
});
