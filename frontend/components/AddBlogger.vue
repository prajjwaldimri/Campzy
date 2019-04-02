<template lang="pug">
  v-card
    v-card-title
      span.headline Add Blogger
    v-card-text
      v-flex.d-flex(align-center)
        v-autocomplete(label="Blogger" prepend-icon="account_box"
        v-model="selectedBlogger" :loading="isBloggerFieldLoading" :disabled="isBloggerSelected"
        hint="Start typing to search users" :search-input.sync="searchUsers"
        :items="searchedUsers" cache-items item-text="name" item-value="id")
          template(slot="item" slot-scope="data")
            v-list-tile-content
              v-list-tile-title {{data.item.name}}
              v-list-tile-sub-title {{data.item.email}}
        v-tooltip(bottom)
          v-btn(small slot="activator" flat @click="selectedBlogger=null; isBloggerSelected=false")
            v-icon clear
          span Remove the assigned Blogger
    v-card-actions
      v-spacer
      v-btn(color="grey darken-1" flat @click.native="closeDialog")
        | Cancel
      v-btn(color="green" @click.native="createBlogger" :loading='addingBlogger').white--text Save

</template>

<script>
import { GraphQLClient } from 'graphql-request'
import { EventBus } from '../layouts/event-bus'
import { addBloggerQuery } from '../queries/mutationQueries'

export default {
  name: 'AddBlogger',
  $_veeValidate: {
    validator: 'new'
  },
  data() {
    return {
      searchedUsers: [],
      searchUsers: null,
      selectedBlogger: {},
      isBloggerFieldLoading: false,
      isBloggerSelected: false,
      addingBlogger: false
    }
  },

  watch: {
    selectedBlogger(val) {
      if (val && val.length > 1) {
        this.isBloggerSelected = true
      }
    },
    searchUsers() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/')
      }
      if (!this.searchUsers) {
        return
      }
      this.isBloggerFieldLoading = true
      const searchQuery = `query searchUser($searchTerm: String!){
        searchUser(searchTerm: $searchTerm){
          id,
          name,
          email
        }
      }`
      const variables = {
        searchTerm: this.searchUsers
      }
      const client = new GraphQLClient('https://api.campzy.in', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      client
        .request(searchQuery, variables)
        .then(data => {
          this.searchedUsers = data.searchUser
        })
        .catch(() => {
          this.searchedUsers = []
        })
        .finally(() => {
          this.isBloggerFieldLoading = false
        })
    }
  },

  methods: {
    closeDialog() {
      EventBus.$emit('admin-close-add-blogger-dialog')
    },

    createBlogger() {
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          if (!this.$cookie.get('sessionToken')) {
            this.$router.push('/')
          }
          this.addingBlogger = true
          const client = new GraphQLClient('https://api.campzy.in', {
            headers: {
              Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
            }
          })
          const variables = {
            bloggerId: this.selectedBlogger
          }
          client
            .request(addBloggerQuery, variables)
            .then(() => {
              EventBus.$emit('admin-close-add-blogger-dialog')
              EventBus.$emit(
                'show-success-notification-short',
                'Successfully Added'
              )
            })
            .catch(err => {
              EventBus.$emit(
                'show-error-notification-short',
                err.response.errors[0].message
              )
            })
            .finally(() => {
              this.addingBlogger = false
            })
        }
      })
    }
  }
}
</script>
