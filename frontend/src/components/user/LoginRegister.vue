<template lang="pug">
  v-container(text-xs-center).card-container
    v-layout(row)
      v-flex(xs12)
        v-card
          v-layout(row)
            v-flex(xs12 md6)
              transition(name="fade-transition" appear key="login" mode="out-in")
                .login-content(v-if="isLogin")
                  v-card-title(align-center justify-center).d-flex
                    h1.font-weight-light Login
                  v-form(ref="form" v-model="isLoginValid")
                  v-text-field(label="Email" v-validate="'required|email'" required
                    v-model="email" clearable data-vv-name="email"
                    :error-messages="errors.collect('email')")
                  v-text-field(label="Current Password" v-model="password" clearable
                  type="password" counter data-vv-name="currentPassword" v-validate="'min:8'"
                    :error-messages="errors.collect('currentPassword')")
                  v-flex(justify-space-between).d-flex.mt-3
                    v-btn(block color="green" @click="login").white--text.mr-1 Login
                    v-btn(block dark).white--text.ml-1 Forgot Password?
                  v-flex.d-flex(reverse align-center).mt-3
                    h4.font-weight-light Need an account?
                    v-btn(flat @click="isLogin = false")
                      h4 Sign up here!

                .signup-content(v-else key="signup")
                  v-card-title(align-center justify-center).d-flex
                    h1.font-weight-light Create an Account
                  v-form(ref="form" v-model="isLoginValid")
                  v-text-field(label="Email" v-validate="'required|email'" required
                    v-model="email" clearable data-vv-name="email"
                    :error-messages="errors.collect('email')")
                  v-text-field(label="Password" v-model="password" clearable
                  type="password" counter data-vv-name="currentPassword" v-validate="'min:8'"
                    :error-messages="errors.collect('currentPassword')")
                  v-btn(block color="green").white--text.mt-3 Create your account
                  v-flex.d-flex(reverse align-center).mt-3
                    h4.font-weight-light Already have an account?
                    v-btn(flat @click="isLogin = true")
                      h4 LOGIN

            v-flex(md6).hidden-sm-and-down.right-image

</template>

<script>
import { request } from 'graphql-request';
import navbar from '../Navbar.vue';

export default {
  components: {
    navbar,
  },
  data() {
    return {
      isLogin: true,
      isLoginValid: false,
      password: '',
      email: '',
    };
  },

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
      request('/graphql', registerUser, variables).then((data) => {
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
    login() {
      const sendUserCredientials = `query loginUsr($loginEmail: String!,$loginPassword: String!){
        loginUser(email: $loginEmail, password: $loginPassword){
          jwt
        }
      }`;
      const variables = {
        loginEmail: this.email,
        loginPassword: this.password,
      };
      request('/graphql', sendUserCredientials, variables).then((data) => {
        this.$cookie.set('sessionToken', JSON.parse(data.loginUser.jwt), 1, 'secure');
        this.$router.push('settings');
      }).catch((err) => {
        this.loggedIn = true;
        console.log(err);
      });
    },
  },
};

</script>

<style lang="scss" scoped>
.card-container {
  @media screen and (min-width: 961px) {
    padding: 2rem 2rem;
  }

  display: flex;
  align-items: center;

  .login-content {
    @media screen and (min-width: 960px) {
      padding: 7rem 4rem;
    }
    @media screen and (max-width: 960px) {
      padding: 1rem;
    }
  }

  .signup-content {
    @media screen and (min-width: 960px) {
      padding: 7rem 4rem;
    }
    @media screen and (max-width: 960px) {
      padding: 1rem;
    }
  }

  .right-image {
    background-image: url(https://images.pexels.com/photos/1004119/pexels-photo-1004119.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940);
    background-size: cover;
    border-radius: 0 2px 2px 0;
  }
}
</style>
