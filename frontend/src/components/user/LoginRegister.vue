<template lang="pug">
  v-container(text-xs-center).card-container
    v-layout(row)
      v-flex(xs12)
        v-card
          v-layout(row)
            v-flex(md6).hidden-sm-and-down.right-image
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
                    v-btn(block dark @click="resetPassword").white--text.ml-1 Forgot Password?
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
                      :error-messages="errors.collect('phoneNumber')" type="tel")
                    v-btn(@click="sendOTP" :disabled="phoneNumber.length < 10") Send OTP
                  v-flex(align-center).d-flex
                    v-text-field(shrink label="One Time Password" color='green accent-4'
                     v-model="otp" clearable
                    type="number" counter="6" data-vv-name="OTP" v-validate="'digits:6'"
                      :error-messages="errors.collect('OTP')" )
                    v-btn(color="green" :loading='isSignedup' @click="regUser"
                    :disabled="!isOTPSent" block).white--text.mt-3
                      | Complete Registration


</template>

<script>
import { request } from 'graphql-request';
import navbar from '../Navbar.vue';
import { EventBus } from '../../event-bus';
import { sendUserCredentials } from '../../queries/queries';
import { registerUser, sendOTP, sendResetPasswordToken } from '../../queries/mutationQueries';

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
  mounted() {
    if (this.$cookie.get('sessionToken')) {
      EventBus.$emit('success', 'Already logged in!');
      this.$router.replace({ name: 'profile' });
    }
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
        const jwt = JSON.parse(data.register.jwt);
        this.$cookie.set('sessionToken', jwt, { secure: true });
        this.$router.push('profile');
        EventBus.$emit('show-success-notification-short', 'SignUp Successful');
        this.isLoggedin = true;
      }).catch((err) => {
        if (err) {
          EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
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
        this.$router.push('profile');
        EventBus.$emit('show-success-notification-short', 'Login Successful');
        this.isLoggedin = false;
      }).catch((err) => {
        if (err) {
          EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
          this.isLoggedin = false;
        }
      });
    },
    sendOTP() {
      const variables = {
        phoneNumber: this.phoneNumber,
      };
      request('/graphql', sendOTP, variables).then(() => {
        EventBus.$emit('show-info-notification-short', 'OTP Sent!');
        this.isOTPSent = true;
      }).catch((err) => {
        if (err) {
          EventBus.$emit('show-error-notification-short', 'Cannot send OTP');
        }
        this.isOTPSent = false;
      });
    },
    resetPassword() {
      if (this.email.trim() === '') {
        EventBus.$emit('show-error-notification-short', 'Enter your email in the Email Field first!');
      }
      const variables = {
        email: this.email,
      };
      request('/graphql', sendResetPasswordToken, variables).then(() => {
        EventBus.$emit('show-info-notification-short', 'Check your email for further instructions!');
      }).catch((err) => {
        if (err) {
          EventBus.$emit('show-error-notification-short', 'Cannot send Verification');
        }
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
    background-image: url(https://cdn.dribbble.com/users/1096806/screenshots/4704153/attachments/1061131/summer_camp.jpg);
    background-size: cover;
    border-radius: 0 2px 2px 0;
  }
}
</style>
