const client = require('twilio')(
  'ACabc517de4bcf13d79c5c4268f6aa90f5',
  process.env.TWILIO_API_KEY,
);

const sendSMS = async (phoneNumber, message) => {
  try {
    return await client.messages.create({
      from: '+15172251199',
      body: message,
      to: phoneNumber,
    });
  } catch (err) {
    return err;
  }
};

module.exports = { sendSMS };
