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
          v-btn(color="green" @click.native="resetPassword").white--text Reset password

</template>

<script>
import { request } from 'graphql-request'
import { resetPasswordMutation } from '../../queries/mutationQueries'
import { EventBus } from '../../layouts/event-bus'

export default {
  data() {
    return {
      newPassword: '',
      confirmNewPassword: ''
    }
  },
  methods: {
    resetPassword() {
      this.newPassword.trim()
      this.confirmNewPassword.trim()
      if (this.newPassword === '' || this.confirmNewPassword === '') {
        EventBus.$emit('show-error-notification-long', 'Passwords empty')
        return
      }
      if (this.newPassword !== this.confirmNewPassword) {
        EventBus.$emit('show-error-notification-long', "Passwords don't match")
        return
      }
      const variables = {
        newPassword: this.newPassword,
        confirmNewPassword: this.confirmNewPassword,
        resetToken: this.$route.params.token
      }
      request('/graphql', resetPasswordMutation, variables)
        .then(() => {
          EventBus.$emit(
            'show-success-notification-long',
            'Password Reset Successful'
          )
          this.$router.push('/login')
        })
        .catch(err => {
          if (err) {
            EventBus.$emit(
              'show-error-notification-long',
              err.response.errors[0].message
            )
          }
        })
    }
  }
}
</script>
