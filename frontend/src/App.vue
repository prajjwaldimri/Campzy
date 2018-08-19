<template lang="pug">
  v-app
    router-view(style='margin-top:5rem')
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
