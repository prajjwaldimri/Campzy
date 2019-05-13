const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const { Schema } = mongoose;

const RequestSchema = new Schema(
  {
    name: { type: String },
    phoneNumber: {
      type: String,
      validate: [
        validate({
          validator: 'isMobilePhone',
          message: 'Not a valid phone number',
          arguments: ['any', true],
        }),
      ],
    },
  },
  { timestamps: true },
);

RequestSchema.index({
  name: 'text',
});

module.exports = mongoose.model('Request', RequestSchema);
