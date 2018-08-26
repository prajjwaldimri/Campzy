<template lang="pug">

</template>

<script>
export default {
  data() {
    return {
      newPassword: '',
    };
  },
  mounted() {
    console.log(this.$route.params.token);
  },
};
</script>
