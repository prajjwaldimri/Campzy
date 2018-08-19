<template lang="pug">
  v-app
    navbar#navbar
    router-view(style='margin-top:5rem')
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'app',
  components: { navbar: Navbar },
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
