<template lang="pug">
  v-card
    v-card-title.headline Select Tent type
    v-card-text
      v-flex(xs12).justify-center
        v-select(:items='totalTents' chips label='Select Tent type'
        outline)
    v-card-actions
      v-spacer
      v-btn(flat small) cancel
      v-btn.white--text(color='green' small) Save
</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { getAllTentsQuery } from '../../../../queries/queries';
import { EventBus } from '../../../../event-bus';

export default {
  data() {
    return {
      tentType: [],
      totalTents: ['All'],
    };
  },
  mounted() {
    this.getAllTentType();
  },
  methods: {
    getAllTentType() {
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
        data.allTents.forEach((tents) => {
          this.totalTents.push(tents.type);
        });
        console.log(this.totalTents);
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      }).finally(() => {
        this.isTableLoading = false;
      });
    },

    closeBooking() {

    },
  },
};
</script>
