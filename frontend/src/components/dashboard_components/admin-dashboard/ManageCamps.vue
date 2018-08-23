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
        v-dialog(v-model="modifyCampDialog" persistent max-width="500px")
          v-btn(color="green" slot="activator").white--text Add New Camp
            v-icon(right dark) add_box
          addCamp

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
            v-dialog(v-model="modifyCampDialog" persistent max-width="500px")
              v-icon(small slot="activator").mr-2 edit
            v-icon(small @click="deleteDialog=true") delete
</template>

<script>
// import { GraphQLClient } from 'graphql-request';
import AddCamp from './ManageCamps/AddCamp.vue';
import { EventBus } from '../../../event-bus';

export default {
  components: {
    addCamp: AddCamp,
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
      modifyCampDialog: false,
    };
  },
  mounted() {
    EventBus.$on('close-add-camp-dialog', () => {
      this.modifyCampDialog = false;
    });
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
