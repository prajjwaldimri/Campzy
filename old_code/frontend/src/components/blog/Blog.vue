<template lang="pug">
 .blog-root
  navbar
  v-container(fluid)
    v-layout(row wrap style="min-height: 70vh").heading-layout
      v-flex(sm12 md6).heading-flex.pb-4
        h3.body-1.font-weight-bold.grey--text.text--darken-2 CAPMZY FEATURED STORY
        h1.display-3.font-weight-bold {{blog.title}}
        h3.title.mt-2(style="line-height: 2rem !important").grey--text.text--darken-2 {{blog.description}}

        .mt-4.justify-start(style="display: flex; align-items: center")
          v-avatar(size="48")
            img(:src="'https://ui-avatars.com/api/?name=' + blog.authorId.name")
          div.ml-3
            h2.subheading(v-if="blog.authorId") {{blog.authorId.name}}
            span.body-2 {{blog.createdAt | moment("MMMM Do YYYY")}},
            v-icon(small).ml-2.mr-1 access_time
            span.body-2 {{ [readTime, 'minutes'] | duration('humanize', false)}} read

      v-flex(sm12 md6).pb-4
        v-img(v-if="blog.heroImage" :src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + blog.heroImage" :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + blog.heroImage" height="100%" width="100%")
        span.body-1.grey--text {{blog.heroImageCaption}}

  v-container.blog-content-container
    v-layout
      v-flex
        p.blog-content.grey--text.text--darken-4(v-html="blog.content" ref="blogContent")


</template>

<script>
import { request } from 'graphql-request';
import { setTimeout } from 'timers';
import navbar from '../Navbar.vue';
import { getBlogQuery } from '../../queries/queries';

export default {
  components: {
    navbar,
  },
  metaInfo() {
    return {
      title: this.blog.title,
      titleTemplate: '%s - Campzy',
    };
  },
  data() {
    return {
      blog: {},
      readTime: {},
    };
  },
  mounted() {
    const variables = {
      url: this.$route.params.blogUrl,
    };
    request('/graphql', getBlogQuery, variables).then((data) => {
      this.blog = data.getBlog;
    }).catch(() => {
      this.blog = '';
    }).finally(() => {
      setTimeout(() => {
        // Have to give timeout to let vue have time to calculate the DOM properly.
        // Without timeout you will get null in the function below.
        this.calculateReadTime();
      }, 50);
    });
  },
  methods: {
    calculateReadTime() {
      const content = this.$refs.blogContent.textContent;
      const wordCount = content.split(' ').length;
      // Average Adult ReadTime: 150 WPM
      this.readTime = wordCount / 150;
      console.log(this.readTime);
    },
  },
};
</script>

<style lang="scss" scoped>
.heading-flex {
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (min-width: 961px) {
    padding: 2rem;
  }
}

.heading-layout {
  @media screen and (min-width: 961px) {
    padding: 2rem;
  }
}

.blog-content-container {
  @media screen and (min-width: 961px) {
    padding: 2rem;
  }
  .layout {
    @media screen and (min-width: 961px) {
      padding: 2rem;
    }
  }
  .flex {
    @media screen and (min-width: 961px) {
      padding: 2rem;
    }
  }
  .blog-content {
    line-height: 2;
    font-size: 1.3rem;
  }
}
</style>
