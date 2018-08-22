<template lang="pug">
  div
    v-navigation-drawer(:mini-variant.sync="mini" v-model="drawer" hide-overlay)
      v-toolbar(flat)
        v-list.pa-0
          v-list-tile(avatar)
            v-list-tile-avatar
              img(src='https://randomuser.me/api/portraits/men/85.jpg')
            v-list-tile-content
              v-list-tile-title Ayush Bahuguna
            v-list-tile-action
              v-btn(icon @click.stop='mini=!mini')
                v-icon chevron_left
      v-list.pt-0(dense)
        v-divider
        v-list-tile
          v-list-tile-action
            v-icon add
          v-list-tile-content User Management
        v-divider
        v-list-tile
          v-list-tile-action
            v-icon add
          v-list-tile-content Camp Management
        v-divider
        v-list-tile
          v-list-tile-action
            v-icon add
          v-list-tile-content Camp Details
        v-divider
        v-list-tile
          v-list-tile-action
            v-icon add
          v-list-tile-content Inventory
        v-divider
        v-list-tile
          v-list-tile-action
            v-icon add
          v-list-tile-content Pricing


</template>
<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      drawer: true,
      mini: true,
      right: null,
    };
  },
};
</script>
