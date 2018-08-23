<template lang="pug">
  v-dialog(v-model="editCampDialog" persistent max-width="500px" v-if="editCampDialog")
    v-card
      v-card-title
        span.headline Edit Camp
      v-card-text
        v-text-field(v-model="camp.name" label="Camp Name" prepend-icon="subject" clearable)
        v-text-field(v-model="camp.location" label="Location"
        prepend-icon="edit_location" clearable)
        v-text-field(v-model="camp.url" label="Url" prepend-icon="link" clearable)
        v-text-field(v-model="camp.phoneNumber" label="Phone Number" prepend-icon="phone"
        clearable)
        v-text-field(v-model="camp.email" label="Email" type="email" prepend-icon="email"
        clearable)
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
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../../../../event-bus';

export default {
  data() {
    return {
      camp: {},
      campId: '',
      searchedUsers: [],
      isOwnerFieldLoading: false,
      isOwnerSelected: false,
      searchUsers: null,
      editCampDialog: false,
    };
  },
  mounted() {
    EventBus.$on('admin-open-edit-camp', (id) => {
      this.campId = id;
      this.editCampDialog = true;
      this.getCamp();
    });
  },
  methods: {
    closeDialog() {
      this.editCampDialog = false;
      EventBus.$emit('admin-refresh-all-camps');
    },
    getCamp() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      if (!this.campId || this.campId === '') {
        return;
      }
      const getCampQuery = `query camp($id: String!){
          camp(id: $id){
            id,
            tags,
            name,
            phoneNumber,
            email,
            location,
            url,
            owner {
              id,
              name,
              email
            }
          }
        }`;
      const variables = {
        id: this.campId,
      };
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      client.request(getCampQuery, variables).then((data) => {
        this.camp = data.camp;
        this.camp.owner = data.camp.owner.id;
        this.searchedUsers.push(data.camp.owner);
      }).catch((err) => {
        console.log(err);
      });
    },
    saveCamp() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      if (!this.camp) {
        return;
      }
      this.isOwnerFieldLoading = true;
      const updateCampsQuery = `mutation updateCamp($id: String!, $tags: [String]!, $name: String!, $phoneNumber: String!, $email: String!, $location: String!, $url: String!, $ownerId: String!){
          updateCamp(id: $id, tags: $tags, name: $name, phoneNumber: $phoneNumber,
          email: $email, location: $location, url: $url, ownerId: $ownerId){
            id,
          }
        }`;
      const variables = {
        id: this.campId,
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
      client.request(updateCampsQuery, variables).then(() => {
        EventBus.$emit('success', 'Successfully Updated');
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        this.closeDialog();
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
  },
};
</script>
