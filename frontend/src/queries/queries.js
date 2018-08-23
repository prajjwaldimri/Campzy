// User log in
const sendUserCredientials = `query loginUsr($loginEmail: String!,$loginPassword: String!){
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
// eslint-disable-next-line
export { sendUserCredientials, getAllUsers };
