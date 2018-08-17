<template>
  <div>
    <test></test>
  </div>
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
