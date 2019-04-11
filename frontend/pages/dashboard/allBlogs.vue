<template lang="pug">
  v-container(fluid)
    v-card.mt-4(v-for='(blog, index) in blogs' :key="index")
      v-card-title.title(primary-title)
        v-layout(row wrap)
          v-flex(xs10)
            h2.font-weight-bold.headline {{blog.title}}
          v-flex(xs2)
            a(:href="'/blog/' + blog.url" target='_blank' style='color:black') View Blog
      v-card-text
        v-flex(xs12)
          v-form(ref='form' lazy-validation)
            v-layout(row wrap)
              v-layout(column)
                v-flex(xs12)
                  v-text-field( label='Blog Description' v-model='blog.description'
                  data-vv-name="blogTitle" v-validate="'min:4|required'"
                  :error-messages="errors.collect('blogTitle')" readonly flat)
                v-spacer
                v-flex(xs12).mt-1
                  v-textarea(label='Content' v-model='blog.content'
                  data-vv-name="blogContent" v-validate="'min:4|required'"
                  :error-messages="errors.collect('blogContent')"  readonly box)
              v-flex.ml-2(xs4)
                v-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + blog.heroImage"
                :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + blog.heroImage"
                aspect-ratio="1.4")
      v-card-actions
        v-spacer
        v-btn(color='red' dark @click='deleteBlog(blog.id,blog.heroImage)'
        :loading='isBlogDeleted') Delete
        v-btn(color='green' dark @click="$router.push('/dashboard/editBlog/' + blog.id)") Edit

</template>

<script>
import axios from 'axios'
import { GraphQLClient } from 'graphql-request'
import { EventBus } from '../../layouts/event-bus'
import { getCurrentUserBlogsQuery } from '../../queries/queries'
import { deleteUserBlog } from '../../queries/mutationQueries'

export default {
  name: 'AddBlog',
  $_veeValidate: {
    validator: 'new'
  },
  metaInfo: {
    title: 'Dashboard | All Blogs'
  },

  data() {
    return {
      blogs: {},
      isBlogDeleted: false
    }
  },
  mounted() {
    this.getAllBlogs()
  },

  methods: {
    getAllBlogs() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/')
      }
      const client = new GraphQLClient('https://api.campzy.in/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      client
        .request(getCurrentUserBlogsQuery)
        .then(data => {
          this.blogs = data.currentUserBlogs.blogs
        })
        .catch(err => {
          EventBus.$emit(
            'show-error-notification-short',
            err.response.errors[0].message
          )
        })
    },

    deleteBlog(blogId, blogImage) {
      this.isBlogDeleted = true
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/')
      }
      this.deleteAwsImage(blogImage)
      const client = new GraphQLClient('https://api.campzy.in/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      const variables = {
        id: blogId
      }
      client
        .request(deleteUserBlog, variables)
        .then(() => {
          this.getAllBlogs()
        })
        .catch(err => {
          EventBus.$emit(
            'show-error-notification-short',
            err.response.errors[0].message
          )
        })
        .finally(() => {
          this.isBlogDeleted = false
        })
    },

    deleteAwsImage(blogImage) {
      axios
        .delete('/deleteImages', { data: { blogImage } })
        .then(() => {
          EventBus.$emit(
            'show-success-notification-short',
            'Successfully Deleted'
          )
        })
        .catch(() => {
          EventBus.$emit('show-error-notification-short', 'Failed to delete')
        })
    }
  }
}
</script>
