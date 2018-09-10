<template lang="pug">
  v-container(fluid)
    v-card.mt-4(v-for='(blog, index) in blogs')
      v-card-title.title(primary-title)
        h2.font-weight-bold.headline {{blog.title}}
      v-card-text
        v-flex(xs12)
          v-form(ref='form' lazy-validation)
            v-layout(row wrap)
              v-layout(column)
                v-flex(xs12)
                  v-text-field( label='Blog Description' v-model='blog.description'
                  data-vv-name="blogTitle" v-validate="'min:4|required'"
                  :error-messages="errors.collect('blogTitle')" readonly)
                v-spacer
                v-flex(xs12).mt-1
                  v-textarea(label='Content' v-model='blog.content'
                  data-vv-name="blogContent" v-validate="'min:4|required'"
                  :error-messages="errors.collect('blogContent')" outline readonly)
              v-flex.ml-2(xs4)
                v-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + blog.heroImage"
                aspect-ratio="1.4" contain)
      v-card-actions
        v-spacer
        v-btn(color='red' dark) Delete
        v-btn(color='green' dark @click="$router.push('/dashboard/editBlog/' + blog.id)") Edit

</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../../../event-bus';
import { getCurrentUserBlogsQuery } from '../../../queries/queries';

export default {
  name: 'addBlog',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      blogs: {},
    };
  },
  mounted() {
    this.getAllBlogs();
  },

  methods: {
    getAllBlogs() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      client.request(getCurrentUserBlogsQuery).then((data) => {
        this.blogs = data.currentUserBlogs.blogs;
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      });
    },
  },
};
</script>
