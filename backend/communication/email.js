const mailjet = require('node-mailjet').connect(
  process.env.MAILJET_PUBLIC,
  process.env.MAILJET_PRIVATE,
);

const moment = require('moment');

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

const sendSuccessBookingEmail = async (booking, user, camp, amount) => {
  try {
    return await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'bookings@campzy.in',
            Name: 'Campzy',
          },
          To: [
            {
              Email: user.email,
              Name: user.name,
            },
          ],
          TemplateID: 553951,
          TemplateLanguage: true,
          Subject: 'Booking Successful',
          Variables: {
            userName: user.name,
            campName: camp.name,
            bookingId: booking.code,
            fromDate: moment(booking.startDate).format('dddd, MMMM Do YYYY'),
            toDate: moment(booking.endDate).format('dddd, MMMM Do YYYY'),
            bookingCost: amount,
          },
        },
      ],
    });
  } catch (err) {
    return err;
  }
};

module.exports = {
  sendEmailVerificationToken,
  sendResetPasswordToken,
  sendSuccessBookingEmail,
};
