/* Polls for temperature and stores */
require('dotenv').config();
const mongoose = require('mongoose');
const { forEach } = require('p-iteration');
const axios = require('axios');
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
      const response = await axios.get(
        `https://api.darksky.net/forecast/${process.env.DARKSKY_SECRET}/${
          camp.coordinates.latitude
        },${
          camp.coordinates.longitude
        }?exclude=minutely,hourly,daily,alerts,flags?units=si`,
      );
      updatedCamp.temperature = response.data.currently.temperature;
      updatedCamp.temperatureSummary = response.data.currently.summary;
      await updatedCamp.save();
    });
  } catch (err) {
    console.log(err);
  }
}

function handleRejection(p) {
  return p.catch(err => ({ error: err }));
}

mongoose.connection.once('open', async () => {
  await Promise.all([temperatureRetriever()].map(handleRejection));
  process.exit(0);
});
