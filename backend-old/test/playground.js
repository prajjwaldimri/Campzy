const accountSid = 'ACabc517de4bcf13d79c5c4268f6aa90f5';
const authToken = 'your_auth_token';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({ from: '+15017122661', body: 'body', to: '+15558675310' })
  .then(message => console.log(message.sid))
  .done();
