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
      v-btn(color="green" @click.native="createBlogger").white--text Save

</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../../../../event-bus';
import { addBloggerQuery } from '../../../../queries/mutationQueries';

export default {
  name: 'addBlogger',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      searchedUsers: [],
      searchUsers: null,
      selectedBlogger: {},
      isBloggerFieldLoading: false,
      isBloggerSelected: false,
    };
  },

  methods: {
    closeDialog() {
      EventBus.$emit('admin-close-add-blogger-dialog');
    },

    createBlogger() {
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          if (!this.$cookie.get('sessionToken')) {
            this.$router.push('/');
          }
          const client = new GraphQLClient('/graphql', {
            headers: {
              Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
            },
          });
          const variables = {
            bloggerId: this.selectedBlogger,
          };
          client.request(addBloggerQuery, variables).then((data) => {
            console.log(data);
          }).catch((err) => {
            console.log(err);
            // EventBus.$emit('error', err.response.errors[0].message);
          });
        }
      });
    },

  },

  watch: {
    selectedBlogger(val) {
      if (val && val.length > 1) {
        this.isBloggerSelected = true;
      }
    },
    searchUsers() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      if (!this.searchUsers) {
        return;
      }
      this.isBloggerFieldLoading = true;
      const searchQuery = `query searchUser($searchTerm: String!){
        searchUser(searchTerm: $searchTerm){
          id,
          name,
          email
        }
      }`;
      const variables = {
        searchTerm: this.searchUsers,
      };
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      client.request(searchQuery, variables).then((data) => {
        this.searchedUsers = data.searchUser;
        console.log(this.selectedBlogger);
      }).catch(() => {
        this.searchedUsers = [];
      }).finally(() => { this.isBloggerFieldLoading = false; });
    },
  },
};
</script>
