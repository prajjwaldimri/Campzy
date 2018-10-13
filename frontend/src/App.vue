<template lang="pug">
  v-app
    cookie-law(theme="dark-lime")
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
import CookieLaw from 'vue-cookie-law';
import { EventBus } from './event-bus';

export default {
  name: 'app',
  components: {
    CookieLaw,
  },
  data() {
    return {
      snackbarSuccess: false,
      snackbarFail: false,
      snackbarInfo: false,
      snackbarWarning: false,
      message: '',
      timeout: 0,
    };
  },
  created() {
    // N-Progress
    /* global NProgress */
    EventBus.$on('show-progress-bar', () => {
      NProgress.start();
    });
    EventBus.$on('hide-progress-bar', () => {
      NProgress.done();
    });


    EventBus.$on('show-success-notification-short', (message) => {
      this.timeout = 2000;
      this.message = message;
      this.snackbarSuccess = true;
    });

    EventBus.$on('show-success-notification-long', (message) => {
      this.timeout = 5000;
      this.message = message;
      this.snackbarSuccess = true;
    });

    EventBus.$on('show-error-notification-short', (message) => {
      this.timeout = 2000;
      this.message = message;
      this.snackbarFail = true;
    });

    EventBus.$on('show-error-notification-long', (message) => {
      this.timeout = 5000;
      this.message = message;
      this.snackbarFail = true;
    });

    EventBus.$on('show-info-notification-short', (message) => {
      this.timeout = 2000;
      this.message = message;
      this.snackbarInfo = true;
    });

    EventBus.$on('show-info-notification-long', (message) => {
      this.timeout = 5000;
      this.message = message;
      this.snackbarInfo = true;
    });
    EventBus.$on('show-warning-notification-short', (message) => {
      this.timeout = 2000;
      this.message = message;
      this.snackbarWarning = true;
    });

    EventBus.$on('show-warning-notification-long', (message) => {
      this.timeout = 5000;
      this.message = message;
      this.snackbarWarning = true;
    });
  },
};
</script>

<style lang="scss">
@import "./scss/main.scss";

body {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.Cookie__button {
  background-color: #4caf50 !important;
}

.Cookie--dark-lime {
  background-color: #212121 !important;
}
</style>
