<template lang="pug">
  v-container.request-container.ma-0
    h2.headline.font-weight-bold Camp Requests
    v-layout.mt-4(row wrap)
      v-flex(xs12)
        v-layout(row wrap)
          v-card.request-card(v-for='request in campRequests' :key="request")
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
              v-btn(color='red' dark small @click='closeRequest(request.id)' flat) Close Request

</template>

<script>
import { GraphQLClient } from 'graphql-request'
import { getCampRequests } from '../../queries/queries'
import { deleteRequest } from '../../queries/mutationQueries'
import { EventBus } from '../../layouts/event-bus'

export default {
  data() {
    return {
      campRequests: {}
    }
  },
  mounted() {
    this.getAllRequests()
  },

  methods: {
    getAllRequests() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/')
      }
      this.campRequest = true
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })

      client
        .request(getCampRequests)
        .then(data => {
          this.campRequests = data.getAllRequests
        })
        .catch(() => {
          EventBus.$emit(
            'show-error-notification-short',
            'Cannot Get Requests, Try again later'
          )
        })
    },
    closeRequest(requestId) {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/')
      }

      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      const variables = {
        id: requestId
      }
      client
        .request(deleteRequest, variables)
        .then(() => {
          EventBus.$emit(
            'show-success-notification-short',
            'Successfully Closed!'
          )
          this.getAllRequests()
        })
        .catch(() => {
          EventBus.$emit(
            'show-error-notification-short',
            'Cannot Delete, Try again later'
          )
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.request-card {
  margin: 1rem;
  @media screen and (max-width: 559px) {
    width: 100%;
  }
}

.request-container {
  margin: 0px;
  @media screen and (max-width: 959px) {
    padding-bottom: 15rem;
  }
}
</style>
