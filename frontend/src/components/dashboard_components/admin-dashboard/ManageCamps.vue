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
        v-dialog(v-model="addCampDialog" persistent max-width="500px")
          v-btn(color="green" slot="activator").white--text Add New Camp
            v-icon(right dark) add_box
          addCamp
        editCamp

    v-layout(row)
      v-data-table(:headers="headers" :items="camps" style="width: 100%" hide-actions
      must-sort).elevation-1
        template(slot="items" slot-scope="props")
          td {{props.item.id}}
          td.font-weight-bold {{props.item.name}}
          td {{props.item.owner.name}}
          td {{props.item.phoneNumber}}
          td {{props.item.location}}
          td {{props.item.creationDate}}
          td.align-center
            v-icon(small @click="editCamp(props.item.id)").mr-2 edit
            v-icon(small @click="deleteDialog=true") delete
</template>

<script>
import { GraphQLClient } from 'graphql-request';
import AddCamp from './ManageCamps/AddCamp.vue';
import EditCamp from './ManageCamps/EditCamp.vue';
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

    // Get All Camps
    this.getAllCamps();
  },
  methods: {
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
      client.request(getCampsQuery).then((data) => {
        this.camps = data.allCamps;
      }).catch((err) => {
        console.log(err);
      });
    },
    editCamp(id) {
      EventBus.$emit('admin-open-edit-camp', id);
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
