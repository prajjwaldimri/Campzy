<template lang="pug">
  v-container
    v-layout(column)

      v-card(v-for="booking in bookings").py-5
        v-layout(row wrap)
          v-flex(md2 sm12).pl-5
            v-flex
              h5.headline.font-weight-medium {{booking.user.name}}
              router-link(:to="'/camp/' + booking.camp.url" style="text-decoration: none")
                h6.subheading.mt-1.green--text.text--darken-2.font-weight-bold {{booking.camp.name}}
              h6.subheading.mt-3 Booking Id: {{booking.code}}
          v-divider(vertical).pr-5.hidden-sm-and-down

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
                h5.caption.grey--text TRIP STARTS
                h3.mt-1.subheading {{booking.startDate | moment('Do MMMM YYYY')}}

              v-flex(md3).mt-4
                h5.caption.grey--text TRIP DURATION
                h3.mt-1.subheading {{booking.endDate | moment('from', booking.startDate, true)}}


          v-divider(vertical).mr-3.hidden-sm-and-down
          v-flex(md3 sm12)
            .d-flex.justify-center(style="height: 100%; flex-direction: column")
              v-btn(color="primary" @click="showChat(booking.code)").white--text
                v-icon.mr-2 live_help
                span Need Help?
              v-btn(color="error").white--text
                v-icon.mr-2 cancel
                span Cancel Booking


</template>

<script>
/* global LC_API */
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../../event-bus';
import { getUserActiveBookings } from '../../queries/queries';

export default {
  metaInfo: {
    title: 'Active Bookings - Campzy',
  },
  data() {
    return {
      bookings: [],
      phoneNumber: '',
    };
  },
  mounted() {
    if (!this.$cookie.get('sessionToken')) {
      this.$router.push({ name: 'login' });
    } else {
      this.getActiveBookings();
    }
    this.getUser();
  },
  methods: {
    getActiveBookings() {
      /* global NProgress */
      NProgress.start();
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
        })
        .finally(() => {
          NProgress.done();
        });
    },
    getUser() {
      const query = `{currentUser {
            name,
            email,
            phoneNumber,
          }}`;
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(query)
        .then((data) => {
          // eslint-disable-next-line
          window.__lc.visitor = {
            name: data.currentUser.name,
            email: data.currentUser.email,
          };

          this.phoneNumber = data.currentUser.phoneNumber;
        })
        .catch((err) => {
          EventBus.$emit('show-error-notification-long', err.response.errors[0].message);
        });
    },
    showChat(bookingCode) {
      // eslint-disable-next-line
      window.__lc.params = [
        { name: 'Phone', value: this.phoneNumber },
        { name: 'Booking Code', value: bookingCode },
      ];
      LC_API.open_chat_window();
    },
  },
};
</script>
