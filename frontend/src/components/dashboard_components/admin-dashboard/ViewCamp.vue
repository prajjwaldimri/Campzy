<template lang="pug">
  v-container.camp-display(fluid)
    h2.font-weight-bold.headline CAMP DETAILS
    v-card
      v-card-title(primary-title)
        v-flex(xs12).justify-center
      v-container(fluid)
        v-layout(column)
          v-flex(xs12)
            h2 {{campDetail.name}}

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
.camp-display {
  margin: 10px;
  padding: 0px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
