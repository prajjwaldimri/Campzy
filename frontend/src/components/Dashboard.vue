<template lang="pug">
  div
    v-container.display
      v-navigation-drawer.side-drawer(:mini-variant.sync="mini" color='transparent' style="background-color:#fafafa" v-model="drawer" hide-overlay)
        v-list.pt-4
          v-list-tile(@click='goHomePage')
            v-list-tile-content.logo
              h1
                span Camp
                span.green--text zy
        v-list.pt-3
          v-list-tile(avatar)
            v-list-tile-avatar
              img(src='https://randomuser.me/api/portraits/men/85.jpg')
            v-list-tile-content
              v-list-tile-title Ayush Bahuguna
            v-list-tile-action
              v-btn(icon @click.stop='mini=!mini')
                v-icon chevron_left
        v-list.pt-5(dense)
          v-list-tile.pt-3(@click='')
            v-list-tile-action
              v-icon wc
            v-list-tile-content User Management
          v-list-tile.pt-3(@click='')
            v-list-tile-action
              v-icon beach_access
            v-list-tile-content Camp Management
          v-list-tile.pt-3(@click='')
            v-list-tile-action
              v-icon room_service
            v-list-tile-content Camps
          v-list-tile.pt-3(@click='')
            v-list-tile-action
              v-icon add
            v-list-tile-content Camp Details
          v-list-tile.pt-3(@click='')
            v-list-tile-action
              v-icon add
            v-list-tile-content Inventory
          v-list-tile.pt-3(@click='')
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
  methods: {
    goHomePage() {
      this.$router.push('/');
    },
  },
};
</script>
<style lang="scss" scoped>
.display {
  margin: 0px 0px 0px 0px;
  padding: 0px;
  display: flex;
}
.router-display {
  margin: 0 0 0 1rem;
}
.side-drawer {
  border-right: 1px sloid;
}
.logo {
  align-items: center;
}
</style>
