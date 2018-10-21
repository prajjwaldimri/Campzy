<template lang="pug">
  v-container.camps-container(grid-list-lg)
    h2.font-weight-bold.headline.text-uppercase Statistics
    v-container.camp-owner-conatiner.mt-1(fluid v-show='isTypeCampOwner')
      v-layout(row wrap)
        v-flex(xs12 md4)
          v-card
            v-container(fluid style='padding:1rem')
              v-flex(xs12 md12 style='padding:0rem')
                apexcharts(width='300' type='bar' :options='chartOptions' :series='series')
        v-flex(xs12 md4)
          v-card
            v-container(fluid style='padding:1rem')
              v-flex(xs12 md12 style='padding:0rem')
                apexcharts(width='300' type='bar' :options='chartOptions' :series='series')
        v-flex(xs12 md4)
          v-card
            v-card-title.justify-center
              h3.font-weight-black.text-uppercase Current Rating
            v-container(fluid)
              v-layout(row wrap)
                v-flex(xs12 md6)
                  v-layout(column).align-center
                    h3.font-weight-normal.text-uppercase Rank
                    span.title.grey--text.text--darken-1.mt-4
                      ICountUp(:startVal="0" :endVal="1" :duration="2")
                v-flex(xs12 md6)
                  v-layout(column).align-center
                    h3.font-weight-normal.text-uppercase Camp Rating
                    v-rating.mt-3(v-model="campRating" small
                    color="green darken-3" background-color="grey darken-1"
                    empty-icon="$vuetify.icons.ratingFull"
                    half-increments
                    hover readonly)
      v-layout(row wrap)
        v-flex(xs12)
          v-container
            v-layout(column)
              h3.font-weight-black.text-uppercase Active bookings
              v-card(v-for="booking in campBookings").py-4.px-2.my-2
                v-layout(row wrap)
                  v-flex(md2).pl-5
                    v-flex
                      h5.headline.font-weight-medium {{booking.user.name}}
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
                        h5.caption.grey--text AMOUNT
                        h3.mt-1.subheading {{ $n(booking.amount, 'currency', 'en-IN') }}

                      v-flex(md3)
                        h5.caption.grey--text TRIP DURATION
                        h3.mt-1.subheading {{booking.endDate | moment('from', booking.startDate, true)}}

                      v-flex(md5 offset-md1)
                        h5.caption.grey--text TRIP STARTS
                        h3.mt-1.subheading {{booking.startDate | moment('Do MMMM YYYY')}}


                  v-divider(vertical).mr-3.hidden-sm-and-down
                  v-flex(md3 xs12)
                    .d-flex.justify-center.align-center(style="height: 100%")
                      v-btn(color="success").white--text
                        span Check In


    //- Show if user is Admin
    v-container.camp-owner-conatiner.mt-1(fluid v-show='isTypeAdmin')
      v-layout(row wrap)
        v-flex(xs12 md4)
          v-card
            v-container(fluid style='padding:1rem')
              v-flex(xs12 md12 style='padding:0rem')
                apexcharts(width='300' type='bar' :options='chartOptions' :series='series')
        v-flex(xs12 md4)
          v-card
            v-container(fluid style='padding:1rem')
              v-flex(xs12 md12 style='padding:0rem')
                apexcharts(width='300' type='bar' :options='chartOptions' :series='series')
        v-flex(xs12 md4)
          v-card
            v-container(fluid style='padding:1rem')
              v-flex(xs12 md12 style='padding:0rem')
                apexcharts(width='300' type='bar' :options='chartOptions' :series='series')
      v-layout(row wrap)
        v-flex(xs12)
          v-container
            v-layout(column)
              h3.font-weight-black.text-uppercase Active bookings
              v-card(v-for="booking in adminBookings").py-5
                v-layout(row wrap)
                  v-flex(md2).pl-5
                    v-flex
                      h5.headline.font-weight-medium {{booking.user.name}}
                      router-link(:to="'/camp/' + booking.camp.url" style="text-decoration: none")
                        h6.subheading.mt-1.green--text.text--darken-2.font-weight-bold {{booking.camp.name}}
                        h6.subheading.mt-3 Booking Id: {{booking.code}}

                  v-divider(vertical).px-5.hidden-sm-and-down

                  v-flex(md8).pl-5
                    v-layout(row wrap)
                      v-flex(md3)
                        h5.caption.grey--text OCCUPANCY
                        h3.mt-1.subheading {{booking.tentCount}} Tents

                      v-flex(md5)
                        h5.caption.grey--text CAPACITY
                        h3.mt-1.subheading {{booking.personCount}} Person / Tent

                      v-flex(md3)
                        h5.caption.grey--text AMOUNT
                        h3.mt-1.subheading {{ $n(booking.amount, 'currency', 'en-IN') }}

                      v-flex(md3)
                        h5.caption.grey--text TRIP DURATION
                        h3.mt-1.subheading {{booking.endDate | moment('from', booking.startDate, true)}}

                      v-flex(md5)
                        h5.caption.grey--text TRIP STARTS
                        h3.mt-1.subheading {{booking.startDate | moment('Do MMMM YYYY')}}

