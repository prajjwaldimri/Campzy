<template lang="pug">
  v-app
    client-only
      cookie-law(theme="dark-lime" buttonText="ACCEPT COOKIES")
      div(slot="message")
        h3 This website uses cookies to ensure you get the best experience on our website. For more info
          router-link(to="privacyPolicy").ml-1.white--text click here


    v-snackbar(v-model='snackbarSuccess' top right color='green' :timeout='timeout') {{message}}
      v-btn(flat @click='snackbarSuccess = false') close
    v-snackbar(v-model='snackbarFail' top right color='red' :timeout='timeout') {{message}}
      v-btn(flat @click='snackbarFail = false') close
    v-snackbar(v-model='snackbarInfo' top right dark :timeout='timeout') {{message}}
      v-btn(flat @click='snackbarInfo = false') close
    v-snackbar(v-model='snackbarWarning' top right color='yellow' :timeout='timeout') {{message}}
      v-btn(flat @click='snackbarWarning = false') close
    transition(name="fade-transition" mode="out-in")
      router-view

</template>

<script>
import CookieLaw from 'vue-cookie-law'
import pkg from '../package'
import { EventBus } from './event-bus'

export default {
  name: 'App',
  components: {
    CookieLaw
  },
  metaInfo: {
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'theme-color',
        content: '#2ecc71'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },

      {
        rel: 'stylesheet',
        media: 'screen',
        href: 'https://fontlibrary.org/face/glacial-indifference',
        type: 'text/css'
      },

      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      },
      {
        rel: 'stylesheet',
        href: 'https://unpkg.com/nprogress@0.2.0/nprogress.css'
      }
    ],
    script: [
      // {
      //   src: 'https://www.googletagmanager.com/gtag/js?id=UA-154683504-1',
      //   async: true
      // },
      // {
      //   innerHTML: `window.dataLayer = window.dataLayer || [];
      //   function gtag(){dataLayer.push(arguments);}
      //   gtag('js', new Date());
      //   gtag('config', 'UA-154683504-1');`
      // },

      {
        src: 'https://unpkg.com/nprogress@0.2.0/nprogress.js'
      },
      {
        src: 'https://apis.google.com/js/api:client.js',
        defer: true
      }
    ]
  },
  data() {
    return {
      snackbarSuccess: false,
      snackbarFail: false,
      snackbarInfo: false,
      snackbarWarning: false,
      message: '',
      timeout: 0
    }
  },
  created() {
    // N-Progress
    /* global NProgress */
    EventBus.$on('show-progress-bar', () => {
      NProgress.configure({ showSpinner: false })
      NProgress.start()
    })
    EventBus.$on('hide-progress-bar', () => {
      NProgress.done()
    })

    EventBus.$on('show-success-notification-short', message => {
      this.timeout = 2000
      this.message = message
      this.snackbarSuccess = true
    })

    EventBus.$on('show-success-notification-long', message => {
      this.timeout = 5000
      this.message = message
      this.snackbarSuccess = true
    })

    EventBus.$on('show-error-notification-short', message => {
      this.timeout = 2000
      this.message = message
      this.snackbarFail = true
    })

    EventBus.$on('show-error-notification-long', message => {
      this.timeout = 5000
      this.message = message
      this.snackbarFail = true
    })

    EventBus.$on('show-info-notification-short', message => {
      this.timeout = 2000
      this.message = message
      this.snackbarInfo = true
    })

    EventBus.$on('show-info-notification-long', message => {
      this.timeout = 5000
      this.message = message
      this.snackbarInfo = true
    })
    EventBus.$on('show-warning-notification-short', message => {
      this.timeout = 2000
      this.message = message
      this.snackbarWarning = true
    })

    EventBus.$on('show-warning-notification-long', message => {
      this.timeout = 5000
      this.message = message
      this.snackbarWarning = true
    })

    // if (process.browser) {
    //   this.$gtag('config', 'UA-154683504-1', {
    //     page_title: this.$metaInfo.title,
    //     page_path: this.$route.fullPath
    //   })
    // }
  }
}
</script>

<style lang="scss">
@import 'static/scss/main.scss';

body {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.Cookie__button {
  background-color: #4caf50 !important;
}

.Cookie--dark-lime {
  background-color: #424242 !important;
}
</style>
