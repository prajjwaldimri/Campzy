<template lang="pug">
  v-app
    v-snackbar(v-model='snackbarSuccess' top color='green') {{message}}
      v-btn(flat @click='snackbarSuccess = false') close
    v-snackbar(v-model='snackbarFail' top color='red') {{message}}
      v-btn(flat @click='snackbarFail = false') close
    v-snackbar(v-model='snackbarInfo' top color='blue') {{message}}
      v-btn(flat @click='snackbarInfo = false') close
    v-snackbar(v-model='snackbarWarning' top color='yellow') {{message}}
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
    };
  },
  created() {
    EventBus.$on('success', (message) => {
      this.message = message;
      this.snackbarSuccess = true;
    });

    EventBus.$on('error', (message) => {
      this.message = message;
      this.snackbarFail = true;
    });

    EventBus.$on('info', (message) => {
      this.message = message;
      this.snackbarInfo = true;
    });
    EventBus.$on('warning', (message) => {
      this.message = message;
      this.snackbarWarning = true;
    });
  },
};
</script>

<style lang="scss">
@import "./scss/main.scss";
</style>
