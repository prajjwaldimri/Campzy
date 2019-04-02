<template lang="pug">
  v-container(fluid)
    v-flex(xs12)
      v-card
        v-card-title.title(primary-title)
          h2.font-weight-bold.headline Edit Blog
        v-container(fluid)
          v-layout(column)
            v-flex(xs12)
              v-layout(row wrap)
                v-flex(xs12 md8)
                  v-text-field( label='Title' v-model='blog.title'
                  data-vv-name="blogTitle" v-validate="'min:4|required'"
                  :error-messages="errors.collect('blogTitle')"
                  hint='Add Title of Blog')
                v-spacer
                v-flex(xs12 md2 offset-md-1)
                  v-switch(v-model='blog.darkTheme' label='Dark Theme' color='green')
                v-flex(xs12)
                  v-layout(column)
                    span Choose Hero Image
                    input.mt-2(type='file' name='hero_image'
                      accept='image/png, image/jpeg' @change='storeHeroImage' disable)
            v-flex(xs12)
              v-layout(row wrap).mt-2
                v-flex(xs7)
                    v-text-field( label='Description' v-model='blog.description'
                    data-vv-name="blogDescription" v-validate="'min:4|required'"
                    :error-messages="errors.collect('blogDescription')"
                    hint='Add Description of Blog')
                v-spacer
                v-flex(xs4)
                  v-text-field( label='Image Caption' name='hero_image_caption'
                  v-model='blog.heroImageCaption' data-vv-name="imageCaption"
                  v-validate="'min:4|required'" hint='Add a caption to image'
                  :error-messages="errors.collect('imageCaption')")
            v-flex(xs12).mt-2
              v-textarea(label='Content' v-model='blog.content' height='55vh'
              data-vv-name="blogContent" v-validate="'min:4|required'"
              :error-messages="errors.collect('blogContent')" outline)
        v-card-actions
          v-spacer
          v-btn(flat) Clear
          v-btn(color='green' dark @click='saveHeroImage'
          :loading='isBlogAdded') save

</template>

<script>
import { GraphQLClient } from 'graphql-request'
import axios from 'axios'
import { EventBus } from '../../../layouts/event-bus'
import { updateBlogQuery } from '../../../queries/mutationQueries'
import { getBlogById } from '../../../queries/queries'

export default {
  name: 'AddBlog',
  $_veeValidate: {
    validator: 'new'
  },
  metaInfo: {
    title: 'Dashboard | Edit Blogs'
  },

  data() {
    return {
      heroImage: '',
      storeHeroImages: [],
      files: [],
      isBlogAdded: false,
      blog: {}
    }
  },
  mounted() {
    this.getUserBlog()
  },

  methods: {
    getUserBlog() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/')
      }
      const variables = {
        id: this.$route.params.id
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      client
        .request(getBlogById, variables)
        .then(data => {
          this.blog = data.getUpdateBlog
        })
        .catch(err => {
          EventBus.$emit(
            'show-error-notification-short',
            err.response.errors[0].message
          )
        })
    },
    storeHeroImage(event) {
      this.storeHeroImages = event.target.files
    },

    // Save heroImage to AWS
    saveHeroImage() {
      const updateImages = this.storeHeroImages
      if (updateImages.length === 0) {
        this.saveBlog()
      } else {
        this.deleteImageFromAWS()
        this.isBlogAdded = true
        for (let i = 0; i < updateImages.length; i += 1) {
          this.files.push(updateImages[i])
        }
        const formData = new FormData()
        for (let i = 0; i < this.files.length; i += 1) {
          const file = this.files[i]
          formData.append('images', file)
        }
        axios
          .post('/uploadImages', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(res => {
            const [image] = res.data
            this.blog.heroImage = image
            this.saveBlog()
          })
          .catch(() => {
            EventBus.$emit('show-error-notification-long', 'Failed to Uploaded')
          })
      }
    },

    // Delete old heroImage for AWS
    deleteImageFromAWS() {
      const blogImage = this.blog.heroImage
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
    },

    // Save Blog Details
    saveBlog() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/')
      }

      const variables = {
        id: this.$route.params.id,
        url: this.blog.url,
        title: this.blog.title,
        content: this.blog.content,
        description: this.blog.description,
        heroImage: this.blog.heroImage,
        heroImageCaption: this.blog.heroImageCaption,
        darkTheme: this.blog.darkTheme
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      client
        .request(updateBlogQuery, variables)
        .then(() => {
          EventBus.$emit(
            'show-success-notification-short',
            'Successfully Updated'
          )
          this.$router.push('/dashboard/allBlogs')
        })
        .catch(err => {
          EventBus.$emit(
            'show-error-notification-short',
            err.response.errors[0].message
          )
        })
        .finally(() => {
          this.isBlogAdded = false
        })
    }
  }
}
</script>
