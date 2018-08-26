const registerUser = `mutation register($email: String!, $password: String!, $phoneNumber: String!, $otp: String!) {
          register(email: $email, password: $password, phoneNumber: $phoneNumber, otp: $otp) {
            jwt
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

const sendResetPasswordToken = `query sendResetPasswordToken($email: String!) {
  sendResetPasswordToken(email: $email) {
    id
  }
}`;

const resetPasswordMutation = '';

const addTentQuery = `mutation addTent($tentType: String!, $capacity: String!, $bookingPrice: String!, $preBookTime: String!, $surgePrice: String!) {
  addTent(type: $tentType, capacity: $capacity, bookingPrice: $bookingPrice, preBookPeriod: $preBookTime , surgePrice: $surgePrice){
    type,
    capacity,
    bookingPrice,
    preBookPeriod,
    surgePrice
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
  addTentQuery,
  sendOTP,
  sendResetPasswordToken,
  resetPasswordMutation,
};