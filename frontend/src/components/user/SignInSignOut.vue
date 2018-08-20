<template lang="pug">
  v-card(width='40%')
    v-tabs(color='cyan' dark)
      v-tabs-slider(color='yellow')
      v-tab(href="#signin") Sign In
      v-tab(href="#signup") Sign Up
      v-tab-item(id='signin')
        v-card(flat)
          form(v-model='valid' style='margin:10px')
            v-text-field(v-model="email" :rules='emailRules' label='Email' required)
            v-text-field(v-model="password" :rules='passwordRules' type='password' label='Password' required)
          .text-xs-center(style='margin:10px;display:flex;flex-direction:column')
            v-btn(round color='primary' dark) Sign In
            p Or Using
          v-flex.text-xs-center
            a(href='#')
              v-avatar(size='32' style='margin:10px')
                i.fab.fa-google.fa-2x
            a(href="#")
              v-avatar(size='32' style='margin:10px')
                i.fab.fa-facebook.fa-2x
      v-tab-item(id='signup')
        v-card(flat)
          form(v-model='valid' style='margin:10px')
            v-text-field(v-model="phone" :rules='phoneRules' label='Phone Number' required)
            v-text-field(v-model="email" :rules='emailRules' label='Email' required)
            v-text-field(v-model="password" :rules='passwordRules' type='password' label='Password'
            required)
          .text-xs-center(style='margin:10px;display:flex;flex-direction:column')
            v-btn(round color='primary' @click="regUser()" dark) Sign Up
            p Or Using
          v-flex.text-xs-center
            a(href='#')
              v-avatar(size='32' style='margin:10px')
                i.fab.fa-google.fa-2x
            a(href="#")
              v-avatar(size='32' style='margin:10px')
                i.fab.fa-facebook.fa-2x

</template>
<script>
import { request } from 'graphql-request';

// import gql from 'graphql-tag';

export default {
  data: () => ({
    valid: false,
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid',
    ],
    password: '',
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

  },
};

</script>
