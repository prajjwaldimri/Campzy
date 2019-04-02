<template lang="pug">
  v-dialog(v-model="editTentDialog" persistent max-width="500px" v-if="editTentDialog")
    v-card
      v-card-title
        span.headline Update Tent
      v-card-text
        v-text-field(v-model="tent.type" label="Tent Type" prepend-icon="subject" clearable
        data-vv-name="tentType" v-validate="'min:4|required|alpha_spaces'"
        :error-messages="errors.collect('tentType')")

        v-combobox(v-model="disabledDates" label="Disabled Dates"
        prepend-icon="date_range" multiple chips small-chips
        clearable  data-vv-name="dates")

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
            data-vv-name="finalPrice"
             readonly)

        v-text-field(v-model="tent.surgePrice" label="Surge Price" prepend-icon="money" clearable
        data-vv-name="surgePrice"
        :error-messages="errors.collect('surgePrice')" disabled)

        v-text-field(v-model="tent.preBookPeriod" label="Pre Booking Time" prepend-icon="payment"
        clearable  data-vv-name="preBooking" v-validate="'required'" type="number"
        :error-messages="errors.collect('preBooking')")


      v-card-actions
        v-spacer
        v-btn(color="grey darken-1" flat @click.native="closeDialog")
          | Cancel
        v-btn(color="green" @click.native="updateTent"
        :loading='updating').white--text Save

</template>

<script>
import { GraphQLClient } from 'graphql-request'
import { EventBus } from '../layouts/event-bus'
import { getTentById } from '../queries/queries'
import {
  updateTentQuery,
  closeBookingByDates
} from '../queries/mutationQueries'

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
      editTentDialog: false,
      disabledDates: [],
      tentId: '',
      updating: false,
      bookingPrice: ''
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
  mounted() {
    EventBus.$on('campowner-open-edit-tent-dialog', tentId => {
      this.editTentDialog = true
      this.getTentDetails(tentId)
    })
  },
  methods: {
    getTentDetails(tentID) {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/')
      }
      const client = new GraphQLClient('https://api.campzy.in', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      const variables = {
        id: tentID
      }
      client
        .request(getTentById, variables)
        .then(data => {
          this.tent = data.tent
          this.disabledDates = this.tent.disabledDates
          this.bookingPrice = this.tent.bookingPrice
        })
        .catch(err => {
          EventBus.$emit(
            'show-error-notification-short',
            err.response.errors[0].message
          )
        })
    },

    updateTent() {
      this.updating = true
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          if (!this.$cookie.get('sessionToken')) {
            this.$router.push('/')
          }
          if (!this.tent || !isValid) {
            return
          }
          const variables = {
            id: this.tent.id,
            tentType: this.tent.type,
            capacity: this.tent.capacity,
            bookingPrice: parseInt(this.bookingPrice, 10),
            preBookTime: this.tent.preBookPeriod,
            surgePrice: parseInt(this.tent.surgePrice, 10)
          }

          const client = new GraphQLClient('https://api.campzy.in', {
            headers: {
              Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
            }
          })

          client
            .request(updateTentQuery, variables)
            .then(() => {
              this.closeBookingByDate()
            })
            .catch(err => {
              EventBus.$emit(
                'show-error-notification-short',
                err.response.errors[0].message
              )
            })
        }
      })
    },

    closeBookingByDate() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/')
      }
      const client = new GraphQLClient('https://api.campzy.in', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      const variables = {
        id: this.tent.id,
        disabledDates: this.disabledDates
      }
      client
        .request(closeBookingByDates, variables)
        .then(() => {
          this.tent = {}
          this.disabledDates = []
          EventBus.$emit(
            'show-success-notification-short',
            'Successfully Update'
          )
        })
        .catch(() => {
          this.tent = {}
          this.disabledDates = []

          EventBus.$emit('show-error-notification-short', 'Failed to Update')
        })
      this.closeDialog()
    },
    closeDialog() {
      this.tent = {}
      this.updating = false
      this.editTentDialog = false
      EventBus.$emit('close-edit-tent-dialog')
    }
  }
}
</script>
