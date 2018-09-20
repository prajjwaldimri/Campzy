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

const addTentQuery = `mutation addTent($tentType: String!, $capacity: String!, $bookingPrice: String!, $preBookTime: String!) {
  addTent(type: $tentType, capacity: $capacity, bookingPrice: $bookingPrice, preBookPeriod: $preBookTime){
    type,
    capacity,
    bookingPrice,
    preBookPeriod,
  }
}`;
const sendOTP = `mutation sendOTP($phoneNumber: String!) {
  sendOTP(phoneNumber: $phoneNumber) {
    otpValue
  }
}`;

const saveCampDetails = `mutation updateUserCamp($id: String!,$name: String, $phoneNumber: String,$email: String,$url: String, $ownerId: String!, $shortDescription: String!, $longDescription: String!, $amenities: [String], $placesOfInterest: [String], $tags: [String]!){
  updateUserCamp(id: $id,name: $name, phoneNumber: $phoneNumber, email: $email,url: $url, ownerId: $ownerId, shortDescription: $shortDescription, longDescription: $longDescription, amenities: $amenities, placesOfInterest: $placesOfInterest, tags:$tags){
    id
  }
}`;

const updateCampImages = `mutation updateCampImages($id: String!, $images: String){
  updateCampImages(id: $id, images: $images){
    id
  }
}`;

const deleteCampImage = `mutation deleteCampImage($id: String, $imageName: String!){
  deleteCampImage(id: $id, imageName: $imageName){
    id

  }
}`;

const updateCampDocuments = `mutation updateCampDocuments($id: String!, $campDocuments: String!){
  updateCampDocuments(id: $id, campDocuments: $campDocuments){
    id
  }
}`;

const deleteCampDocument = `mutation deleteCampDocument($id: String!, $documentName: String!){
  deleteCampDocument(id: $id, documentName: $documentName){
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
const bookCampCheck = `mutation bookCampCheck($tentIds: [String]!,  $fromDate: Date!, $toDate: Date!){
  bookCampCheck(tentIds: $tentIds, fromDate: $fromDate, toDate: $toDate)
  {
    amount,
    tent{
      id
    }
  }
}`;
const bookCamp = `mutation bookCamp($razorpayPaymentId: String!, $tentIds: [String]!, $personCount: Int!, $tentCount: Int!, $fromDate: Date!, $toDate: Date!){
  bookCamp(razorpayPaymentId: $razorpayPaymentId, tentIds: $tentIds, tentCount: $tentCount, personCount: $personCount, fromDate: $fromDate, toDate: $toDate){
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
  updateCampImages,
  deleteCampImage,
  updateCampDocuments,
  deleteCampDocument,
  closeTentBooking,
  campBooking,
  addBloggerQuery,
  addBlogQuery,
  updateBlogQuery,
  deleteUserBlog,
  bookCampCheck,
  bookCamp,
};
