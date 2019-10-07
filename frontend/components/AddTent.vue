<template lang="pug">
  v-card
    v-card-title
      span.headline Add Tent
    v-card-text
      v-text-field(v-model="tent.type" label="Tent Type" prepend-icon="subject" clearable
      data-vv-name="tentType" v-validate="'min:4|required|alpha_spaces'"
      :error-messages="errors.collect('tentType')")

      v-text-field(v-model="totalTents" label="Toal Tents Available"
      prepend-icon="add_shopping_cart"
      clearable  data-vv-name="totalTents" v-validate="'required'"
      :error-messages="errors.collect('totalTents')")

      v-text-field(v-model="tent.capacity" label="Capacity Per Tent"
      prepend-icon="supervisor_account" clearable  data-vv-name="tentCapacity"
      v-validate="'required'" :error-messages="errors.collect('tentCapacity')")
      v-layout(row)
        v-flex(xs12 md5)
          v-text-field(v-model="bookingPrice" label="Booking Price" prepend-icon="money" clearable
          data-vv-name="bookingPrice" v-validate="'required'" hint='*Including all Taxes' persistent-hint
          :error-messages="errors.collect('bookingPrice')")
        v-spacer
        v-flex(xs12 md6)
          v-text-field(v-model="calculatedPrice" label="Final Price" prepend-icon="account_balance_wallet"
          data-vv-name="finalPrice" v-validate="'required'"
          :error-messages="errors.collect('finalPrice')" readonly)

      v-text-field(v-model="tent.surgePrice" label="Surge Price" prepend-icon="money" clearable
       data-vv-name="surgePrice"
      :error-messages="errors.collect('surgePrice')")

      v-text-field(v-model="tent.preBooking" label="Pre Booking Time" prepend-icon="payment"
      clearable  data-vv-name="preBooking" v-validate="'required'" type="number"
      :error-messages="errors.collect('preBooking')")


    v-card-actions
      v-spacer
      v-btn(color="grey darken-1" flat @click.native="closeDialog")
        | Cancel
      v-btn(color="green" @click.native="saveTent"  :loading='addingTent').white--text Save

</template>

<script>
import { GraphQLClient } from 'graphql-request'
import { EventBus } from '../layouts/event-bus'
import { addTentQuery } from '../queries/mutationQueries'

export default {
  name: 'AddTent',
  $_veeValidate: {
    validator: 'new'
  },
  data() {
    return {
      tent: {},
      totalTents: '',
      calculatedPrice: '',
      bookingPrice: '',
      addingTent: false
    }
  },
  watch: {
    bookingPrice(tentPrice) {
      const price = parseInt(tentPrice, 10)
      const commisionPrice = Math.round((price * 12) / 100)
      this.calculatedPrice =
        price - commisionPrice - Math.round((commisionPrice * 18) / 100)
    }
  },
  methods: {
    closeDialog() {
      EventBus.$emit('campowner-close-add-tent-dialog')
    },
    saveTent() {
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          if (!this.$cookie.get('sessionToken')) {
            this.$router.push('/')
          }
          if (!this.tent || !isValid) {
            return
          }
          this.addingTent = true
          const variables = {
            tentType: this.tent.type,
            capacity: this.tent.capacity,
            bookingPrice: parseInt(this.bookingPrice, 10),
            preBookTime: this.tent.preBooking,
            surgePrice: parseInt(this.tent.surgePrice, 10)
          }

          for (let i = 1; i <= this.totalTents; i += 1) {
            const client = new GraphQLClient('https://api.campzy.in/graphql', {
              headers: {
                Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
              }
            })

            client
              .request(addTentQuery, variables)
              .then(() => {
                this.tent = {}
                EventBus.$emit(
                  'show-success-notification-short',
                  'Successfully added!'
                )
              })
              .catch(err => {
                // eslint-disable-next-line
                console.log(err)
                EventBus.$emit(
                  'show-error-notification-short',
                  'Failed to add!'
                )
              })
              .finally(() => {
                this.addingTent = false
                this.closeDialog()
              })
          }
        }
      })
    }
  }
}
</script>
