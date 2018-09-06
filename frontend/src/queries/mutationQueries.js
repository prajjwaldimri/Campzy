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

const resetPasswordMutation = `mutation resetPassword($newPassword: String!, $confirmNewPassword: String!, $resetToken: String!){
  resetPassword(newPassword: $newPassword, confirmNewPassword: $confirmNewPassword, resetToken: $resetToken){
    id
  }
}`;

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

const saveCampDetails = `mutation updateCamp($id: String!,$name: String, $phoneNumber: String,$email: String,$url: String, $ownerId: String!, $shortDescription: String!, $longDescription: String!, $amenities: [String], $placesOfInterest: [String], $tags: [String]!,$campDocuments:[String]!){
  updateCamp(id: $id,name: $name, phoneNumber: $phoneNumber, email: $email,url: $url, ownerId: $ownerId, shortDescription: $shortDescription, longDescription: $longDescription, amenities: $amenities, placesOfInterest: $placesOfInterest, tags:$tags, campDocuments: $campDocuments){
    id
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
  saveCampDetails,
};
