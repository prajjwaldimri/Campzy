<template lang="pug">
  v-card
    v-card-title
      span.headline Book Your Trip
    v-card-text
      v-text-field(v-model="name" label="Name" prepend-icon="subject" clearable
      data-vv-name="name" v-validate="'required|alpha_spaces'"
      :error-messages="errors.collect('name')")
      v-text-field(v-model="email" label="Email" prepend-icon="subject" clearable
      data-vv-name="email" v-validate="'required'"
      :error-messages="errors.collect('email')")
      v-select(v-model="tripDate" :items="tripDates" label="Select Trip Date" prepend-icon="today")
      v-select(v-model="packageType" :items="packageTypes" label="Select Your Package" prepend-icon="map")
      v-select(v-model="totalPerson" :items="totalPersons" label="Number of Person" prepend-icon="supervised_user_circle")
      v-text-field(v-model="amount" label="Total Amount" prepend-icon="money" hint="*GST Included" persistent-hint readonly)
      v-text-field(v-model="payableAmount" label="Payable Amount" prepend-icon="money"  hint="*30% of Total Amount" persistent-hint readonly)
      div(style="margin-left:33px;")
        span(style="text-align: justify;color:gray;") * You have to pay only 30% of total amount online, remaining amount will be paid before starting the trip.
      v-layout(column).mt-3.phone-number
        v-flex(xs12)
          span Phone Number
        v-flex(xs12)
          client-only
            vue-tel-input(v-model="phoneNumber" :preferredCountries="['in', 'us', 'en']" :enabledCountryCode="true" mode="international" required)  

    v-card-actions
      v-spacer
      v-btn(color="grey darken-1" flat @click.native="closeDialog")
        | Cancel
      v-btn(color="green" @click="bookTrip" :loading="isBookingTrip").white--text Book Trip

</template>

<script>
/* global Razorpay */
import { GraphQLClient } from 'graphql-request'
import { EventBus } from '../layouts/event-bus'

export default {
  name: 'BookTrip',
  $_veeValidate: {
    validator: 'new'
  },
  metaInfo() {
    return {
      script: [{ src: 'https://checkout.razorpay.com/v1/checkout.js' }]
    }
  },
  data() {
    return {
      name: '',
      phoneNumber: '',
      totalPersons: [1, 2, 3, 4, 5],
      totalPerson: '',
      packageTypes: ['Double Sharing', 'Triple Sharing', 'Quad Sharing'],
      packageType: '',
      tripDates: [
        '21 Nov, 2019',
        '28 Nov, 2019',
        '05 Dec, 2019',
        '12 Dec, 2019',
        '19 Dec, 2019',
        '26 Dec, 2019',
        '09 Jan, 2020',
        '16 Jan, 2020',
        '23 Jan, 2020',
        '30 Jan, 2020',
        '06 Feb, 2020',
        '13 Feb, 2020',
        '20 Feb, 2020',
        '27 Feb, 2020'
      ],
      tripDate: '',
      amount: 0,
      payableAmount: 0,
      amountPerPerson: 0,
      isBookingTrip: false,
      email: ''
    }
  },
  watch: {
    packageType(val) {
      switch (val) {
        case 'Double Sharing':
          this.amountPerPerson = 7500
          break
        case 'Triple Sharing':
          this.amountPerPerson = 7000
          break
        case 'Quad Sharing':
          this.amountPerPerson = 6500
          break
        default:
          this.amountPerPerson = 0
      }
    },
    totalPerson(val) {
      this.amount = val * this.amountPerPerson
      // Only 30% of the total amount to be paid
      this.payableAmount = (this.amount * 30) / 100
    }
  },
  methods: {
    closeDialog() {
      EventBus.$emit('close-book-trip-dialog')
    },

    bookTrip() {
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          const that = this
          this.isBookingTrip = true
          // Implement razorpay API
          const razorOptions = {
            key: 'rzp_live_8WKqvYktwfxYIe',
            amount: this.payableAmount * 100, // Razorpay counts money in paise
            name: 'Campzy',
            description: 'Campzy Trips',
            handler(response) {
              // Use data.bookCampCheck.amount to get the amount from user
              const bookYourTrip = `mutation bookTrip($transactionId: String!,$name: String!, $phoneNumber: String!, $tripDate: String!,$packageType: String!, $totalPerson: String!, $payableAmount: Int!){
                bookTrip(transactionId: $transactionId, name: $name, phoneNumber: $phoneNumber, tripDate:$tripDate, packageType: $packageType, totalPerson:$totalPerson,payableAmount: $payableAmount){
                  id
                }
              }`
              const variables = {
                transactionId: response.razorpay_payment_id,
                name: that.name,
                phoneNumber: that.phoneNumber,
                tripDate: that.tripDate,
                packageType: that.packageType,
                totalPerson: that.totalPerson.toString(),
                payableAmount: this.payableAmount
              }
              const client = new GraphQLClient('https://api.campzy.in/graphql')
              client
                .request(bookYourTrip, variables)
                .then(() => {
                  EventBus.$emit(
                    'show-success-notification-short',
                    'Successfully booked! Please check sms send to your phone number'
                  )
                  this.isBookingTrip = false
                  EventBus.$emit('close-book-trip-dialog')
                })
                .catch(err => {
                  EventBus.$emit(
                    'show-error-notification-short',
                    err.response.errors[0].message
                  )
                })
                .finally(() => {
                  this.isBookingTrip = false
                  EventBus.$emit('close-book-trip-dialog')
                })
            },
            prefill: {
              name: this.name,
              email: this.email,
              contact: this.phoneNumber
            }
          }
          const rzpl = new Razorpay(razorOptions)
          rzpl.open()
          this.bookButtonLoading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-input {
  border-style: none none solid none;
}
.phone-number {
  margin-left: 2rem;
}
</style>
