<template lang="pug">
  .blogs
    Navbar
    v-container
      h1.display-1 Campzy Talks
      h2.subheading.mt-2.grey--text.text--darken-2 Articles from your fellow Campzy members

      .blogs-grid.mt-4(v-if="blogs")
        v-card(v-for="(blog,index) in blogs" v-if="index % 5 === 0" raised dark :img="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + blog.heroImage").wide-card
          .card-container
            v-card-title(primary-title)
              h1.main-title {{blog.title}}
            v-card-actions
              v-btn(light) Read the story

        v-card(v-else raised dark :img="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + blog.heroImage").tall-card
          .card-container
            v-card-title(primary-title)
              h1.main-title {{blog.title}}
            v-card-actions
              v-btn(light) Read the story

</template>

<script>
import { request } from 'graphql-request';
import { getAllBlogs } from '../../queries/queries';
import Navbar from '../Navbar.vue';
import { EventBus } from '../../event-bus';

export default {
  metaInfo: {
    title: 'Talks - Campzy',
  },
  components: {
    Navbar,
  },
  data() {
    return {
      blogs: [],
    };
  },
  mounted() {
    this.getBlogs();
  },
  methods: {
    getBlogs() {
      const variables = {
        page: 0,
      };
      request('/graphql', getAllBlogs, variables).then((data) => {
        this.blogs = data.getAllBlogs;
      }).catch(() => {
        EventBus.$emit('show-info-notification-short', 'Cannot get blogs at this time. Please try again.');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.blogs-grid {
  display: grid;
  @media screen and (max-width: 960px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  grid-template-columns: repeat(8, 10%);
  grid-template-rows: repeat(4, 20%);
  grid-gap: 2rem;
}

.wide-card {
  @media screen and (max-width: 960px) {
    grid-column-end: span 2;
    grid-row-end: span 12;
  }
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

.main-title {
  mix-blend-mode: difference;
}
</style>
