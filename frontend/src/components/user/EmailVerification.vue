<template lang="pug">
  v-dialog(v-model="verificationDialog" max-width="500px" v-if="verificationDialog")
    v-card
      v-card-title
        span.headline Email Verification
      v-card-text
        v-text-field(v-model="token" label="Verification Token" prepend-icon="subject" clearable
        hint="Enter the token you recieved in your email" required)
      v-card-actions
        v-spacer
        span.pr-3 Didn't get verification email?
        v-btn(dark @click.native="resendVerificationEmail")
          span.font-weight-bold RESEND
      v-card-actions
        v-spacer
        v-btn(color="grey darken-1" flat @click.native="closeDialog")
          | Cancel
        v-btn(color="green" @click.native="verifyEmail").white--text Save

</template>

<script>

import { request, GraphQLClient } from 'graphql-request';
import { EventBus } from '../../event-bus';
import { verifyEmailToken, sendVerificationEmail } from '../../queries/mutationQueries';

export default {

  data() {
    return {
      verificationDialog: true,
      token: '',
    };
  },
  mounted() {
    EventBus.$on('open-email-verification-dialog', () => {
      this.token = '';
      this.verificationDialog = true;
    });
  },
  methods: {
    closeDialog() {
      this.verificationDialog = false;
    },
    verifyEmail() {
      this.token = this.token.trim();
      if (this.token === '') {
        return;
      }
      const variables = {
        tokenValue: this.token,
      };
      request('/graphql', verifyEmailToken, variables).then(() => {
        EventBus.$emit('success', 'Email Verified');
      }).catch((err) => {
        if (err) {
          EventBus.$emit('error', 'Email Verification Failed');
        }
      }).finally(() => {
        this.closeDialog();
      });
    },
    resendVerificationEmail() {
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      client.request(sendVerificationEmail).then(() => {
        EventBus.$emit('success', 'Sent Verification Email');
      }).catch((err) => {
        if (err) {
          EventBus.$emit('error', 'Email Verification Failed');
        }
      });
    },
  },
};
</script>
