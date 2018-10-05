const mailjet = require('node-mailjet').connect(
  process.env.MAILJET_PUBLIC,
  process.env.MAILJET_PRIVATE,
);

const sendEmailVerificationToken = async (email, token) => {
  try {
    return await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'support@campzy.in',
            Name: 'Campzy',
          },
          To: [
            {
              Email: email,
            },
          ],
          TemplateID: 541428,
          TemplateLanguage: true,
          Subject: 'Email Verification Link',
          Variables: {
            verificationToken: token,
          },
        },
      ],
    });
  } catch (err) {
    return err;
  }
};

const sendResetPasswordToken = async (email, token) => {
  try {
    return await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'support@campzy.in',
            Name: 'Campzy',
          },
          To: [
            {
              Email: email,
            },
          ],
          TemplateID: 514379,
          TemplateLanguage: true,
          Subject: 'Password Reset Request at Campzy',
          Variables: {
            resetToken: token.tokenValue,
          },
        },
      ],
    });
  } catch (err) {
    return err;
  }
};

module.exports = { sendEmailVerificationToken, sendResetPasswordToken };
