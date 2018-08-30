<template lang="pug">
  v-container(grid-list-lg).camps-container
    v-dialog(v-model="deleteDialog" max-width="500px")
      v-card
        v-card-title
          span.headline.orange--text Are you absolutely sure?
        v-card-text
          span.subheading This action cannot be undone. This will permanently delete all records of
          span.title.font-weight-black  {{deleteCampName}}
          span.subheading  from the database. Please type in the camp name to confirm!
        v-card-actions(style="flex-direction: column").d-flex
          v-text-field(label="Camp Name" v-model="deleteCampNameConfirmation")
          v-btn(block @click="deleteCamp").increase-letter-spacing-1.red--text I understand the
            | consequences, delete {{deleteCampName}}


    v-layout(row)
      h1.font-weight-light.pl-2.pb-3 Camps
    v-layout(row)
      v-flex(sm5)
        v-text-field(solo label="Search" append-icon="search")

      v-flex(sm3 offset-sm4 align-content-start justify-center).d-flex
        v-dialog(v-model="addCampDialog" persistent max-width="500px")
          v-btn(color="green" slot="activator").white--text Add New Camp
            v-icon(right dark) add_box
          addCamp
        editCamp

    v-layout(row)
      v-data-table(:headers="headers" :items="camps" style="width: 100%" hide-actions
      must-sort :loading="isTableLoading").elevation-1
        template(slot="items" slot-scope="props")
          td {{props.item.id}}
          td.font-weight-bold {{props.item.name}}
          td {{props.item.owner.name}}
          td {{props.item.phoneNumber}}
          td {{props.item.location}}
          td {{props.item.creationDate}}
          td.align-center
            v-icon(small @click="editCamp(props.item.id)") edit
            v-icon(small @click="showDeleteDialog(props.item.id, props.item.name)") delete
    v-pagination(v-model='page' :length='pageLength' :total-visible='4' )
</template>

<script>
import { GraphQLClient } from 'graphql-request';
import AddCamp from './CampsManager/AddCamp.vue';
import EditCamp from './CampsManager/EditCamp.vue';
import { EventBus } from '../../../event-bus';

export default {
  components: {
    addCamp: AddCamp,
    editCamp: EditCamp,
  },
  data() {
    return {
      headers: [
        {
          text: 'Client Id',
          value: 'id',
        },
        {
          text: 'Camp Name',
          value: 'name',
        },
        { text: 'Camp Owner', value: 'owner.name' },
        { text: 'Phone Number', value: 'phoneNumber' },
        { text: 'Camp Location', value: 'location' },
        { text: 'Creation Date', value: 'creationDate' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      camps: [],
      deleteDialog: false,
      addCampDialog: false,
      deleteCampId: null,
      deleteCampName: '',
      deleteCampNameConfirmation: null,
      isTableLoading: false,
      page: 1,
      pageLength: 1,
    };
  },
  mounted() {
    EventBus.$on('admin-close-add-camp-dialog', () => {
      this.addCampDialog = false;
      this.getAllCamps();
    });
    EventBus.$on('admin-close-edit-camp-dialog', () => {
      this.editCampDialog = false;
      this.getAllCamps();
    });

    EventBus.$on('admin-refresh-all-camps', () => {
      this.getAllCamps();
    });

    this.getAllCamps();
  },
  methods: {
    // getAllCampsLength() {

    // },

    getAllCamps() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const getCampsQuery = `query allCamps {
          allCamps {
            id,
            tags,
            name,
            phoneNumber,
            email,
            location,
            url,
            owner {
              name
            }
          }
        }`;
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      this.isTableLoading = true;
      client.request(getCampsQuery).then((data) => {
        this.camps = data.allCamps;
      }).catch((err) => {
        EventBus.$emit('error', err.response.errors[0].message);
      }).finally(() => { this.isTableLoading = false; });
    },
    editCamp(id) {
      EventBus.$emit('admin-open-edit-camp', id);
    },
    showDeleteDialog(id, name) {
      this.deleteDialog = true;
      this.deleteCampName = name;
      this.deleteCampId = id;
    },
    deleteCamp() {
      if (this.deleteCampName === this.deleteCampNameConfirmation) {
        if (!this.$cookie.get('sessionToken')) {
          this.$router.push('/');
        }
        if (!this.deleteCampId) {
          return;
        }
        const deleteCampQuery = `mutation deleteCamp($id: String!){
          deleteCamp(id: $id){
            id,
          }
        }`;
        const variables = {
          id: this.deleteCampId,
        };
        const client = new GraphQLClient('/graphql', {
          headers: {
            Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
          },
        });
        client.request(deleteCampQuery, variables).then(() => {
          EventBus.$emit('success', 'Successfully Deleted');
        }).catch((err) => {
          EventBus.$emit('error', err.response.errors[0].message);
        }).finally(() => {
          this.deleteDialog = false;
          this.getAllCamps();
        });
      } else {
        EventBus.$emit('error', 'Wrong Confirmation Name');
        this.deleteDialog = false;
      }
    },

    goToCampDetail(campId) {
      this.$router.push(`/dashboard/viewCamp/${campId}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.camps-container {
  @media screen and (min-width: 960px) {
    padding: 5rem;
  }
  height: 100%;
}
</style>
