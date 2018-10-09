<template lang="pug">
  .blogs
    Navbar
    v-container
      h1.display-1 Campzy Talks
      h2.subheading.mt-2.grey--text.text--darken-2 Articles from your fellow Campzy members

      .blogs-grid.mt-4
        v-card(v-for="(blog,index) in blogs" v-if="index % 5 === 0" dark).wide-card
          v-card-title Wide
        v-card(v-else).tall-card
          v-card-title Tall

</template>

<script>
import Navbar from '../Navbar.vue';

export default {
  metaInfo: {
    title: 'Talks - Campzy',
  },
  components: {
    Navbar,
  },
  data() {
    return {
      blogs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    };
  },

};
</script>

<style lang="scss" scoped>
.blogs-grid {
  display: grid;
  grid-template-columns: repeat(8, 10%);
  grid-template-rows: repeat(4, 20%);
  grid-gap: 2rem;
}

.wide-card {
  grid-column-end: span 4;
  grid-row-end: span 8;
}

.tall-card {
  grid-column-end: span 2;
  grid-row-end: span 10;
}
</style>
