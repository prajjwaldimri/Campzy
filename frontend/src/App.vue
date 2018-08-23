<template lang="pug">
  v-app
    router-view
</template>

<script>
import { EventBus } from './event-bus';

export default {
  name: 'app',
  data() {
    return {
      message: 'Hello, Vue!',
    };
  },
  created() {
    EventBus.$on('signed-in', () => {
      console.log('signed in');
    });
  },
};
</script>

<style lang="scss">
@import "./scss/main.scss";
</style>
