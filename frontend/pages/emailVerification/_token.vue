<template lang="pug">
  .home-flex
    .loading-flex
      line-scale-pulse-out-rapid-loader(color="green" size="80px" v-if="!emailVerified")


</template>

<script>
import { setTimeout } from 'timers'
import { request } from 'graphql-request'
import { EventBus } from '../../layouts/event-bus'
import { verifyEmailToken } from '../../queries/mutationQueries'

export default {
  data() {
    return {
      token: '',
      emailVerified: false
    }
  },

  mounted() {
    this.verifyEmail()
  },

  methods: {
    verifyEmail() {
      EventBus.$emit('show-progress-bar')
      this.token = this.$route.params.token.trim()
      if (this.token === '') {
        return
      }
      const variables = {
        tokenValue: this.token
      }
      request('https://api.campzy.in', verifyEmailToken, variables)
        .then(() => {
          EventBus.$emit('show-success-notification-long', 'Email Verified')
          setTimeout(() => {
            this.emailVerified = true
            this.$router.push('/profile')
          }, 2000)
        })
        .catch(err => {
          if (err) {
            EventBus.$emit(
              'show-error-notification-long',
              err.response.errors[0].message
            )
            setTimeout(() => {
              this.emailVerified = true
              this.router.push('/profile')
            }, 2000)
          }
        })
        .finally(() => {
          EventBus.$emit('hide-progress-bar')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  max-height: 100vh;

  .loading-flex {
    margin-top: auto;
    margin-bottom: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
