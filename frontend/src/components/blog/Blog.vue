<template lang="pug">
 .blog-root
  navbar
  v-container
    v-layout(row)
      v-flex(sm6)

      v-flex(sm6)
        v-img(src="https://images.pexels.com/photos/891683/pexels-photo-891683.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")

</template>

<script>
import navbar from '../Navbar.vue';

export default {
  components: {
    navbar,
  },
  data() {
    return {};
  },
};
</script>
