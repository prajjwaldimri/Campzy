<template lang="pug">
  v-dialog(persistent v-model="isDialogVisible" width="500")
    v-card
      v-card-title.display-1.green.white--text Your Experience Matters to Campzy!
      v-card-text
        span.subheading What will you rate your experience at {{camp.name}}?

        v-text-field(label="Comment" v-model="ratingComment")

      v-card-actions
        v-rating(v-model="rating" color="success" half-increments)
        v-spacer
        v-btn(color="success" @click="submitRating") Submit


</template>

<script>
import { GraphQLClient } from 'graphql-request'
import { getLatestCampForReview } from '../queries/queries'
import { addReview } from '../queries/mutationQueries'
import { EventBus } from '../layouts/event-bus'

export default {
  data() {
    return {
      isDialogVisible: false,
      camp: {},
      rating: 5,
      ratingComment: ''
    }
  },
  mounted() {
    this.getCampForReview()
  },
  methods: {
    getCampForReview() {
      if (!this.$cookie.get('sessionToken')) {
        return
      }
      const client = new GraphQLClient('https://api.campzy.in', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })

      client
        .request(getLatestCampForReview)
        .then(data => {
          if (data.getLatestCampForReview) {
            this.camp = data.getLatestCampForReview
            this.isDialogVisible = true
          }
        })
        .catch(err => {
          EventBus.$emit(
            'show-error-notification-long',
            err.response.errors[0].message
          )
        })
    },
    submitRating() {
      if (!this.$cookie.get('sessionToken')) {
        return
      }
      const client = new GraphQLClient('https://api.campzy.in', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })

      const variables = {
        stars: this.rating,
        comment: this.ratingComment,
        campId: this.camp.id
      }

      client
        .request(addReview, variables)
        .then(() => {
          EventBus.$emit('show-success-notification-short', 'Review Sent!')
        })
        .catch(err => {
          EventBus.$emit(
            'show-error-notification-long',
            err.response.errors[0].message
          )
        })
        .finally(() => {
          this.isDialogVisible = false
        })
    }
  }
}
</script>
