<template lang="pug">
  v-container(grid-list-lg).camps-container
    v-layout(row)
      h1.font-weight-light.pl-2.pb-3 Camps
    v-layout(row)
      v-flex(sm5)
        v-text-field(solo label="Search" append-icon="search")
      v-flex(flat)
        v-btn(icon) 1
      v-flex(flat)
        v-btn(icon) 1

      v-flex(sm4 offset-sm1 align-content-start justify-center).d-flex
        v-btn(color="green").white--text Add New Camp
          v-icon(right dark) add_box
        v-btn(dark)
          v-icon delete

    v-layout(row)
      v-data-table(:headers="headers" :items="desserts" style="width: 100%").elevation-1
        template(slot="items" slot-scope="props")
          td {{props.item.name}}
          td {{props.item.calories}}
          td {{props.item.fat}}
          td {{props.item.carbs}}
          td {{props.item.protein}}
          td {{props.item.iron}}
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'left',
          sortable: false,
          value: 'name',
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
      ],
      desserts: [
        {
          value: false,
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%',
        },
        {
          value: false,
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%',
        }],
    };
  },
};
</script>

<style lang="scss" scoped>
.camps-container {
  padding: 5rem;
}
</style>
