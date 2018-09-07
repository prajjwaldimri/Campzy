<template lang="pug">
  v-container.inventory-container
    v-layout(row)
      h1.font-weight-light.pl-2.pb-3 Inventory
    v-layout(row)
      v-flex(sm5)
        v-text-field(solo label="Search" append-icon="search")

      v-flex(sm3 offset-sm4 align-content-start justify-center).d-flex
        v-dialog(v-model="addTentDialog" persistent max-width="500px")
          v-btn(color="green" slot="activator").white--text Add Tent
            v-icon(right dark) add_box
          addTent

    v-layout(row)
      v-data-table(:headers="headers" :items="tents" style="width: 100%" hide-actions
      must-sort :loading="isTableLoading").elevation-1
        template(slot="items" slot-scope="props")
          td.font-weight-bold {{props.item.type}}
          td {{props.item.capacity}} Persons
          td Rs. {{props.item.bookingPrice}}
          td Rs. {{props.item.surgePrice}}
          td {{props.item.preBookPeriod}} Days
          td {{props.item.bookedBy}}
          td {{props.item.isBooked}}
          td.align-center
            v-switch(v-model='props.item.isAvailable' color='green'
            @change='openTentBooking(props.item.isAvailable,props.item.id)')
</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { getAllTentsQuery } from '../../../queries/queries';
import AddTent from './TentManager/AddTent.vue';
import { EventBus } from '../../../event-bus';
import { closeTentBooking } from '../../../queries/mutationQueries';

export default {
  components: {
    addTent: AddTent,
  },

  data() {
    return {
      headers: [
        {
          text: 'Tent Type',
          value: 'type',
        },
        { text: 'Tent Capacity', value: 'capacity' },
        { text: 'Booking Price', value: 'bookingPrice' },
        { text: 'Surged Price', value: 'surgePrice' },
        { text: 'Pre Book Time', value: 'perBookPeriod' },
        { text: 'Booked By', value: 'bookedBy' },
        { text: 'Is Booked', value: 'isBooked' },
        { text: 'Open Booking', value: 'actions', sortable: false },
      ],
      tents: [],
      addTentDialog: false,
      isTableLoading: false,
      closeBookingDialog: false,
      closeBooking: true,
    };
  },
  mounted() {
    EventBus.$on('campowner-close-add-tent-dialog', () => {
      this.addTentDialog = false;
      this.getAllTents();
    });
    this.getAllTents();
  },

  methods: {
    openTentBooking(isCloseBooking, tentId) {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      const variables = {
        id: tentId,
        isAvailable: isCloseBooking,
      };
      client.request(closeTentBooking, variables).then((data) => {
        if (data.closeTentBooking.isAvailable === false) {
          EventBus.$emit('show-error-notification-short', 'Booking Closed for this Tent');
        } else {
          EventBus.$emit('show-success-notification-short', 'Booking Open for this Tent');
        }
        this.getAllTents();
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      });
    },
    getAllTents() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      this.isTableLoading = true;
      client.request(getAllTentsQuery).then((data) => {
        this.tents = data.allTents;
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      }).finally(() => {
        this.isTableLoading = false;
      });
    },
  },
};
</script>


<style lang="scss" scoped>
.inventory-container {
  @media screen and (min-width: 960px) {
    padding: 5rem;
  }
  height: 100%;
}
</style>
