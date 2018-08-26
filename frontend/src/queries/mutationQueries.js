const registerUser = `mutation register($email: String!, $password: String!, $phoneNumber: String!, $otp: String!) {
          register(email: $email, password: $password, phoneNumber: $phoneNumber, otp: $otp) {
            id
            name
            email
        }
      }`;

const verifyEmailToken = `mutation confirmEmailToken($tokenValue: String!) {
  confirmEmailToken(tokenValue: $tokenValue) {
    tokenValue
  }
}`;

const sendVerificationEmail = `mutation resendEmailToken {
  resendEmailToken {
    id
  }
}`;

const sendOTP = `mutation sendOTP($phoneNumber: String!) {
  sendOTP(phoneNumber: $phoneNumber) {
    otpValue
  }
}`;

module.exports = {
  registerUser,
  verifyEmailToken,
  sendVerificationEmail,
  sendOTP,
};
