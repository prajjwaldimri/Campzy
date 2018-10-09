<template lang="pug">
  .blogs
    Navbar
    v-container
      h1.display-1 Campzy Talks
      h2.subheading.mt-2.grey--text.text--darken-2 Articles from your fellow Campzy members

      .blogs-grid.mt-4
        v-card(v-for="(blog,index) in blogs" v-if="index % 5 === 0" raised dark img="https://images.pexels.com/photos/1289363/pexels-photo-1289363.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260").wide-card
          .card-container
            v-card-title(primary-title)
              h1 Title
            v-card-actions
              v-btn(light) Read the story

        v-card(v-else raised dark img="https://images.pexels.com/photos/1464616/pexels-photo-1464616.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260").tall-card
          .card-container
            v-card-title(primary-title)
              h1 Title
            v-card-actions
              v-btn(light) Read the story

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
  grid-row-end: span 10;
}

.tall-card {
  grid-column-end: span 2;
  grid-row-end: span 12;
}

.card-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 1rem 1rem 1rem;
  justify-content: space-between;
}
</style>
