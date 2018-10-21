<template lang="pug">
  v-container.ma-0
    v-layout(row wrap)
      v-flex(xs12)
        v-layout(row wrap)
          v-card.request-card(v-for='request in campRequests')
            v-card-title.font-weight-bold Req ID: {{request.id}}
            div(style='padding-left:16px;padding-rigth:16px')
              h3
                span.font-weight-bold Name:&nbsp;
                span.font-weight-normal {{request.name}}
              h3
                span.font-weight-bold Phone No.:&nbsp;
                span.font-weight-normal {{request.phoneNumber}}
            v-card-actions.mt-3
              v-spacer
              v-btn(color='red' dark small @click='closeRequest(request.id)') Delete

</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { getCampRequests } from '../../../queries/queries';
// import { EventBus } from '../../../event-bus';

export default {
  data() {
    return ({
      campRequests: {},
    });
  },
  mounted() {
    this.getAllRequests();
  },

  methods: {
    getAllRequests() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }

      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(getCampRequests).then((data) => {
        this.campRequests = data.getAllRequests;
      }).catch((err) => {
        console.log(err);
      });
    },
    closeRequest(requestId) {
      console.log(requestId);
    },
  },
};
</script>

<style lang="scss" scoped>
.request-card {
  margin: 1rem;
  @media screen and (max-width: 559px) {
    width: 100%;
  }
}
</style>
