<template lang="pug">
  v-card
    v-card-title
      span.headline Add Tent
    v-card-text
      v-text-field(v-model="tent.type" label="Tent Type" prepend-icon="subject" clearable
      data-vv-name="tentType" v-validate="'min:4|required|alpha_spaces'"
      :error-messages="errors.collect('tentType')")

      v-text-field(v-model="totalTents" label="Toal Tents Available"
      prepend-icon="add_shopping_cart"
      clearable  data-vv-name="totalTents" v-validate="'required'"
      :error-messages="errors.collect('totalTents')")

      v-text-field(v-model="tent.capacity" label="Capacity Per Tent"
      prepend-icon="supervisor_account" clearable  data-vv-name="tentCapacity"
      v-validate="'required'" :error-messages="errors.collect('tentCapacity')")
      v-layout(row)
        v-flex(xs12 md5)
          v-text-field(v-model="tent.price" label="Booking Price" prepend-icon="money" clearable
          data-vv-name="bookingPrice" v-validate="'required'"
          :error-messages="errors.collect('bookingPrice')" @change='calculatePrice(tent.price)')
        v-spacer
        v-flex(xs12 md6)
          v-text-field(v-model="calculatedPrice" label="Final Price" prepend-icon="account_balance_wallet"
          data-vv-name="finalPrice" v-validate="'required'" hint='*Including all Taxes' persistent-hint
          :error-messages="errors.collect('finalPrice')" readonly)

      v-text-field(v-model="tent.surgePrice" label="Surge Price" prepend-icon="money" clearable
       data-vv-name="surgePrice"
      :error-messages="errors.collect('surgePrice')")

      v-text-field(v-model="tent.preBooking" label="Pre Booking Time" prepend-icon="payment"
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
import { addTentQuery } from '../../../../queries/mutationQueries';

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
    };
  },
  methods: {
    calculatePrice(tentPrice) {
      this.calculatedPrice = parseInt(tentPrice, 10) + (parseInt(tentPrice, 10) * 15 / 100) + (parseInt(tentPrice, 10) * 18 / 100);
    },
    closeDialog() {
      EventBus.$emit('campowner-close-add-tent-dialog');
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
            tentType: this.tent.type,
            capacity: this.tent.capacity,
            bookingPrice: this.tent.price,
            preBookTime: this.tent.preBooking,
            surgePrice: parseInt(this.tent.surgePrice, 10),
          };

          for (let i = 1; i <= this.totalTents; i += 1) {
            const client = new GraphQLClient('/graphql', {
              headers: {
                Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
              },
            });

            client.request(addTentQuery, variables).then(() => {
              this.tent = {};
            }).catch((err) => {
              console.log(err);
              EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
            });
          }
        }
      });
      this.closeDialog();
    },
  },

};
</script>
