const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const { Schema } = mongoose;

const RequestSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
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
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      sparse: true,
      validate: [
        validate({ validator: 'isEmail', message: 'Not a valid email' }),
      ],
    },
  },
  { timestamps: true },
);

RequestSchema.index({
  name: 'text',
});

module.exports = mongoose.model('Request', RequestSchema);
