<template lang="pug">
  v-card
    v-card-title
      span.headline Add Tent
    v-card-text
      v-text-field(v-model="tent.name" label="Tent Type" prepend-icon="subject" clearable
      data-vv-name="tentType" v-validate="'min:4|required|alpha_spaces'"
      :error-messages="errors.collect('tentType')")

      v-text-field(v-model="tent.capacity" label="Capacity"
      prepend-icon="supervisor_account" clearable  data-vv-name="tentCapacity"
      v-validate="'required'" :error-messages="errors.collect('tentCapacity')")

      v-text-field(v-model="tent.price" label="Booking Price" prepend-icon="money" clearable
       data-vv-name="bookingPrice" v-validate="'required|alpha_dash'"
      :error-messages="errors.collect('bookingPrice')")

      v-text-field(v-model="tent.preBooking" label="Pre Booking Time" prepend-icon="payment"
      clearable  data-vv-name="preBooking" v-validate="'required'" type="number"
      :error-messages="errors.collect('preBooking')")

      v-text-field(v-model="tent.totalTents" label="Toal Tents Available" prepend-icon="add_shopping_cart"
      clearable  data-vv-name="totalTents" v-validate="'required'" type="number"
      :error-messages="errors.collect('totalTents')")

    v-card-actions
      v-spacer
      v-btn(color="grey darken-1" flat @click.native="closeDialog")
        | Cancel
      v-btn(color="green" @click.native="saveTent").white--text Save

</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../../../../event-bus';

export default {
  name: 'addTent',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      tent: {},
    };
  },
  methods: {
    closeDialog() {
      // EventBus.$emit('admin-close-add-camp-dialog');
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
          this.isOwnerFieldLoading = true;
          const addTentQuery = `{
        }`;
          const variables = {
            tentType: this.tent.tentType,
            capacity: this.tent.capacity,
            price: this.tent.price,
            preBooking: this.tent.preBooking,
            totalTents: this.tent.totalTents,
          };
          const client = new GraphQLClient('/graphql', {
            headers: {
              Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
            },
          });
          client.request(addTentQuery, variables).then(() => {
            this.camp = {};
            this.isOwnerSelected = false;
          }).catch((err) => {
            EventBus.$emit('error', err);
          }).finally(() => {
            this.closeDialog();
            this.isOwnerFieldLoading = false;
          });
        }
      });
    },
  },
};
</script>
