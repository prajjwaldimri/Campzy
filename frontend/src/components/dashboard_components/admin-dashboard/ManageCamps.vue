<template lang="pug">
  v-container(grid-list-lg).camps-container
    v-dialog(v-model="deleteDialog" max-width="500px")
      v-card
        v-card-title
          span.headline.orange--text Are you absolutely sure?
        v-card-text
          span.subheading This action cannot be undone. This will permanently delete all records of
            |  this camp from the database. Please type in the camp name to confirm!
        v-card-actions(style="flex-direction: column").d-flex
          v-text-field(label="Camp Name")
          v-btn(block).increase-letter-spacing-1.red--text I understand the consequences,
            | delete this camp


    v-layout(row)
      h1.font-weight-light.pl-2.pb-3 Camps
    v-layout(row)
      v-flex(sm5)
        v-text-field(solo label="Search" append-icon="search")

      v-flex(sm3 offset-sm4 align-content-start justify-center).d-flex
        v-dialog(v-model="modifyCampDialog.isVisible" persistent max-width="500px")
          v-btn(color="green" slot="activator").white--text Add New Camp
            v-icon(right dark) add_box
          v-card
            v-card-title
              span.headline {{modifyCampDialog.headline}}
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
              v-btn(color="grey darken-1" flat @click.native="modifyCampDialog.isVisible=false")
                | Cancel
              v-btn(color="green" @click.native="saveCamp").white--text Save

    v-layout(row)
      v-data-table(:headers="headers" :items="camps" style="width: 100%" hide-actions
      must-sort).elevation-1
        template(slot="items" slot-scope="props")
          td {{props.item.id}}
          td.font-weight-bold {{props.item.name}}
          td {{props.item.owner}}
          td {{props.item.location}}
          td {{props.item.creationDate}}
          td.align-center
            v-icon(small).mr-2 edit
            v-icon(small @click="deleteDialog=true") delete
</template>

<script>
import { GraphQLClient } from 'graphql-request';

export default {
  data() {
    return {
      camp: {},
      searchedUsers: [],
      isOwnerFieldLoading: false,
      isOwnerSelected: false,
      searchUsers: null,
      headers: [
        {
          text: 'Client Id',
          value: 'id',
        },
        {
          text: 'Camp Name',
          value: 'name',
        },
        { text: 'Camp Owner', value: 'owner' },
        { text: 'Camp Location', value: 'location' },
        { text: 'Creation Date', value: 'creationDate' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      camps: [{
        name: 'Chopta Camp', id: '123123', owner: 'Tej Pal', creationDate: '02-Aug-2018',
      }, {
        name: 'Rishikesh Camp', id: '187873', owner: 'Ram Pal', creationDate: '10-Aug-2018',
      }],
      deleteDialog: false,
      modifyCampDialog: {
        isVisible: false,
        headline: 'Add a camp',
      },
    };
  },
  methods: {
    saveCamp() { },
  },
  watch: {
    camp(val) {
      if (val.owner.length > 1) {
        this.isOwnerSelected = true;
      }
    },
    searchUsers() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      if (!this.searchUsers || this.searchUsers.indexOf(' ') < 0) {
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

<style lang="scss" scoped>
.camps-container {
  padding: 5rem;
}
</style>