</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import ICountUp from 'vue-countup-v2';
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../../../event-bus';
import {
  campBookings, countTents, countBookedTent, countCampActiveBooking, countAllUsers, countAllCamps, allBookings,
} from '../../../queries/queries';

export default {
  name: 'defaultDash',
  components: {
    ICountUp,
    apexcharts: VueApexCharts,
  },
  metaInfo: {
    title: 'Dashboard | Statistics',
  },

  data() {
    return {
      rating: 4,
      isTypeCampOwner: false,
      isTypeAdmin: false,
      user: [],
      campBookings: [],
      totalTents: 0,
      bookedTents: 0,
      campRating: 0,
      totalUsers: 0,
      totalCamps: 0,
      adminBookings: [],
      activeCampBooking: 0,
      chartOptions: {
        chart: {
          id: 'vuechart-example',
        },
        xaxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
        },
        title: {
          text: 'Bookings',
          floating: true,
          offsetY: 320,
          align: 'center',
          style: {
            color: '#444',
          },
        },

      },
      series: [{
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      }],
    };
  },

  mounted() {
    this.getCurrentUserType();
  },

  methods: {

    // Get User type
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
            this.countTent();
          }
          if (data.currentUser.type === 'Admin') {
            this.isTypeAdmin = true;
            this.countUsers();
            this.countCamps();
            this.getAdminBookings();
          }
        })
        .catch((err) => {
          EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
        });
    },

    // Count CampOwner's booked tent
    countBooked() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/login');
      }

      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(countBookedTent)
        .then((data) => {
          this.bookedTents = data.countBookedTent.bookedTentCount;
        })
        .catch((err) => {
          EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
        });
    },

    // Count CampOwner's total inventory
    countTent() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/login');
      }

      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(countTents)
        .then((data) => {
          this.totalTents = data.countCampTents.count;
          this.countBooked();
        })
        .catch((err) => {
          EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
        });
    },

    // Get CampId to get its bookings
    getCampId() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/login');
      }
      const getcampID = `query currentUserCamp{
        currentUserCamp {
        id,
        rating,
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
          this.getBookings(data.currentUserCamp.id);
          this.countBookings(data.currentUserCamp.id);
          this.campRating = data.currentUserCamp.rating;
        })
        .catch((err) => {
          EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
        });
    },

    // Get CampOwner's active bookings
    getBookings(campID) {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      const variables = {
        id: campID,
      };
      client.request(campBookings, variables).then((data) => {
        this.campBookings = data.campBookings;
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      });
    },


    // Count CampOwner's active bookings
    countBookings(campId) {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      const variables = {
        id: campId,
      };
      client.request(countCampActiveBooking, variables).then((data) => {
        this.activeCampBooking = data.countCampActiveBookings.countActiveBooking;
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      });
    },

    // Count All users if Current user is admin

    countUsers() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(countAllUsers).then((data) => {
        this.totalUsers = data.countUsers.count;
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      });
    },


    //  Count total camps
    countCamps() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(countAllCamps).then((data) => {
        this.totalCamps = data.countCamps.count;
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      });
    },


    // Get all active bookings
    getAdminBookings() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(allBookings).then((data) => {
        this.adminBookings = data.allBookings;
      }).catch((err) => {
        console.log(err);
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      });
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
