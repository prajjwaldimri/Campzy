const registerUser = `mutation register($email: String!, $password: String!, $phoneNumber: String!, $otp: String!, $name: String!, $googleToken: String, $facebookToken: String) {
          register(email: $email, password: $password, phoneNumber: $phoneNumber, otp: $otp, name: $name, googleToken: $googleToken, facebookToken: $facebookToken) {
            jwt
        }
      }`;

const googleAuth = `mutation googleAuth($token: String!){
  googleAuth(token: $token){
    jwt
  }
}`;

const facebookAuth = `mutation facebookAuth($token: String!){
  facebookAuth(token: $token){
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

const saveCampDetails = `mutation updateCamp($id: String!,$name: String, $phoneNumber: String,$email: String,$url: String, $ownerId: String!, $shortDescription: String!, $longDescription: String!, $amenities: [String], $placesOfInterest: [String], $tags: [String]!,$campDocuments:[String],$images:[String]!){
  updateCamp(id: $id,name: $name, phoneNumber: $phoneNumber, email: $email,url: $url, ownerId: $ownerId, shortDescription: $shortDescription, longDescription: $longDescription, amenities: $amenities, placesOfInterest: $placesOfInterest, tags:$tags, campDocuments: $campDocuments, images: $images){
    id
  }
}`;

const closeTentBooking = `mutation closeTentBooking($id: String!, $isAvailable: Boolean!){
    closeTentBooking(id: $id, isAvailable: $isAvailable){
      id
      isAvailable

  }
}`;

const campBooking = `mutation campAvailability($id: String!, $isAvailable: Boolean!){
    campAvailability(id: $id, isAvailable: $isAvailable){
      id
      isAvailable

  }
}`;

const addBloggerQuery = `mutation addBlogger($bloggerId: String!){
  addBlogger(id: $bloggerId){
    id,
}
}`;
const addBlogQuery = `mutation addBlog($title: String!, $content: String!,$url:String!, $heroImage:String!, $description:String!,$heroImageCaption: String!){
  addBlog(title:$title, content: $content, url: $url, heroImage:$heroImage, description: $description,heroImageCaption: $heroImageCaption){
    id
  }
}`;

const updateBlogQuery = `mutation updateBlog($id: String!,$title:String!, $content: String!, $description:String!,$heroImageCaption:String!,$url:String!, $heroImage: String!){
  updateBlog(id: $id, title:$title, content: $content, description: $description, url:$url, heroImageCaption: $heroImageCaption, heroImage: $heroImage){
  id
}}`;

const deleteUserBlog = `mutation deleteBlog($id: String!){
  deleteBlog(id:$id){
    id
  }
}`;

// Booking Mutations
const bookCampCheck = `mutation bookCampCheck($campId: String!, $adultCount: Int!, $childrenCount: Int!, $fromDate: Date!){
  bookCampCheck(campId: $campId, adultCount: $adultCount, childrenCount: $childrenCount, fromDate: $fromDate)
  {
    amount,
    tent{
      id
    }
  }
}`;
const bookCamp = `mutation bookCamp($razorpayPaymentId: String!, $tentId: String!, $adultCount: Int!, $childrenCount: Int!, $fromDate: Date!, $toDate: Date!){
  bookCamp(razorpayPaymentId: $razorpayPaymentId, tentId: $tentId, adultCount: $adultCount, childrenCount: $childrenCount, fromDate: $fromDate, toDate: $toDate){
    code
  }
}`;

module.exports = {
  registerUser,
  googleAuth,
  facebookAuth,
  verifyEmailToken,
  sendVerificationEmail,
  addTentQuery,
  sendOTP,
  sendResetPasswordToken,
  resetPasswordMutation,
  saveCampDetails,
  closeTentBooking,
  campBooking,
  addBloggerQuery,
  addBlogQuery,
  updateBlogQuery,
  deleteUserBlog,
  bookCampCheck,
  bookCamp,
};
