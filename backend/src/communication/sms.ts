import twilio, { Twilio } from "twilio";
const client = twilio(
  "ACabc517de4bcf13d79c5c4268f6aa90f5",
  process.env.TWILIO_API_KEY
);

const sendSMS = async (
  phoneNumber: string,
  message: string
): Promise<Twilio.TwilioClientOptions> => {
  try {
    return await client.messages.create({
      from: "+15172251199",
      body: message,
      to: phoneNumber
    });
  } catch (err) {
    return err;
  }
};

export var sms = { sendSMS };
