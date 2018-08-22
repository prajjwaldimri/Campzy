<template lang="pug">
  div
    navbar
    v-container.display
      v-navigation-drawer(:mini-variant.sync="mini" v-model="drawer" hide-overlay style="box-shadow: 1px 0px 15px 0px #888888;")
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
            v-list-tile-content Add Camps
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
      router-view.router-display


</template>
<script>
import navbar from './Navbar.vue';

export default {
  name: 'Dashboard',
  components: {
    navbar,
  },
  data() {
    return {
      drawer: true,
      mini: true,
      right: null,
    };
  },
};
</script>
<style lang="scss" scoped>
.display {
  margin: 4.6rem 0px 0px 0px;
  padding: 0px;
  display: flex;
}
.router-display {
  margin: 0 0 0 1rem;
}
</style>
