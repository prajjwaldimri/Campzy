<template lang="pug">
  v-card
    v-card-title
      span.headline Add Camp
    v-card-text
      v-text-field(v-model="camp.name" label="Camp Name" prepend-icon="subject" clearable
      data-vv-name="campName" v-validate="'min:4|required|alpha_spaces'"
      :error-messages="errors.collect('campName')")

      v-text-field(v-model="camp.location" label="Location"
      prepend-icon="edit_location" clearable  data-vv-name="campLocation"
      v-validate="'min:4|required'" :error-messages="errors.collect('campLocation')")

      v-text-field(v-model="url" label="Url" prepend-icon="link" clearable
       data-vv-name="url" v-validate="'min:4|required|alpha_dash'"
      :error-messages="errors.collect('url')")

      v-text-field(v-model="camp.phoneNumber" label="Phone Number" prepend-icon="phone"
      clearable  data-vv-name="campPhone" v-validate="'digits:10|required'" type="number"
      :error-messages="errors.collect('campPhone')")

      v-text-field(v-model="camp.email" label="Email" type="email" prepend-icon="email"
      clearable  data-vv-name="campEmail" v-validate="'min:4|required|email'"
      :error-messages="errors.collect('campEmail')")

      v-combobox(v-model="camp.tags" label="Tags" prepend-icon="filter_list" clearable chips
        multiple hint="Used in searches")
        template(slot="selection" slot-scope="data")
          v-chip(close label)
            span {{data.item}}
      v-flex.d-flex(align-center)
        v-autocomplete(label="Owner" prepend-icon="account_box"
        v-model="camp.owner" :loading="isOwnerFieldLoading" :disabled="isOwnerSelected"
        hint="Start typing to search users" :search-input.sync="searchUsers"
        :items="searchedUsers" cache-items item-text="name" item-value="id")
          template(slot="item" slot-scope="data")
            v-list-tile-content
              v-list-tile-title {{data.item.name}}
              v-list-tile-sub-title {{data.item.email}}
        v-tooltip(bottom)
          v-btn(small slot="activator" flat @click="camp.owner=null; isOwnerSelected=false")
            v-icon clear
          span Remove the assigned owner
    v-card-actions
      v-spacer
      v-btn(color="grey darken-1" flat @click.native="closeDialog")
        | Cancel
      v-btn(color="green" @click.native="saveCamp").white--text Save

</template>

<script>
import { GraphQLClient, request } from 'graphql-request';
import { isCampUrlAvailable } from '../../../../queries/queries';
import { EventBus } from '../../../../event-bus';

export default {
  name: 'addCamp',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      camp: {},
      url: '',
      searchedUsers: [],
      isOwnerFieldLoading: false,
      isOwnerSelected: false,
      searchUsers: null,
    };
  },
  methods: {
    closeDialog() {
      EventBus.$emit('admin-close-add-camp-dialog');
    },
    saveCamp() {
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          if (!this.$cookie.get('sessionToken')) {
            this.$router.push('/');
          }
          if (!this.camp || !isValid) {
            return;
          }
          this.isOwnerFieldLoading = true;
          const addCampsQuery = `mutation addCamp($tags: [String]!, $name: String!, $phoneNumber: String!,
        $email: String!, $location: String!, $url: String!, $ownerId: String!){
          addCamp(tags: $tags, name: $name, phoneNumber: $phoneNumber,
          email: $email, location: $location, url: $url, ownerId: $ownerId){
            id,
          }
        }`;
          const variables = {
            tags: this.camp.tags,
            name: this.camp.name,
            phoneNumber: this.camp.phoneNumber,
            email: this.camp.email,
            location: this.camp.location,
            url: this.camp.url,
            ownerId: this.camp.owner,
          };
          const client = new GraphQLClient('/graphql', {
            headers: {
              Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
            },
          });
          client.request(addCampsQuery, variables).then(() => {
            this.camp = {};
            this.isOwnerSelected = false;
          }).catch((err) => {
            EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
          }).finally(() => {
            this.closeDialog();
            this.isOwnerFieldLoading = false;
          });
        }
      });
    },


  },
  watch: {
    camp(val) {
      if (val.owner && val.owner.length > 1) {
        this.isOwnerSelected = true;
      }
    },
    searchUsers() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      if (!this.searchUsers) {
        return;
      }
      this.isOwnerFieldLoading = true;
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
      }).catch(() => {
        this.searchedUsers = [];
      }).finally(() => { this.isOwnerFieldLoading = false; });
    },
    url(value) {
      console.log(typeof value);
      const variables = {
        url: value,
      };
      request('/graphql', isCampUrlAvailable, variables).then((data) => {
        console.log(data);
        // this.isEmailAlreadyinUse = false;
      }).catch((err) => {
        console.log(err);
        if (err) {
          EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
        }
        // this.isEmailAlreadyinUse = true;
      });
    },
  },
};
</script>
