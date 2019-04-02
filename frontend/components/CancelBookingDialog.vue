<template lang="pug">
  v-dialog(persistent v-model="dialog" width="450")
    v-card
      v-card-title
        h1 Do you really want to cancel?
      v-card-actions
        v-spacer
        v-btn(color="error" dark @click="cancelBooking")
          v-icon.mr-2 cancel
          span Yes, Cancel Booking
        v-btn(dark @click="dialog=false") No, Go Back
</template>

<script>
import { GraphQLClient } from 'graphql-request'
import { EventBus } from '../layouts/event-bus'
import { cancelBooking } from '../queries/mutationQueries'

export default {
  data() {
    return {
      dialog: false,
      bookingCode: ''
    }
  },
  /* global NProgress */
  mounted() {
    EventBus.$on('show-cancel-booking-dialog', bookingCode => {
      this.dialog = true
      this.bookingCode = bookingCode
    })
  },
  methods: {
    cancelBooking() {
      NProgress.start()
      const client = new GraphQLClient('https://api.campzy.in', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })

      const variables = {
        bookingCode: this.bookingCode
      }

      client
        .request(cancelBooking, variables)
        .then(() => {
          EventBus.$emit(
            'show-info-notification-long',
            'Your booking was cancelled. Paid amount will be refunded in your account within the next 48 hours.'
          )
        })
        .catch(err => {
          EventBus.$emit(
            'show-error-notification-long',
            err.response.errors[0].message
          )
        })
        .finally(() => {
          this.dialog = false
          NProgress.done()
        })
    }
  }
}
</script>
