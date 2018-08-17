const mongoose = require('mongoose');

const { Schema } = mongoose;

const CampSchema = new Schema({
  name: String,
  ownerId: String,
});

module.exports = mongoose.model('Camp', CampSchema);
