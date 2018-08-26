<template lang="pug">
v-container
  v-layout(row justify-center)
    v-flex(xs6 align-center)
      v-card
        v-card-title
          span.headline Reset your password
        v-card-text
          v-text-field(v-model="newPassword" label="Enter New Password"
          prepend-icon="vpn_key" clearable required)
          v-text-field(v-model="confirmNewPassword" label="Confirm New Password"
          prepend-icon="vpn_key" clearable required)

        v-card-actions
          v-spacer
          v-btn(color="green" @click.native="verifyEmail").white--text Reset password

</template>

<script>
export default {
  data() {
    return {
      newPassword: '',
      confirmNewPassword: '',
    };
  },
  methods: {
    resetPassword() {
      const variables = {
        newPassword: this.newPassword,
        confirmNewPassword: this.confirmNewPassword,
        resetToken: this.$route.params.token,
      };
    },
  },
};
</script>
