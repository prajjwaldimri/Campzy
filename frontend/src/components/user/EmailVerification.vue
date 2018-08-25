<template lang="pug">
  v-dialog(v-model="verificationDialog" max-width="500px" v-if="verificationDialog")
    v-card
      v-card-title
        span.headline Email Verification
      v-card-text
        v-text-field(v-model="token" label="Verification Token" prepend-icon="subject" clearable
        hint="Enter the token you recieved in your email")
      v-card-actions
        v-spacer
        v-btn(color="grey darken-1" flat @click.native="closeDialog")
          | Cancel
        v-btn(color="green" @click.native="saveCamp").white--text Save

</template>

<script>

import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../../event-bus';

export default {

  data() {
    return {
      verificationDialog: true,
      token: '',
    };
  },
  mounted() {
    EventBus.$on('open-email-verification-dialog', (id) => {
      this.token = '';
      this.verificationDialog = true;
    });
  },
  methods: {
    closeDialog() {
      this.verificationDialog = false;
    },
  },
};
</script>
