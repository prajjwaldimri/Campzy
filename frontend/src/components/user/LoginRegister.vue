<template lang="pug">
  h1 Hello
</template>

<script>
import { request } from 'graphql-request';
import navbar from '../Navbar.vue';

export default {
  components: {
    navbar,
  },
  data() { return {}; },

  methods: {
    regUser() {
      const registerUser = `mutation register($email: String!, $password: String!, $phoneNumber: String!) {
          register(email: $email, password: $password, phoneNumber: $phoneNumber) {
            id
        }
      }`;
      const variables = {
        email: this.email,
        password: this.password,
        phoneNumber: this.phone,
      };
      request('http://localhost:4444/graphql', registerUser, variables).then((data) => {
        if (data != null) {
          this.signed = true;
        }
        this.email = '';
        this.password = '';
        this.phone = '';
      }).catch((err) => {
        if (err) {
          this.signedfail = true;
        }
        this.email = '';
        this.password = '';
        this.phone = '';
      });
    },
    logIn() {
      const sendUserCredientials = `query loginUsr($loginEmail: String!,$loginPassword: String!){
        loginUser(email: $loginEmail, password: $loginPassword){
          jwt
        }
      }`;
      const variables = {
        loginEmail: this.loginEmail,
        loginPassword: this.loginPassword,
      };
      request('http://localhost:4444/graphql', sendUserCredientials, variables).then((data) => {
        this.$cookie.set('sessionToken', JSON.parse(data.loginUser.jwt), 1, 'secure');
        window.location.href = `${window.location.origin}/#/settings`;
      }).catch((err) => {
        this.loggedIn = true;
        console.log(err);
      });
    },
  },
};

</script>

<style lang="scss" scoped>
</style>
