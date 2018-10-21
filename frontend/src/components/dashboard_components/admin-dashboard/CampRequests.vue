<template lang="pug">
 h1 hello
</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { getCampRequests } from '../../../queries/queries';
// import { EventBus } from '../../../event-bus';

export default {
  data() {
    return ({

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
        console.log(data);
      }).catch((err) => {
        console.log(err);
      });
    },
  },
};
</script>
