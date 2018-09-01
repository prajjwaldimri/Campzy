<template lang="pug">
  v-container.camps-container(grid-list-lg)
    h2.font-weight-bold.headline.text-uppercase Statistics
    v-container.camp-owner-conatiner.mt-1(fluid v-show='isTypeCampOwner')
      v-layout(row wrap)
        v-flex(xs12 md4)
          v-card
            v-card-title.justify-center
              h3.font-weight-black.text-uppercase Bookings
            v-container(fluid)
              v-layout(row wrap)
                v-flex(xs12 md6)
                  v-layout(column).align-center
                    h3.font-weight-normal.text-uppercase Active Bookings
                    span.title.grey--text.text--darken-1.mt-4
                      ICountUp(:startVal="0" :endVal="1000" :duration="2")
                      |  Bookings
                v-flex(xs12 md6)
                  v-layout(column).align-center
                    h3.font-weight-normal.text-uppercase Total Bookings
                    span.title.grey--text.text--darken-1.mt-4
                      ICountUp(:startVal="0" :endVal="10000" :duration="2")
                      |  Bookings
        v-flex(xs12 md4)
          v-card
            v-card-title.justify-center
              h3.font-weight-black.text-uppercase Inventory
            v-container(fluid)
              v-layout(row wrap)
                v-flex(xs12 md6)
                  v-layout(column).align-center
                    h3.font-weight-normal.text-uppercase Available Tents
                    span.title.grey--text.text--darken-1.mt-4
                      ICountUp(:startVal="0" :endVal="1000" :duration="2")
                      |  Tents
                v-flex(xs12 md6)
                  v-layout(column).align-center
                    h3.font-weight-normal.text-uppercase Booked Tents
                    span.title.grey--text.text--darken-1.mt-4
                      ICountUp(:startVal="0" :endVal="10000" :duration="2")
                      |  Tents
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
                    v-rating.mt-3(v-model="rating" small
                    color="green darken-3" background-color="grey darken-1"
                    empty-icon="$vuetify.icons.ratingFull"
                    half-increments
                    hover)
      v-layout(row wrap)
        v-flex(xs12)
          v-card
            v-card-title.justify-center
              h3.font-weight-black.text-uppercase Active bookings
            v-container(fluid)
              v-data-table(:headers="headers" :items="activeBookings" hide-actions)
                template(slot="items" slot-scope="props")
                  td {{ props.item.id }}
                  td {{ props.item.name }}
                  td {{ props.item.tentType }}
                  td {{ props.item.duration }} day(s)
                  td {{ props.item.bookingStatus }}

    //- Show if user is Admin
    v-container.camp-owner-conatiner.mt-1(fluid v-show='isTypeAdmin')
      v-layout(row wrap)
        v-flex(xs12 md4)
          v-card
            v-card-title.justify-center
              h3.font-weight-black.text-uppercase Users
            v-container(fluid)
              v-layout(row wrap)
                v-flex(xs12 md6)
                  v-layout(column).align-center
                    h3.font-weight-normal.text-uppercase Active users
                    span.title.grey--text.text--darken-1.mt-4
                      ICountUp(:startVal="0" :endVal="10000" :duration="2")
                      |  Users
                v-flex(xs12 md6)
                  v-layout(column).align-center
                    h3.font-weight-normal.text-uppercase Total Users
                    span.title.grey--text.text--darken-1.mt-4
                      ICountUp(:startVal="0" :endVal="10000" :duration="2")
                      |  Users
        v-flex(xs12 md4)
          v-card
            v-card-title.justify-center
              h3.font-weight-black.text-uppercase Camp
            v-container(fluid)
              v-layout(row wrap)
                v-flex(xs12 md6)
                  v-layout(column).align-center
                    h3.font-weight-normal.text-uppercase Booked Camps
                    span.title.grey--text.text--darken-1.mt-4
                      ICountUp(:startVal="0" :endVal="10000" :duration="2")
                      |  Tents
                v-flex(xs12 md6)
                  v-layout(column).align-center
                    h3.font-weight-normal.text-uppercase Total Camps
                    span.title.grey--text.text--darken-1.mt-4
                      ICountUp(:startVal="0" :endVal="10000" :duration="2")
                      |  Tents
        v-flex(xs12 md4)
          v-card
            v-card-title.justify-center
              h3.font-weight-black.text-uppercase Everyday Statistics
            v-container(fluid)
              v-layout(row wrap)
                v-flex(xs12 md6)
                  v-layout(column).align-center
                    h3.font-weight-normal.text-uppercase Users
                    span.title.grey--text.text--darken-1.mt-4
                      ICountUp(:startVal="0" :endVal="10000" :duration="2")
                      |  Active
                v-flex(xs12 md6)
                  v-layout(column).align-center
                    h3.font-weight-normal.text-uppercase Camps
                    span.title.grey--text.text--darken-1.mt-4
                      ICountUp(:startVal="0" :endVal="10000" :duration="2")
                      |  Booked
      v-layout(row wrap)
        v-flex(xs12)
          v-card
            v-card-title.justify-center
              h3.font-weight-black.text-uppercase Active bookings
            v-container(fluid)
              v-data-table(:headers="headers" :items="activeBookings" hide-actions)
                template(slot="items" slot-scope="props")
                  td {{ props.item.id }}
                  td {{ props.item.name }}
                  td {{ props.item.tentType }}
                  td {{ props.item.duration }} day(s)
                  td {{ props.item.bookingStatus }}
</template>

<script>
import ICountUp from 'vue-countup-v2';
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../../../event-bus';

export default {
  name: 'defaultDash',
  components: {
    ICountUp,
  },
  data() {
    return {
      rating: 4,
      isTypeCampOwner: false,
      isTypeAdmin: false,
      headers: [
        {
          text: 'Customer Id',
          sortable: false,
          value: 'id',
        },
        { text: 'Customer Name', value: 'name' },
        { text: 'Tent Booked', value: 'tentType' },
        { text: 'Duration', value: 'duration' },
        { text: 'Status', value: 'bookingStatus' },
      ],
      activeBookings: [
        {
          id: 123,
          name: 'Ayush Bahuguna',
          tentType: 'Gold',
          duration: 5,
          bookingStatus: 'active',
        },
        {
          id: 124,
          name: 'Ayush Bahuguna',
          tentType: 'Gold',
          duration: 5,
          bookingStatus: 'active',
        },
        {
          id: 125,
          name: 'Ayush Bahuguna',
          tentType: 'Gold',
          duration: 5,
          bookingStatus: 'active',
        },
        {
          id: 126,
          name: 'Ayush Bahuguna',
          tentType: 'Gold',
          duration: 5,
          bookingStatus: 'active',
        },
        {
          id: 127,
          name: 'Ayush Bahuguna',
          tentType: 'Gold',
          duration: 5,
          bookingStatus: 'active',
        },
        {
          id: 128,
          name: 'Ayush Bahuguna',
          tentType: 'Gold',
          duration: 5,
          bookingStatus: 'active',
        },
      ],
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
          }
          if (data.currentUser.type === 'Admin') {
            this.isTypeAdmin = true;
          }
        })
        .catch((err) => {
          EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
        });
    },
  },
};

</script>


<style lang="scss" scoped>
.camps-container {
  @media screen and (min-width: 960px) {
    padding: 2rem;
  }
  height: 100%;
}

.camp-owner-conatiner {
  margin: 0px;
  padding: 0px;
}
</style>
