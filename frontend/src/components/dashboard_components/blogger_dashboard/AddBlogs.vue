<template lang="pug">
  v-container(fluid)
    v-card
      v-card-title.title(primary-title)
        h2.font-weight-bold.headline Write Blog
      v-card-text
        v-flex(xs12)
          v-form(ref='form' lazy-validation)
            v-layout(row wrap)
              v-layout(row)
                v-flex(xs7)
                  v-text-field( label='Title' v-model='blogTitle'
                  data-vv-name="blogTitle" v-validate="'min:4|required'"
                  :error-messages="errors.collect('blogTitle')")
                v-spacer
                v-flex(xs4)
                  span Choose Hero Image
                  input.mt-2(type='file' name='hero_image' ref='panCard'
                    accept='image/png, image/jpeg' disabled )
              v-flex(xs12).mt-1
                v-textarea(label='Content' v-model='blogContent' height='55vh'
                data-vv-name="blogContent" v-validate="'min:4|required'"
                :error-messages="errors.collect('blogContent')" outline)
      v-card-actions
        v-spacer
        v-btn(flat) Clear
        v-btn(color='green' dark @click='saveBlog') save

</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../../../event-bus';
import { addBlogQuery } from '../../../queries/mutationQueries';

export default {
  name: 'addBlog',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      blogTitle: '',
      blogContent: '',
      blogUrl: '',
      heroImage: 'heroImage',
    };
  },

  methods: {
    saveBlog() {
      console.log(this.blogTitle);
      console.log(this.blogContent);
      this.blogUrl = `${Date.now()}+${this.blogTitle.split(' ').join('+')}`;

      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const variables = {
        title: this.blogTitle,
        content: this.blogContent,
        url: this.blogUrl,
        heroImage: this.heroImage,
      };
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      client.request(addBlogQuery, variables).then((data) => {
        console.log(data);
      }).catch((err) => {
        console.log(err);
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      });
    },
  },
};
</script>
