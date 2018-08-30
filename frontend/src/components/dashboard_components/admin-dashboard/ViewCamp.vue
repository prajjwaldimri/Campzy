<template lang="pug">
  v-container.camps-container(grid-list-lg)
    h2.font-weight-bold.headline CAMP DETAILS
    v-layout(row wrap)
      v-flex(xs12 md6)
        v-card.card-body
          v-card-title
            h2.font-weight-normal BASIC DETAILS
          v-container(fluid)
            v-layout(column)
              v-flex(xs12)
                v-text-field( label='Camp Name' v-model='campDetail.name' readonly)
              v-flex(xs12)
                v-text-field( label='Camp Email' v-model='campDetail.email' readonly)
              v-flex(xs12)
                v-text-field( label='Phone Number' v-model='campDetail.phoneNumber' readonly)
              v-flex(xs12)
                v-text-field( label='Location' v-model='campDetail.location' readonly)
              v-flex(xs12)
                v-text-field( label='Camp Url' v-model='campDetail.url' readonly)
      v-flex(xs12 md6)
        v-card.card-body
          v-card-title
            h2.font-weight-normal BANK DETAILS
          v-container(fluid)
            v-layout(column)
              v-flex(xs12)
                v-text-field( label='Bank Name' v-model='campDetail.name' readonly)
              v-flex(xs12)
                v-text-field( label='Account Number' v-model='campDetail.email' readonly)
              v-flex(xs12)
                v-text-field( label='Bank IFSC Code' v-model='campDetail.phoneNumber' readonly)
              v-flex(xs12)
                v-text-field( label='Branch' v-model='campDetail.location' readonly)
              v-flex(xs12)
                v-text-field( label='GST Number' v-model='campDetail.url' readonly)
    v-flex(xs12)
      v-card.card-body
        v-card-title
          h2.font-weight-normal Camp Details
        v-container(fluid)
          v-layout(column)
            v-flex(xs12)
              v-combobox(v-model='campDetail.placesOfInterest' attach chips
              label='Amenities' multiple readonly)
            v-flex(xs12)
              v-combobox(v-model='campDetail.placesOfInterest' attach chips
              label='Places of Interest' multiple readonly)
            v-flex(xs12)
              v-combobox(v-model='campDetail.tags' attach chips
              label='Tags' multiple readonly)
            v-flex(xs12)
              v-text-field( label='Short Description' v-model='campDetail.shortDescription' readonly)
            v-flex(xs12)
              v-textarea( label='Long Description' v-model='campDetail.longDescription' readonly)

</template>
<script>
import { GraphQLClient } from 'graphql-request';
// import { EventBus } from '../../../event-bus';
import { getCampDetail } from '../../../queries/queries';

export default {
  data() {
    return {
      campDetail: {},
    };
  },
  mounted() {
    this.showCampDetails();
  },

  methods: {
    showCampDetails() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const variables = {
        id: this.$route.params.id,
      };
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      client.request(getCampDetail, variables).then((data) => {
        this.campDetail = data.camp;
      }).catch((err) => {
        console.log(err);
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

.card-body {
  padding: 2rem;
}
</style>
