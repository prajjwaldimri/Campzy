<template lang="pug">
  .reg-flex
    div
      h1
        span Welcome to Camp
        span.light-green--text.text--accent-4 zy
    v-card(color="transparent" width='30%' height='60%' style='margin-top:2rem;box-shadow:none')
      v-tabs(color="transparent" dark)
        v-tabs-slider(color='yellow' )
        v-tab.tab-size(href="#signin" ) Sign In
        v-tab.tab-size(href="#signup") Sign Up
        v-tab-item.tab-content(id='signin')
          v-card.text-xs-center(color="transparent" flat)
            form(v-model='valid' style='margin:10px')
              v-text-field(v-model="loginEmail" :rules='emailRules' label='Email' required)
              v-text-field(v-model="loginPassword" :rules='passwordRules' type='password' label='Password' required)
            v-btn.btn-size(round color='green accent-4' @click='logIn' dark) Sign In
            h3(style='margin:1rem')
              span O
              span.light-green--text.text--accent-4 r
            img(src='/vectors/google-plus.svg' style="width:40px;height:40px;margin-right:2rem")
            img(src='/vectors/facebook.svg' style='width:30px;height:30px;')
        v-tab-item.tab-content(id='signup')
          v-card.text-xs-center(color="transparent" flat)
            form(v-model='valid' style='margin:10px')
              v-text-field(v-model="email" :rules='emailRules' label='Email' required)
              v-text-field(v-model="password" :rules='passwordRules' type='password' label='Password'
              required)
              v-text-field(v-model="phone" :rules='phoneRules' label='Phone Number' required)
              v-btn.btn-size(round color='green accent-4' @click='regUser' dark) Sign Up
              h3(style='margin:1rem')
                span O
                span.light-green--text.text--accent-4 r
              img(src='/vectors/google-plus.svg' style="width:40px;height:40px;margin-right:2rem")
              img(src='/vectors/facebook.svg' style='width:30px;height:30px;')
    v-alert(:value='signed' color='success') Sign up Successful
    v-alert(:value='signedfail' color='error') Sign up Fail


</template>
<script>
import { request, GraphQLClient } from 'graphql-request';

export default {
  data: () => ({
    valid: false,
    signed: false,
    signedfail: false,
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


  }),

  methods: {
    regUser() {
      const token = this.$cookie.get('sessionToken');
      const client = new GraphQLClient('http://localhost:4444/graphql', {
        headers: {
          Authorization: `Bearer ${token} `,
        },
      });
      const getUsr = `{
        allUsers {
          id
        }
        }`;
      client.request(getUsr).then((data) => { console.log(data); }).catch(err => console.log(err));
      // const registerUser = `mutation register($email: String!, $password: String!, $phoneNumber: String!) {
      //     register(email: $email, password: $password, phoneNumber: $phoneNumber) {
      //       id
      //   }
      // }`;
      // const variables = {
      //   email: this.email,
      //   password: this.password,
      //   phoneNumber: this.phone,
      // };
      // request('http://localhost:4444/graphql', registerUser, variables).then(data => console.log(data)).catch((err) => {
      //   this.signedfail = true;
      //   console.log(err.response.errors);
      //   console.log(err.response.data);
      // });
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
        console.log(data.loginUser.jwt);
        console.log(JSON.parse(data.loginUser.jwt));
        this.$cookie.set('sessionToken', JSON.parse(data.loginUser.jwt), 1, 'secure');
      }).catch((err) => {
        console.log(err.response.errors);
        console.log(err.response.data);
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
    url("https://images.pexels.com/photos/93858/pexels-photo-93858.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940");
  background-size: cover;
}

.tab-size {
  width: 50%;
}

.btn-size {
  width: 30%;
  margin: 1rem;
}

.spacer-img {
  margin-left: 1rem;
}

.tab-content {
  margin-top: 3rem;
}
</style>
