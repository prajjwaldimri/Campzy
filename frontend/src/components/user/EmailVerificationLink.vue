<template lang="pug">
  .home-flex
    .success-text.pb-4.pt-4(v-show='isSuccess')
      h1 Successfully Verified!
    .error-text.pb-4.pt-4(v-show='isFailed')
      h1 Verification Failed!


</template>

<script>
import { request } from 'graphql-request';
import { EventBus } from '../../event-bus';
import { verifyEmailToken } from '../../queries/mutationQueries';

export default {
  data() {
    return {
      token: '',
      isSuccess: false,
      isFailed: false,
    };
  },

  mounted() {
    this.verifyEmail();
  },

  methods: {
    verifyEmail() {
      EventBus.$emit('show-progress-bar');
      this.token = this.$route.params.token.trim();
      if (this.token === '') {
        return;
      }
      const variables = {
        tokenValue: this.token,
      };
      request('/graphql', verifyEmailToken, variables).then(() => {
        EventBus.$emit('show-success-notification-long', 'Email Verified');
        this.isSuccess = true;
        this.$router.push('/profile');
      }).catch((err) => {
        if (err) {
          EventBus.$emit('show-error-notification-long', err.response.errors[0].message);
          this.isFailed = true;
          this.router.push('/profile');
        }
      }).finally(() => {
        EventBus.$emit('hide-progress-bar');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.home-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  max-height: 100vh;

  .success-text {
    color: green;
    min-width: 40vw;
    @media screen and (max-width: 960px) {
      min-width: 90vw;
    }
    text-align: center;
    user-select: none;
  }
  .error-text {
    color: red;
    min-width: 40vw;
    @media screen and (max-width: 960px) {
      min-width: 90vw;
    }
    text-align: center;
    user-select: none;
  }
}
</style>
