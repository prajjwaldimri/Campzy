<template lang="pug">
  v-container.inventory-container
    v-layout(row)
      h1.font-weight-light.pl-2.pb-3 Inventory
    v-layout(row)
      v-flex(sm5)
        v-text-field(solo label="Search" append-icon="search")

      v-flex(sm3 offset-sm4 align-content-start justify-center).d-flex
        v-dialog(v-model="addTentDialog" persistent max-width="500px")
          v-btn(color="green" slot="activator").white--text Add Tent
            v-icon(right dark) add_box
          addTent
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
            v-icon(small @click="editCamp(props.item.id)").mr-2 edit
            v-icon(small @click="showDeleteDialog(props.item.id, props.item.name)") delete
</template>

<script>
import AddTent from './TentManager/AddTent.vue';

export default {
  components: {
    addTent: AddTent,
  },

  data() {
    return {
      headers: [
        {
          text: 'Tent Id',
          value: 'id',
        },
        {
          text: 'Tent Type',
          value: 'name',
        },
        { text: 'Tent Capacity', value: 'owner.name' },
        { text: 'Booking Price', value: 'phoneNumber' },
        { text: 'Surged Price', value: 'location' },
        { text: 'Pre Book Time', value: 'owner.name' },
        { text: 'Booked By', value: 'creationDate' },
        { text: 'Is Booked', value: 'actions', sortable: false },
      ],
      camps: [],
      addTentDialog: false,
      isTableLoading: false,
    };
  },
};
</script>


<style lang="scss" scoped>
.inventory-container {
  @media screen and (min-width: 960px) {
    padding: 5rem;
  }
  height: 100%;
}
</style>
