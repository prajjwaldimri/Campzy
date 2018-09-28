<template lang="pug">
  v-container(grid-list-lg)
    v-layout(row wrap)
      v-flex(xs12 md6)

      v-flex(xs12 md6)
        v-card.settings-card
          v-card-title(primary-title).pl-1
            h2.headline.font-weight-bold BILLING ACCOUNTS
          .settings-flex
            img(src="https://www.phonepe.com/images/generic/PhonePe-Logo.svg" height="64" width="80").ml-2
            v-btn(flat) LINK ACCOUNT
          v-divider
          .settings-flex
            img(src="/vectors/paytm.svg" height="64" width="80")
            v-btn(flat) LINK ACCOUNT
</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { getWishList } from '../../queries/queries';
import { EventBus } from '../../event-bus';

export default {
  data() {

  },

  mounted() {

  },
  methods: {
    getUserWishList() {
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(getWishList).then((data) => {
        console.log(data);
      }).catch((err) => {
        EventBus.$emit('show-error-notification-long', err.response.errors[0].message);
      });
    },
  },
};
</script>


<style lang="scss" scoped>
.settings-card {
  padding: 2rem;
}

.settings-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
