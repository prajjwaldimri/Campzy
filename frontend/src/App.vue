<template lang="pug">
  v-app(dark)
    router-view
</template>

<script>

export default {
  name: 'app',
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
