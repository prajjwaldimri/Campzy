<template lang="pug">
  v-container.inventory-container
    closeByDate
    editTent
    v-layout(row)
      h1.font-weight-bold.headline.text-uppercase.pl-2.pb-3 Inventory
    v-layout(row)
      v-flex(xs12 md6)
        v-text-field(solo label="Search" append-icon="search")

      v-flex(xs12 md2 offset-xs1 align-content-end justify-center).d-flex
        v-switch(v-model='campAvailable.isAvailable' color='green'
        @change='campBookingStatus(campAvailable.isAvailable,campAvailable.id)'
        :label='campSwitchLabel'
        )

    v-layout(row)
      v-data-table.hidden-sm-and-down(:headers="headers" :items="tents" style="width: 100%" hide-actions
      must-sort :loading="isTableLoading" ).elevation-1
        template(slot="items" slot-scope="props")
          td.font-weight-bold {{props.item.type}}
          td {{props.item.capacity}} Persons
          td Rs. {{props.item.bookingPrice}}
          td Rs. {{props.item.surgePrice}}
          td {{props.item.preBookPeriod}} Days
          td.align-center
            v-switch(v-model='props.item.isAvailable' color='green'
            @change='openTentBooking(props.item.isAvailable,props.item.id)')
          td.align-center
            v-btn(icon @click='editTent(props.item.id)')
              v-icon edit
          td.align-centers
            v-btn(icon flat @click='openDatePicker(props.item.id)')
              v-icon date_range
      v-flex.hidden-md-and-up(xs12)
        v-card.my-2(v-for='tent in tents')
          v-layout(row)
            v-flex(xs12 md8).d-flex
              v-card-title.title {{tent.type}}
            v-spacer
            v-flex(xs12 md3 offset-xs1)
              v-switch(v-model='tent.isAvailable' label='Tent Booking' color='green' @change='openTentBooking(tent.isAvailable,tent.id)')
          v-divider
          v-layout.pa-3(row wrap)
            v-flex(md3 xs3)
              h5.caption.grey--text Capacity
              h3.mt-1.subheading {{tent.capacity}} Person(s)

            v-flex.ml-2(md5 xs5 offset-md4)
              h5.caption.grey--text Booking Price
              h3.mt-1.subheading {{tent.bookingPrice}}

            v-flex(md3 xs3)
              h5.caption.grey--text Surged Price
              h3.mt-1.subheading {{tent.surgePrice}}

            v-flex(md3 xs3).mt-4
              h5.caption.grey--text Pre Book Time
              h3.mt-1.subheading {{tent.preBookPeriod}} Day(s)
          v-divider
          v-card-actions
            v-spacer
            v-btn(icon flat @click='openDatePicker(tent.id)')
              v-icon date_range
            v-btn(flat icon @click='editTent(tent.id)' )
              v-icon edit


    v-dialog(v-model="addTentDialog" persistent max-width="500px")
      v-btn(color="green" slot="activator" fab dark bottom right fixed style='bottom:5.5rem').elevation-19
        v-icon add
      addTent
</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { getAllTentsQuery } from '../../../queries/queries';
import AddTent from './TentManager/AddTent.vue';
import EditTent from './TentManager/EditTent.vue';
import { EventBus } from '../../../event-bus';
import { closeTentBooking, campBooking } from '../../../queries/mutationQueries';
import CloseBooking from './CloseBookingsByDate.vue';

export default {
  components: {
    addTent: AddTent,
    closeByDate: CloseBooking,
    editTent: EditTent,
  },
  metaInfo: {
    title: 'Dashboard | Inventory',
  },

  data() {
    return {
      disabledDates: [],
      closeBookings: false,
      selectedTents: [],
      headers: [
        {
          text: 'Tent Type',
          value: 'type',
        },
        { text: 'Tent Capacity', value: 'capacity' },
        { text: 'Booking Price', value: 'bookingPrice' },
        { text: 'Surged Price', value: 'surgePrice' },
        { text: 'Pre Book Time', value: 'perBookPeriod' },
        { text: 'Open Booking', value: 'actions', sortable: false },
        { text: 'Edit Tent', value: 'actions', sortable: false },
        { text: 'Close Dates', value: 'actions', sortable: false },
      ],
      tents: [],
      addTentDialog: false,
      isTableLoading: false,
      closeBookingDialog: false,
      closeBooking: true,
      isTentBooked: '',
      campAvailable: [],
      campSwitchLabel: '',
      tentStatus: false,
    };
  },
  mounted() {
    EventBus.$on('campowner-close-add-tent-dialog', () => {
      this.addTentDialog = false;
      this.getAllTents();
    });

    EventBus.$on('close-edit-tent-dialog', () => {
      this.getAllTents();
    });
    this.getAllTents();
  },

  methods: {
    openDatePicker(tentid) {
      EventBus.$emit('open-close-booking-date-picker', tentid);
    },
    editTent(tentid) {
      EventBus.$emit('campowner-open-edit-tent-dialog', tentid);
    },

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
        this.getCampStatus();
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      }).finally(() => {
        this.isTableLoading = false;
      });
    },

    getCampStatus() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }

      const campStatus = `query currentUserCamp{
        currentUserCamp {
          id,
          isAvailable,
        }
      }`;
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      client.request(campStatus).then((data) => {
        this.campAvailable = data.currentUserCamp;
        if (this.campAvailable.isAvailable === false) {
          this.campSwitchLabel = 'Bookings: Close';
        } else {
          this.campSwitchLabel = 'Bookings: Open';
        }
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      });
    },

    campBookingStatus(campAvailable, campId) {
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
        isAvailable: campAvailable,
      };
      client.request(campBooking, variables).then((data) => {
        if (data.campAvailability.isAvailable === false) {
          EventBus.$emit('show-error-notification-short', 'Booking Closed for this Camp');
        } else {
          EventBus.$emit('show-success-notification-short', 'Booking Open for this Camp');
        }
        this.getCampStatus();
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      });
    },
  },
};
</script>


<style lang="scss" scoped>
.inventory-container {
  @media screen and (max-width: 960px) {
    padding-bottom: 17rem;
  }
  height: 100%;
}
</style>
