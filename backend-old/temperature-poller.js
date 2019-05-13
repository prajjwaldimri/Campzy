/* Polls for temperature and stores */
require('dotenv').config();
const mongoose = require('mongoose');
const { forEach } = require('p-iteration');
const rp = require('request-promise-native'); //eslint-disable-line
const Camp = require('./models/camp');

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true },
);

async function temperatureRetriever() {
  try {
    const camps = await Camp.find({}).select(
      'coordinates temperature temperatureSummary',
    );
    await forEach(camps, async (camp) => {
      const updatedCamp = camp;
      let response = await rp(
        `https://api.darksky.net/forecast/${process.env.DARKSKY_SECRET}/${
          camp.coordinates.latitude
        },${
          camp.coordinates.longitude
        }?exclude=minutely,hourly,daily,alerts,flags&units=si`,
      );
      response = JSON.parse(response);
      updatedCamp.temperature = response.currently.temperature;
      updatedCamp.temperatureSummary = response.currently.summary;
      await updatedCamp.save();
      console.log('Done');
    });
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
}

mongoose.connection.once('open', async () => {
  await temperatureRetriever();
  process.exit(0);
});
