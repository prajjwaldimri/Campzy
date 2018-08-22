<template lang="pug">
  h1 User Settings
</template>

<script>
import { GraphQLClient } from 'graphql-request';

export default {
  data() {
    return {};
  },
  mounted() {
    if (!this.$cookie.get('sessionToken')) {
      // TODO: uncomment this
      this.$router.push({ name: 'login' });
    } else {
      const query = `{currentUser {
        name,
        email,
        dateOfBirth
      }}`;
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(query).then(data => console.log(data)).catch(err => console.log(err));
    }
  },
};
</script>
