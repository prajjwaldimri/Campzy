<template lang="pug">
  .reg-flex
    div
      h1 Welcome to Campzy
    v-card(width='50%')
      v-layout(row style="min-height:50%")
        v-flex(xs6)
          v-card.welcome
            v-card-title(primary-title)
              h2 Please Login or Sign Up for Campzy
        v-flex(xs6)
          v-card
            v-tabs(color='cyan' dark)
              v-tabs-slider(color='yellow')
              v-tab(href="#signin") Sign In
              v-tab(href="#signup") Sign Up
              v-tab-item(id='signin')
                v-card(flat)
                  form(v-model='valid' style='margin:10px')
                    v-text-field(v-model="loginEmail" :rules='emailRules' label='Email' required)
                    v-text-field(v-model="loginPassword" :rules='passwordRules' type='password' label='Password' required)
                  .text-xs-center(style='margin:10px;display:flex;flex-direction:column')
                    v-btn(round color='primary' @click='logIn' dark) Sign In
              v-tab-item(id='signup')
                v-card(flat)
                  form(v-model='valid' style='margin:10px')
                    v-text-field(v-model="email" :rules='emailRules' label='Email' required)
                    v-text-field(v-model="password" :rules='passwordRules' type='password' label='Password'
                    required)
                    v-text-field(v-model="phone" :rules='phoneRules' label='Phone Number' required)
                  .text-xs-center(style='margin:10px;display:flex;flex-direction:column')
                    v-btn(round color='primary' @click="regUser()" dark) Sign Up


</template>
<script>
import { request } from 'graphql-request';

// import gql from 'graphql-tag';

export default {
  data: () => ({
    valid: false,
    email: '',
    loginEmail: '',
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
    testCamp: '',

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
      request('http://localhost:4444/graphql', registerUser, variables).then(data => console.log(data)).catch((err) => {
        console.log(err.response.errors);
        console.log(err.response.data);
      });
    },
    logIn() {
      this.$auth.login({
        body: { email: this.loginEmail, password: this.loginPassword },


      }).then(() => {
        console.log('Waah!');
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
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url("https://static1.squarespace.com/static/56957ff1d82d5e93424a02f3/t/56b2a2aa3c44d8191689df8c/1454547627840/Camp+Leo+Landing.jpg?format=1500w");
  background-size: cover;
}

.welcome {
  justify-content: center;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url("https://www.adelaidechristiancentre.com.au/wp-content/uploads/2016/03/church-camp.jpg");
  background-size: cover;
}
</style>
