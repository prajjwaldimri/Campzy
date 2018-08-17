<template lang="pug">
  v-app
    router-view
</template>

<script>
import Test from './components/Test.vue';

export default {
  name: 'app',
  components: { test: Test },
  data() {
    return {
      message: 'Hello, Vue!',
    };
  },
};
</script>

<style lang="scss">
@import "./scss/main.scss";
</style>
