// User log in
const sendUserCredentials = `query loginUser($loginEmail: String!,$loginPassword: String!){
        loginUser(email: $loginEmail, password: $loginPassword){
          jwt
        }
      }`;

// Get all users for admin

const getAllUsers = `query {
  allUsers{
    id
    name
    phoneNumber
  }
}`;

const getAllTentsQuery = `query tent{
    tent{
      id
      type
      capacity
      bookingPrice
      preBookPeriod
      isBooked
      surgePrice
    }
  }
  `;

const getCamp = `query currentUserCamp{
        currentUserCamp {
          id,
          name,
          email,
          phoneNumber,
          url,
          ownerId
         
        }

      }`;

// eslint-disable-next-line
export { sendUserCredentials, getAllUsers, getAllTentsQuery, getCamp };
