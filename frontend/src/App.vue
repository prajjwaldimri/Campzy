<template lang="pug">
  v-app
    v-snackbar(v-model='snackbarSuccess' top color='green' :timeout='timeout') {{message}}
      v-btn(flat @click='snackbarSuccess = false') close
    v-snackbar(v-model='snackbarFail' top color='red' :timeout='timeout') {{message}}
      v-btn(flat @click='snackbarFail = false') close
    v-snackbar(v-model='snackbarInfo' top color='blue' :timeout='timeout') {{message}}
      v-btn(flat @click='snackbarInfo = false') close
    v-snackbar(v-model='snackbarWarning' top color='yellow' :timeout='timeout') {{message}}
      v-btn(flat @click='snackbarWarning = false') close
    router-view
</template>

<script>
import { EventBus } from './event-bus';

export default {
  name: 'app',
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
    EventBus.$on('show-success-notification-short', (message) => {
      this.message = message;
      this.snackbarSuccess = true;
      this.timeout = 3000;
    });

    EventBus.$on('show-success-notification-long', (message) => {
      this.message = message;
      this.snackbarSuccess = true;
      this.timeout = 5000;
    });

    EventBus.$on('show-error-notification-short', (message) => {
      this.message = message;
      this.snackbarFail = true;
      this.timeout = 3000;
    });

    EventBus.$on('show-error-notification-long', (message) => {
      this.message = message;
      this.snackbarFail = true;
      this.timeout = 5000;
    });

    EventBus.$on('show-info-notification-short', (message) => {
      this.message = message;
      this.snackbarInfo = true;
      this.timeout = 3000;
    });

    EventBus.$on('show-info-notification-long', (message) => {
      this.message = message;
      this.snackbarInfo = true;
      this.timeout = 5000;
    });
    EventBus.$on('show-warning-notification-short', (message) => {
      this.message = message;
      this.snackbarWarning = true;
      this.timeout = 3000;
    });

    EventBus.$on('show-warning-notification-long', (message) => {
      this.message = message;
      this.snackbarWarning = true;
      this.timeout = 5000;
    });
  },
};
</script>

<style lang="scss">
@import "./scss/main.scss";
</style>
