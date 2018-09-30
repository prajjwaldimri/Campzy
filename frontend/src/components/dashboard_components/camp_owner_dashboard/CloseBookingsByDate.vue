<template lang="pug">
  v-dialog(ref="closeBookings"
  v-model="closeBookings"
  :return-value.sync="disabledDates"
  lazy
  persistent
  width="290px"
  v-if='closeBookings')
    v-date-picker(v-model="disabledDates" multiple color="green"  scrollable)
      v-spacer
      v-btn( flat color="primary" @click="closeBookings = false") Cancel
      v-btn( flat color="primary" @click='closeBookingByDate') OK
</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../../../event-bus';
import { closeBookingByDates } from '../../../queries/mutationQueries';

export default {
  data() {
    return {
      disabledDates: [],
      closeBookings: false,
      tentID: '',

    };
  },

  mounted() {
    EventBus.$on('open-close-booking-date-picker', (tentid) => {
      this.tentID = tentid;
      this.closeBookings = true;
    });
  },

  methods: {
    closeBookingByDate() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      const variables = {
        id: this.tentID,
        disabledDates: this.disabledDates,
      };
      client.request(closeBookingByDates, variables).then(() => {
        this.disabledDates = [];
        this.closeBookings = false;
        EventBus.$emit('show-success-notification-short', 'Tents are closed for these dates');
      }).catch((err) => {
        this.disabledDates = [];
        this.closeBookings = false;
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      });
    },

  },
};
</script>
