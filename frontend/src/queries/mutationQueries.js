const registerUser = `mutation register($email: String!, $password: String!, $phoneNumber: String!) {
          register(email: $email, password: $password, phoneNumber: $phoneNumber) {
            id
            name
            email
        }
      }`;

// eslint-disable-next-line
export { registerUser };
