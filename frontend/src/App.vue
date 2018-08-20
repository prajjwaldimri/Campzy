<template lang="pug">
  v-app(dark)
    navbar
    router-view
</template>

<script>
import navbar from './components/Navbar.vue';

export default {
  name: 'app',
  components: {
    navbar,
  },
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
