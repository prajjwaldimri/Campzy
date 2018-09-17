<template lang="pug">
  v-container
    v-layout(column)

      v-card(v-for="booking in bookings").py-5
        v-layout(row wrap)
          v-flex(md2).pl-5
            v-flex
              h5.headline.font-weight-medium {{booking.user.name}}
              router-link(:to="'/camp/' + booking.camp.url" style="text-decoration: none")
                h6.subheading.mt-1.green--text.text--darken-2.font-weight-bold {{booking.camp.name}}
          v-divider(vertical).pr-5

          v-flex(md6).pl-5
            v-layout(row wrap)
              v-flex(md3)
                h5.caption.grey--text OCCUPANCY
                h3.mt-1.subheading {{booking.tentCount}} Tents

              v-flex(md5 offset-md1)
                h5.caption.grey--text CAPACITY
                h3.mt-1.subheading {{booking.personCount}} Person / Tent

              v-flex(md3)
                h5.caption.grey--text LOCATION
                h3.mt-1.subheading {{booking.camp.location}}

              v-flex(md3).mt-4
                h5.caption.grey--text AMOUNT
                h3.mt-1.subheading {{ $n(booking.amount, 'currency', 'en-IN') }}

              v-flex(md5 offset-md1).mt-4
                h5.caption.grey--text BOOKED
                h3.mt-1.subheading {{booking.startDate | moment('Do MMMM YYYY')}}

              v-flex(md3).mt-4
                h5.caption.grey--text TRIP DURATION
                h3.mt-1.subheading {{booking.endDate | moment('from', booking.startDate, true)}}


          v-divider(vertical).pr-3
          v-flex(md3).pl-5
            .d-flex.justify-center.align-center(style="height: 100%")
              v-btn(color="error").white--text
                v-icon.mr-2 cancel
                span Cancel Booking


</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../../event-bus';
import { getUserActiveBookings } from '../../queries/queries';

export default {
  data() {
    return {
      bookings: [],
    };
  },
  mounted() {
    if (!this.$cookie.get('sessionToken')) {
      this.$router.push({ name: 'login' });
    } else {
      this.getActiveBookings();
    }
  },
  methods: {
    getActiveBookings() {
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(getUserActiveBookings)
        .then((data) => {
          this.bookings = data.getUserActiveBookings;
        })
        .catch((err) => {
          EventBus.$emit('show-error-notification-long', err.response.errors[0].message);
        });
    },
  },
};
</script>
