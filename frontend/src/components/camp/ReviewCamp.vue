<template lang="pug">
  v-dialog(persistent v-model="isDialogVisible" width="300")
    v-card
      v-card-title.headline.green.white--text Your Experience Matters to Campzy

</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { getLatestCampForReview } from '../../queries/queries';
// import { addReview } from '../../queries/mutationQueries';
import { EventBus } from '../../event-bus';

export default {
  data() {
    return {
      isDialogVisible: false,
      camp: {},
    };
  },
  mounted() {
    this.getCampForReview();
  },
  methods: {
    getCampForReview() {
      if (!this.$cookie.get('sessionToken')) {
        return;
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(getLatestCampForReview)
        .then((data) => {
          if (data.getLatestCampForReview) {
            this.camp = data.getLatestCampForReview;
            this.isDialogVisible = true;
          }
        })
        .catch((err) => {
          console.log(err);
          EventBus.$emit('show-error-notification-long', err.response.errors[0].message);
        });
    },
  },
};
</script>
