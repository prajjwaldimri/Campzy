<template lang="pug">
  v-app
    v-snackbar(v-model='snackbarSuccess' top timeout='3000') {{message}}
      v-btn(color='green' flat @click='snackbarSuccess = false') close
    v-snackbar(v-model='snackbarFail' top timeout='3000') {{message}}
      v-btn(color='green' flat @click='snackbarFail = false') close
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
      message: '',
    };
  },
  created() {
    EventBus.$on('success', (message) => {
      this.message = message;
      this.snackbarSuccess = true;
    });

    EventBus.$on('fail', (message) => {
      this.message = message;
      this.snackbarFail = true;
    });
  },
};
</script>

<style lang="scss">
@import "./scss/main.scss";
</style>
