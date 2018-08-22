<template lang="pug">
  .reg-flex
    navbar
    v-container(fluid grid-list-md)
      v-flex(sm5 xs12)
        v-card.text-xs-center(style='margin-top:5rem;box-shadow:none' v-show='!forRegister')
          div(style='margin:1.5rem;')
            h1
              span Log
              span.light-green--text.text--accent-4 in
            form(v-model='valid' style='margin:1.5rem')
              v-text-field(v-model="loginEmail" :rules='emailRules' color='green accent-4' label='Email' required)
              v-text-field(v-model="loginPassword" :rules='passwordRules' color='green accent-4' type='password' label='Password' required)
            v-btn.btn-size(round color='green accent-4' @click='logIn' @keyup.enter='logIn') Sign In
            h3(style='margin:1rem')
              span O
              span.light-green--text.text--accent-4 r
            //- img(src='/vectors/google-plus.svg' style="width:40px;height:40px;margin-right:2rem")
            //- img(src='/vectors/facebook.svg' style='width:30px;height:30px;')
            v-btn.btn-size( flat small color='green accent-4' @click='forRegister = true') New User? Register

        v-card.text-xs-center(style='margin-top:5rem;border-radius:0.5rem' v-show='forRegister')
          div(style='margin:1.5rem;')
            h1
              span Sign
              span.light-green--text.text--accent-4 up
            form(v-model='valid' style='margin:1.5rem')
              v-text-field(v-model="email" :rules='emailRules' color='green accent-4' label='Email' required)
              v-text-field(v-model="password" :rules='passwordRules' color='green accent-4' type='password' label='Password' required)
              v-text-field(v-model="phone" :rules='phoneRules' color='green accent-4' label='Phone Number' required)
            v-btn.btn-size(round color='green accent-4' @click='regUser' @keyup.enter='regUser') Sign Up
            h3(style='margin:1rem')
              span O
              span.light-green--text.text--accent-4 r
            //- img(src='/vectors/google-plus.svg' style="width:40px;height:40px;margin-right:2rem")
            //- img(src='/vectors/facebook.svg' style='width:30px;height:30px;')
            v-btn.btn-size( flat small color='green accent-4' @click='forRegister = false') Existing User? Sign in
      //- v-flex.side-image(sm5 xs12)

</template>
<script>
import { request } from 'graphql-request';
import navbar from '../Navbar.vue';

export default {
  name: 'Home',
  components: {
    navbar,
  },
  data: () => ({
    forRegister: false,
    valid: false,
    signed: false,
    signedfail: false,
    email: '',
    loginEmail: '',
    loggedIn: false,
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid',
    ],
    password: '',
    loginPassword: '',
    passwordRules: [
      v => !!v || 'Password is required',
    ],
    phone: '',
    phoneRules: [
      v => !!v || 'Phone Number Required',
    ],


  }),

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
.reg-flex {
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
      rgba(236, 236, 236, 0.9),
      rgba(236, 236, 236, 0.9)
    ),
    url("https://images.pexels.com/photos/93858/pexels-photo-93858.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940");
  background-size: cover;
}

.side-image {
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background: url("https://images.pexels.com/photos/939723/pexels-photo-939723.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350");
  background-size: cover;
}

.btn-size {
  width: 50%;
  margin: 1rem;
}

.welcome-title {
  font-size: 4rem;
  font-weight: 400;
}
.about-campzy {
  margin-top: 2rem;
  line-height: 1.5rem;
  text-align: justify;
  font-weight: 100;
}
</style>
