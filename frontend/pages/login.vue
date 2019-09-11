<template lang="pug">
  .login_container
    navbar
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
                      h1.display-1.pb-4 Login
                    v-form(ref="form" v-model="isLoginValid")
                      v-text-field(label="Email" color='green accent-4'
                      v-validate="'required|email'" required
                        v-model="email" clearable data-vv-name="email"
                        :error-messages="errors.collect('email')")
                      v-text-field(label="Current Password" color='green accent-4'
                      v-model="password" clearable @keyup.enter="login"
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

                    v-layout(row wrap).mt-4
                      v-flex(sm12 lg6)
                        g-signin-button(:params="googleSignInParams" @success="onSignInSuccessGoogle" @error="onSignInError" data-longtitle="true" data-theme="dark").g-signin2 Login With Google
                      v-flex(sm12 lg6)
                        //- v-btn(color="#4267b2")
                        //-   fb-signin-button(:params="fbSignInParams" @success="onSignInSuccessFacebook" @error="onSignInError") Continue with Facebook
                        v-facebook-login(app-id="1400869453414688" version="v4.0" @login="onSignInSuccessFacebook")

                  .signup-content(v-else-if="loginState == 1" key="signup")
                    v-card-title(align-center justify-center).d-flex
                      h1.display-1.pb-4 Create an Account
                    v-form(ref="form" v-model="isLoginValid")
                    v-text-field(label="Name" color='green accent-4'
                    v-validate="'required|alpha_spaces'" required
                      v-model="name" clearable data-vv-name="name"
                      :error-messages="errors.collect('name')")
                    v-text-field(label="Email" color='green accent-4'
                    v-validate="'required|email'" required
                      v-model="email2" clearable data-vv-name="email2"
                      :error-messages="errors.collect('email2')")
                    v-text-field(label="Password" color='green accent-4' v-model="password" clearable
                    type="password" counter data-vv-name="currentPassword" v-validate="'min:8'"
                      :error-messages="errors.collect('currentPassword')")
                    v-btn(v-if="fields.email2" block color="green" :loading='isSignedup' @click="loginState = 2"
                    :disabled="email2 === '' || password === '' || isEmailAlreadyinUse || fields.email2.invalid || fields.currentPassword.invalid || fields.name.invalid").white--text.mt-3
                      | Create your account
                    v-flex.d-flex(reverse align-center).mt-3
                      h4.font-weight-light Already have an account?
                      v-btn(flat @click="loginState = 0")
                        h4 LOGIN

                  .phone-otp-content(v-else key="phone-otp")
                    v-card-title(align-center justify-center).d-flex
                      h1.display-1.pb-4 Verify your Phone Number
                    v-form(ref="form" v-model="isLoginValid")
                      v-flex(align-center).d-flex
                        v-layout(row)
                          v-flex(md6)
                            vue-tel-input(v-model="phoneNumber" :preferredCountries="['in', 'us', 'en']" required)
                          v-flex(md5 offset-md1)
                            v-btn(block @click="sendOTP" color="info" :disabled="phoneNumber.length < 10" :loading="!isSendOTPButtonEnabled") Send OTP
                      v-flex(align-center).d-flex
                        v-layout(row)
                          v-flex(md6)
                            v-text-field(label="One Time Password" color='green accent-4'
                            v-model="otp" clearable data-vv-name="OTP" v-validate="'digits:6'"
                              :error-messages="errors.collect('OTP')" @keyup.enter="regUser" )
                          v-flex(md5 offset-md1)
                            v-btn(block color="green" :loading='isSignedup' @click="regUser"
                            :disabled="!isOTPSent").white--text.mt-3
                              | Verify
    Footer(style="margin-top:5.1rem;")



</template>

<script>
/* global NProgress FB */
import { setTimeout } from 'timers'
import { request } from 'graphql-request'
import VFacebookLogin from 'vue-facebook-login-component'
import navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { EventBus } from '../layouts/event-bus'
import { sendUserCredentials, isEmailAvailable } from '../queries/queries'
import {
  registerUser,
  sendOTP,
  sendResetPasswordToken,
  googleAuth,
  facebookAuth
} from '../queries/mutationQueries'

export default {
  $_veeValidate: {
    validator: 'new'
  },
  metaInfo: {
    title: 'Login to Campzy',
    script: [{ src: 'https://apis.google.com/js/platform.js' }],
    meta: [
      {
        name: 'google-signin-client_id',
        content:
          '566978873203-tp4eadl6alv9s6pkk8nrvhg3n1grqlsc.apps.googleusercontent.com'
      }
    ]
  },
  components: {
    navbar,
    Footer,
    VFacebookLogin
  },
  data() {
    return {
      // 3 states. Change this variable to switch between login/register/opt verification
      loginState: 0,
      isLoginValid: false,
      password: '',
      name: '',
      email: '',
      email2: '',
      phoneNumber: '',
      otp: '',
      isLoggedin: false,
      isSignedup: false,
      isOTPSent: false,
      isEmailAlreadyinUse: false,
      isSendOTPButtonEnabled: true,
      googleSignInParams: {
        client_id:
          '566978873203-tp4eadl6alv9s6pkk8nrvhg3n1grqlsc.apps.googleusercontent.com'
      },
      fbSignInParams: {
        scope: 'public_profile,email',
        return_scopes: true
      },
      googleToken: '',
      facebookToken: ''
    }
  },
  watch: {
    email2(value) {
      if (this.loginState === 1 && value.length > 6) {
        const variables = {
          email: value
        }
        request('https://api.campzy.in/graphql', isEmailAvailable, variables)
          .then(() => {
            this.isEmailAlreadyinUse = false
          })
          .catch(err => {
            if (err) {
              EventBus.$emit(
                'show-error-notification-short',
                err.response.errors[0].message
              )
            }
            this.isEmailAlreadyinUse = true
          })
      }
    }
  },
  mounted() {
    if (this.$cookie.get('sessionToken')) {
      EventBus.$emit('success', 'Already logged in!')
      this.$router.go(-1)
    }
  },
  methods: {
    onSignInSuccessGoogle(googleUser) {
      const variables = {
        token: googleUser.getAuthResponse().id_token,
        email: googleUser.getBasicProfile().getEmail()
      }
      NProgress.start()
      request('https://api.campzy.in/graphql', googleAuth, variables)
        .then(data => {
          const jwt = JSON.parse(data.googleAuth.jwt)
          this.$cookie.set('sessionToken', jwt, { secure: true })
          this.$router.go(-1)
          EventBus.$emit('show-success-notification-short', 'Login Successful')
          this.isLoggedin = false
        })
        .catch(err => {
          if (err.response.errors[0].name === 'UserNotFoundError') {
            const profile = googleUser.getBasicProfile()
            this.email2 = profile.getEmail()
            this.name = profile.getName()
            this.googleToken = googleUser.getAuthResponse().id_token
            this.loginState = 1
          }
          EventBus.$emit(
            'show-info-notification-long',
            "Looks like this is your first time here. \n No worries! Let's get you setup"
          )
        })
        .finally(() => {
          NProgress.done()
        })
    },
    onSignInSuccessFacebook(response) {
      const variables = {
        token: response.authResponse.accessToken
      }
      NProgress.start()

      // eslint-disable-next-line
      console.log(variables)
      request('https://api.campzy.in/graphql', facebookAuth, variables)
        .then(data => {
          const jwt = JSON.parse(data.facebookAuth.jwt)
          this.$cookie.set('sessionToken', jwt, { secure: true })
          this.$router.go(-1)
          EventBus.$emit('show-success-notification-short', 'Login Successful')
          this.isLoggedin = false
        })
        .catch(err => {
          if (err.response.errors[0].name === 'UserNotFoundError') {
            FB.api('/me?fields=id,name,email', user => {
              this.email2 = user.email
              this.name = user.name
              this.facebookToken = response.authResponse.accessToken
              this.loginState = 1
            })
          }
          EventBus.$emit(
            'show-info-notification-long',
            "Looks like this is your first time here. \n No worries! Let's get you setup"
          )
        })
        .finally(() => {
          NProgress.done()
        })
    },
    onSignInError() {
      EventBus.$emit(
        'show-error-notification-short',
        'Cannot login you right now. Try another login method!'
      )
    },
    regUser() {
      this.isSignedup = true
      const variables = {
        email: this.email2,
        name: this.name,
        password: this.password,
        phoneNumber: this.phoneNumber.replace(/\s/g, ''),
        otp: this.otp,
        googleToken: this.googleToken,
        facebookToken: this.facebookToken
      }
      NProgress.start()
      request('https://api.campzy.in/graphql', registerUser, variables)
        .then(data => {
          const jwt = JSON.parse(data.register.jwt)
          this.$cookie.set('sessionToken', jwt, { secure: true })
          this.$router.push('/profile')
          EventBus.$emit('show-success-notification-short', 'SignUp Successful')
          this.isLoggedin = true
        })
        .catch(err => {
          if (err) {
            EventBus.$emit(
              'show-error-notification-short',
              err.response.errors[0].message
            )
          }
          this.isSignedup = false
        })
        .finally(() => {
          NProgress.done()
        })
    },
    login() {
      this.isLoggedin = true
      const variables = {
        loginEmail: this.email,
        loginPassword: this.password
      }
      NProgress.start()
      request('https://api.campzy.in/graphql', sendUserCredentials, variables)
        .then(data => {
          const jwt = JSON.parse(data.loginUser.jwt)
          this.$cookie.set('sessionToken', jwt, { secure: true })
          this.$router.go(-1)
          EventBus.$emit('show-success-notification-short', 'Login Successful')
          this.isLoggedin = false
        })
        .catch(err => {
          if (err) {
            EventBus.$emit(
              'show-error-notification-short',
              err.response.errors[0].message
            )
            this.isLoggedin = false
          }
        })
        .finally(() => {
          NProgress.done()
        })
    },
    sendOTP() {
      const variables = {
        phoneNumber: this.phoneNumber.replace(/\s/g, '')
      }
      setTimeout(() => {
        this.isSendOTPButtonEnabled = true
      }, 15000)
      NProgress.start()
      request('https://api.campzy.in/graphql', sendOTP, variables)
        .then(() => {
          EventBus.$emit('show-info-notification-short', 'OTP Sent!')
          this.isOTPSent = true
          this.isSendOTPButtonEnabled = false
        })
        .catch(err => {
          if (err) {
            EventBus.$emit(
              'show-error-notification-short',
              err.response.errors[0].message || 'Cannot send OTP'
            )
          }
          this.isOTPSent = false
          this.isSendOTPButtonEnabled = true
        })
        .finally(() => {
          NProgress.done()
        })
    },
    resetPassword() {
      if (this.email.trim() === '') {
        EventBus.$emit(
          'show-error-notification-short',
          'Enter your email in the Email Field first!'
        )
        return
      }
      const variables = {
        email: this.email
      }
      NProgress.start()
      request(
        'https://api.campzy.in/graphql',
        sendResetPasswordToken,
        variables
      )
        .then(() => {
          EventBus.$emit(
            'show-info-notification-short',
            'Check your email for further instructions!'
          )
        })
        .catch(err => {
          if (err) {
            EventBus.$emit(
              'show-error-notification-short',
              'Please check the entered email again.'
            )
          }
        })
        .finally(() => {
          NProgress.done()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  @media screen and (min-width: 961px) {
    padding: 2rem 2rem;
  }

  display: flex;

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

  .vue-tel-input {
    // Matching Vuetify's Style
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border: none;
    border-bottom: 1px solid #bbb;
  }

  .right-image {
    background-image: url(https://cdn.dribbble.com/users/1096806/screenshots/4704153/attachments/1061131/summer_camp.jpg);
    background-size: cover;
    border-radius: 0 2px 2px 0;
  }
}

.g-signin2 {
  // Properties copied from v-btn of Vuetify
  display: inline-flex;
  border-radius: 2px;
  height: 36px;
  margin: 6px 8px;
  text-transform: uppercase;
  font-weight: 500;
}

.fb-signin-button {
  /* This is where you control how the button looks. Be creative! */
  height: 100%;
  width: 100%;
  background-color: #4267b2;
  color: #fff;
}
</style>

<style lang="scss">
// Button inside Login With Google
.abcRioButton {
  width: auto !important;
}
</style>
