<template lang="pug">
  .blogs
    Navbar
    v-container
      h1.display-1 Campzy Talks
      h2.subheading.mt-2.grey--text.text--darken-2 Articles from your fellow Campzy members

      .blogs-grid.mt-4(v-if="blogs")
        v-card(v-for="(blog,index) in blogs" v-if="index % 5 === 0" raised :dark="blog.darkTheme" :img="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + blog.heroImage" :key="index").wide-card
          .card-container
            v-card-title(primary-title)
              h1.main-card-title(style="line-height: 1.5 !important") {{blog.title}}
            v-card-actions.justify-center
              v-spacer
              v-btn(light :href="'/blog/' + blog.url" dark)
                span Read the story
                v-icon chevron_right

        v-card(v-else raised :img="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + blog.heroImage" :dark="blog.darkTheme").tall-card
          .card-container
            v-card-title(primary-title)
              h1.main-card-title(style="line-height: 1.5 !important") {{blog.title}}
            v-card-actions.justify-center
              v-spacer
              v-btn(light :href="'/blog/' + blog.url" dark)
                span Read the story
                v-icon chevron_right

    Footer
</template>

<script>
import { request } from 'graphql-request'
import { getAllBlogs } from '../queries/queries'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { EventBus } from '../layouts/event-bus'

export default {
  metaInfo: {
    title: 'Talks - Campzy'
  },
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      blogs: []
    }
  },
  mounted() {
    this.getBlogs()
  },
  methods: {
    getBlogs() {
      const variables = {
        page: 0
      }
      request('https://api.campzy.in', getAllBlogs, variables)
        .then(data => {
          this.blogs = data.getAllBlogs
        })
        .catch(() => {
          EventBus.$emit(
            'show-info-notification-short',
            'Cannot get blogs at this time. Please try again.'
          )
        })
    }
  }
}
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
  grid-row-end: span 14;
}

.tall-card {
  grid-column-end: span 2;
  grid-row-end: span 16;
}

.card-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

.main-card-title {
  text-shadow: 0px 0px 20px grey;
}
</style>
