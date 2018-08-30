<template lang="pug">
  v-container(grid-list-lg).camps-container
    v-dialog(v-model="deleteDialog" max-width="500px")
      v-card
        v-card-title
          span.headline.orange--text Are you absolutely sure?
        v-card-text
          span.subheading This action cannot be undone. This will permanently delete all records of
          span.title.font-weight-black  {{deleteUserName}}
          span.subheading  from the database. Please type in the camp name to confirm!
        v-card-actions(style="flex-direction: column").d-flex
          v-text-field(label="User Name" v-model="deleteUserConfirmation")
          v-btn(block @click="").increase-letter-spacing-1.red--text I understand the
            | consequences, delete {{deleteUserName}}


    v-layout(row)
      h1.font-weight-light.pl-2.pb-3 All Users
    v-layout(row)
      v-flex(sm5)
        v-text-field(solo label="Search" append-icon="search")

    v-layout(row)
      v-data-table(:headers="headers" :items="users" style="width: 100%" hide-actions
      must-sort :loading="isTableLoading").elevation-1
        template(slot="items" slot-scope="props")
          td {{props.item.id}}
          td.font-weight-bold {{props.item.name}}
          td {{props.item.phoneNumber}}
          td.align-center
            v-icon(small @click="") delete
    v-container.pagination-container(fluid)
      v-pagination(v-model='page' :length='userPageLength'
       @input='getAllUsers(page)')
</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { getAllUsers, countAllUsers } from '../../../queries/queries';
import EventBus from '../../../event-bus';

export default {
  data() {
    return {
      headers: [
        {
          text: 'User Id',
          value: 'id',
        },
        {
          text: 'User Name',
          value: 'name',
        },
        { text: 'Phone Number', value: 'phoneNumber' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      users: [],
      deleteDialog: false,
      isTableLoading: false,
      deleteUserConfirmation: '',
      deleteUserName: '',
      page: 1,
      userPageLength: 1,
    };
  },


  mounted() {
    this.getAllUsers();
    this.getAllUsersLength();
  },
  methods: {
    getAllUsersLength() {
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      client.request(countAllUsers).then((data) => {
        this.userPageLength = Math.ceil((data.countUsers.count) / 8);
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      });
    },

    getAllUsers(pageNumber) {
      const variables = {
        page: pageNumber,
      };
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      this.isTableLoading = true;
      client.request(getAllUsers, variables).then((data) => {
        this.users = data.allUsers;
        this.isTableLoading = false;
      }).catch((err) => {
        this.isTableLoading = false;
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      });
    },
  },
};
</script>


<style lang="scss" scoped>
.camps-container {
  @media screen and (min-width: 960px) {
    padding: 2rem;
  }
  height: 100%;
}
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
