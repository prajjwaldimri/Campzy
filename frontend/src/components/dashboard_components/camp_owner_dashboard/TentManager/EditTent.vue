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
            v-text-field(v-model="tent.bookingPrice" label="Booking Price" prepend-icon="money" clearable
            data-vv-name="bookingPrice" v-validate="'required'"
            :error-messages="errors.collect('bookingPrice')" @change='calculatePrice(tent.bookingPrice)')
          v-spacer
          v-flex(xs12 md6)
            v-text-field(v-model="calculatedPrice" label="Final Price" prepend-icon="account_balance_wallet"
            data-vv-name="finalPrice" v-validate="'required'" hint='*Including all Taxes' persistent-hint
            :error-messages="errors.collect('finalPrice')" readonly)

        v-text-field(v-model="tent.surgePrice" label="Surge Price" prepend-icon="money" clearable
        data-vv-name="surgePrice"
        :error-messages="errors.collect('surgePrice')")

        v-text-field(v-model="tent.preBookPeriod" label="Pre Booking Time" prepend-icon="payment"
        clearable  data-vv-name="preBooking" v-validate="'required'" type="number"
        :error-messages="errors.collect('preBooking')")


      v-card-actions
        v-spacer
        v-btn(color="grey darken-1" flat @click.native="closeDialog")
          | Cancel
        v-btn(color="green" @click.native="saveTent").white--text Save

</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../../../../event-bus';
import { getTentById } from '../../../../queries/queries';
import { updateTentQuery, closeBookingByDates } from '../../../../queries/mutationQueries';

export default {
  name: 'addTent',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      tent: {},
      totalTents: '',
      calculatedPrice: '',
      editTentDialog: false,
      disabledDates: [],
      tentId: '',
    };
  },
  mounted() {
    EventBus.$on('campowner-open-edit-tent-dialog', (tentId) => {
      this.editTentDialog = true;
      this.getTentDetails(tentId);
    });
  },
  methods: {
    getTentDetails(tentID) {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      const variables = {
        id: tentID,
      };
      client.request(getTentById, variables).then((data) => {
        this.tent = data.tent;
        this.disabledDates = this.tent.disabledDates;
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      });
    },
    calculatePrice(tentPrice) {
      this.calculatedPrice = parseInt(tentPrice, 10) + (parseInt(tentPrice, 10) * 15 / 100) + (parseInt(tentPrice, 10) * 18 / 100);
    },
    closeDialog() {
      this.editTentDialog = false;
    },
    saveTent() {
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          if (!this.$cookie.get('sessionToken')) {
            this.$router.push('/');
          }
          if (!this.tent || !isValid) {
            return;
          }
          const variables = {
            id: this.tent.id,
            tentType: this.tent.type,
            capacity: this.tent.capacity,
            bookingPrice: this.tent.bookingPrice,
            preBookTime: this.tent.preBookPeriod,
            surgePrice: parseInt(this.tent.surgePrice, 10),
          };

          const client = new GraphQLClient('/graphql', {
            headers: {
              Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
            },
          });

          client.request(updateTentQuery, variables).then((data) => {
            console.log(data);
            this.tent = {};
            this.closeBookingByDate();
          }).catch((err) => {
            console.log(err);
            EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
          });
        }
      });
    },

    closeBookingByDate() {
      this.disabledDates.forEach((dates) => {
        if (!this.$cookie.get('sessionToken')) {
          this.$router.push('/');
        }
        const client = new GraphQLClient('/graphql', {
          headers: {
            Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
          },
        });
        const variables = {
          id: this.tent.id,
          disabledDates: dates,
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
      });
      this.closeDialog();
    },

  },

};
</script>
