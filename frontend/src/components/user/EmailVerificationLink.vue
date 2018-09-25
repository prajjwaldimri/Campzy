<template lang="pug">
  v-container
    v-card.align-center
      v-flex.justify-center
        v-img(src='/vectors/like.svg' width='125' height='125')

</template>

<script>
import { request } from 'graphql-request';
import { EventBus } from '../../event-bus';
import { verifyEmailToken } from '../../queries/mutationQueries';

export default {
  data() {
    return {
      token: '',
    };
  },

  mounted() {
    this.verifyEmail();
  },

  methods: {
    verifyEmail() {
      this.token = this.$route.params.token.trim();
      console.log(this.token);
      if (this.token === '') {
        return;
      }
      const variables = {
        tokenValue: this.token,
      };
      request('/graphql', verifyEmailToken, variables).then(() => {
        EventBus.$emit('show-success-notification-long', 'Email Verified');
        EventBus.$emit('email-verification-successful');
      }).catch((err) => {
        if (err) {
          EventBus.$emit('show-error-notification-long', err.response.errors[0].message);
        }
      }).finally(() => {
        this.closeDialog();
      });
    },
  },
};
</script>
