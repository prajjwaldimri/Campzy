<template lang="pug">
  v-container(text-xs-center).card-container
    v-layout(row)
      v-flex(xs12)
        v-card
          v-layout(row)
            v-flex(xs12 md6)
              transition(name="fade-transition" appear key="login" mode="out-in")
                .login-content(v-if="loginState == 0")
                  v-card-title(align-center justify-center).d-flex
                    h1.font-weight-light Login
                  v-form(ref="form" v-model="isLoginValid")
                  v-text-field(label="Email" color='green accent-4'
                  v-validate="'required|email'" required
                    v-model="email" clearable data-vv-name="email"
                    :error-messages="errors.collect('email')")
                  v-text-field(label="Current Password" color='green accent-4'
                  v-model="password" clearable
                  type="password" counter data-vv-name="currentPassword" v-validate="'min:8'"
                    :error-messages="errors.collect('currentPassword')")
                  v-flex(justify-space-between).d-flex.mt-3
                    v-btn(block color="green" @click="login"
                    :loading='isLoggedin').white--text.mr-1 Login
                    v-btn(block dark).white--text.ml-1 Forgot Password?
                  v-flex.d-flex(reverse align-center).mt-3
                    h4.font-weight-light Need an account?
                    v-btn(flat @click="loginState = 1")
                      h4 Sign up here!

                .signup-content(v-else-if="loginState == 1" key="signup")
                  v-card-title(align-center justify-center).d-flex
                    h1.font-weight-light Create an Account
                  v-form(ref="form" v-model="isLoginValid")
                  v-text-field(label="Email" color='green accent-4'
                  v-validate="'required|email'" required
                    v-model="email" clearable data-vv-name="email"
                    :error-messages="errors.collect('email')")
                  v-text-field(label="Password" color='green accent-4' v-model="password" clearable
                  type="password" counter data-vv-name="currentPassword" v-validate="'min:8'"
                    :error-messages="errors.collect('currentPassword')")
                  v-btn(block color="green" :loading='isSignedup' @click="loginState = 2"
                  :disabled="email === '' || password === ''").white--text.mt-3
                    | Create your account
                  v-flex.d-flex(reverse align-center).mt-3
                    h4.font-weight-light Already have an account?
                    v-btn(flat @click="loginState = 0")
                      h4 LOGIN

                .phone-otp-content(v-else key="phone-otp")
                  v-card-title(align-center justify-center).d-flex
                    h1.font-weight-light Verify your Phone Number
                  v-form(ref="form" v-model="isLoginValid")
                  v-flex(align-center).d-flex
                    v-text-field(label="Phone Number" color='green accent-4'
                    v-validate="'required|numeric'" required
                      v-model="phoneNumber" clearable data-vv-name="phoneNumber"
                      :error-messages="errors.collect('phoneNumber')" type="number")
                    v-btn(@click="sendOTP" :disabled="phoneNumber.length < 10") Send OTP
                  v-flex(align-center).d-flex
                    v-text-field(shrink label="One Time Password" color='green accent-4'
                     v-model="otp" clearable
                    type="number" counter="6" data-vv-name="OTP" v-validate="'digits:6'"
                      :error-messages="errors.collect('OTP')" )
                    v-btn(color="green" :loading='isSignedup' @click="regUser"
                    :disabled="!isOTPSent").white--text.mt-3
                      | Complete Registration

            v-flex(md6).hidden-sm-and-down.right-image

</template>

<script>
import { request } from 'graphql-request';
import { throws } from 'assert';
import navbar from '../Navbar.vue';
import { EventBus } from '../../event-bus';
import { sendUserCredentials } from '../../queries/queries';
import { registerUser, sendOTP } from '../../queries/mutationQueries';

export default {
  components: {
    navbar,
  },
  data() {
    return {
      // 3 states. Change this variable to switch between login/register/opt verification
      loginState: 0,
      isLoginValid: false,
      password: '',
      email: '',
      phoneNumber: '',
      otp: '',
      isLoggedin: false,
      isSignedup: false,
      isOTPSent: false,
    };
  },

  methods: {
    regUser() {
      this.isSignedup = true;
      const variables = {
        email: this.email,
        password: this.password,
        phoneNumber: this.phoneNumber,
        otp: this.otp,
      };
      request('/graphql', registerUser, variables).then((data) => {
        if (data != null) {
          EventBus.$emit('success', 'Signup Successfull');
        }
        this.loginState = 0;
        this.isSignedup = false;
      }).catch((err) => {
        if (err) {
          EventBus.$emit('error', err);
        }
        this.isSignedup = false;
      });
    },
    login() {
      this.isLoggedin = true;
      const variables = {
        loginEmail: this.email,
        loginPassword: this.password,
      };
      request('/graphql', sendUserCredentials, variables).then((data) => {
        const jwt = JSON.parse(data.loginUser.jwt);
        this.$cookie.set('sessionToken', jwt, { secure: true });
        this.$router.push('settings');
        EventBus.$emit('success', 'Login Successfull');
        this.isLoggedin = false;
      }).catch((err) => {
        console.log(err);
        if (err) {
          EventBus.$emit('error', 'Login Failed');
          this.isLoggedin = false;
        }
      });
    },
    sendOTP() {
      const variables = {
        phoneNumber: this.phoneNumber,
      };
      request('/graphql', sendOTP, variables).then(() => {
        EventBus.$emit('info', 'OTP Sent!');
        this.isOTPSent = true;
      }).catch((err) => {
        if (err) {
          EventBus.$emit('error', 'Cannot send OTP');
        }
        this.isOTPSent = false;
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

  .phone-otp-content {
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
