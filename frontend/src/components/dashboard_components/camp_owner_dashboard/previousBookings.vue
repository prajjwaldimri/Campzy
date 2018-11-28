<template lang="pug">
  v-container.camps-container(grid-list-lg)
    h2.font-weight-bold.headline.text-uppercase Past Bookings
    v-container.camp-owner-conatiner.mt-1(fluid v-show='isTypeCampOwner')
      v-layout(row wrap)
        v-flex(xs12)
          v-container
            v-layout(column)
              v-card(v-for="booking in campBookings").py-4.px-2.my-2
                v-layout(row wrap)
                  v-flex(md2).pl-5
                    v-flex
                      h5.headline.font-weight-medium {{booking.user.name}}
                  v-divider(vertical).pr-5.hidden-sm-and-down

                  v-flex(md8).pl-5
                    v-layout(row wrap)
                      v-flex(md3)
                        h5.caption.grey--text OCCUPANCY
                        h3.mt-1.subheading {{booking.tentCount}} Tents

                      v-flex(md5 offset-md1)
                        h5.caption.grey--text CAPACITY
                        h3.mt-1.subheading {{booking.personCount}} Person / Tent

                      v-flex(md3)
                        h5.caption.grey--text AMOUNT
                        h3.mt-1.subheading {{ $n(booking.amount, 'currency', 'en-IN') }}

                      v-flex(md3)
                        h5.caption.grey--text TRIP DURATION
                        h3.mt-1.subheading {{booking.endDate | moment('from', booking.startDate, true)}}

                      v-flex(md5 offset-md1)
                        h5.caption.grey--text TRIP STARTED
                        h3.mt-1.subheading {{booking.startDate | moment('Do MMMM YYYY')}}

                      v-flex(md3)
                        h5.caption.grey--text TRIP ENDED
                        h3.mt-1.subheading {{booking.endDate | moment('Do MMMM YYYY')}}
    v-container.camp-owner-conatiner.mt-1(fluid v-show='isTypeAdmin')
      v-layout(row wrap)
        v-flex(xs12)
          v-container
            v-layout(column)
              v-card(v-for="booking in adminBookings").py-4.px-2.my-2
                v-layout(row wrap)
                  v-flex(md2).pl-5
                    v-flex
                      h5.headline.font-weight-medium {{booking.user.name}}
                  v-divider(vertical).pr-5.hidden-sm-and-down

                  v-flex(md8).pl-5
                    v-layout(row wrap)
                      v-flex(md3)
                        h5.caption.grey--text OCCUPANCY
                        h3.mt-1.subheading {{booking.tentCount}} Tents

                      v-flex(md5 offset-md1)
                        h5.caption.grey--text CAPACITY
                        h3.mt-1.subheading {{booking.personCount}} Person / Tent

                      v-flex(md3)
                        h5.caption.grey--text AMOUNT
                        h3.mt-1.subheading {{ $n(booking.amount, 'currency', 'en-IN') }}

                      v-flex(md3)
                        h5.caption.grey--text TRIP DURATION
                        h3.mt-1.subheading {{booking.endDate | moment('from', booking.startDate, true)}}

                      v-flex(md5 offset-md1)
                        h5.caption.grey--text TRIP STARTED
                        h3.mt-1.subheading {{booking.startDate | moment('Do MMMM YYYY')}}

                      v-flex(md3)
                        h5.caption.grey--text TRIP ENDED
                        h3.mt-1.subheading {{booking.endDate | moment('Do MMMM YYYY')}}


</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../../../event-bus';
import {
  campBookings, allBookings,
} from '../../../queries/queries';

export default {

  data() {
    return {
      isTypeCampOwner: false,
      isTypeAdmin: false,
      adminBookings: [],
      campBookings: [],

    };
  },

  mounted() {
    this.getCurrentUserType();
  },

  methods: {
    getCurrentUserType() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/login');
      }
      const userType = `{currentUser {
        type,
      }}`;
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(userType)
        .then((data) => {
          if (data.currentUser.type === 'CampOwner') {
            this.isTypeCampOwner = true;
            this.getCampId();
          }
          if (data.currentUser.type === 'Admin') {
            this.isTypeAdmin = true;
            this.getAdminPastBookings();
          }
        })
        .catch((err) => {
          EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
        });
    },

    // Get all active bookings
    getAdminPastBookings() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      EventBus.$emit('show-progress-bar');
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      const variables = {
        active: false,
        past: true,
      };

      client.request(allBookings, variables).then((data) => {
        this.adminBookings = data.allBookings;
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      }).finally(() => { EventBus.$emit('hide-progress-bar'); });
    },

    // Get CampId to get its bookings
    getCampId() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/login');
      }
      const getcampID = `query currentUserCamp{
        currentUserCamp {
        id,
        agreementAccepted,
      }}`;
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(getcampID)
        .then((data) => {
          if (data.currentUserCamp.agreementAccepted === false) {
            EventBus.$emit('agreement-not-accepted');
          }
          this.getCampOwnerPastBookings(data.currentUserCamp.id);
        })
        .catch((err) => {
          EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
        });
    },

    // Get CampOwner's active bookings
    getCampOwnerPastBookings(campID) {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      EventBus.$emit('show-progress-bar');
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      const variables = {
        id: campID,
        active: false,
        past: true,
      };
      client.request(campBookings, variables).then((data) => {
        this.campBookings = data.campBookings;
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      }).finally(() => { EventBus.$emit('hide-progress-bar'); });
    },


  },

};
</script>

<style lang="scss" scoped>
.camps-container {
  height: 100%;
  @media screen and (max-width: 959px) {
    padding: 2rem;
    padding-bottom: 15rem !important;
  }
}
.camp-owner-conatiner {
  margin: 0px;
  padding: 0px;
}
</style>
