<template lang="pug">
  div
    v-container.display(fluid)
      v-navigation-drawer.side-drawer(:mini-variant.sync="mini" dark v-model="drawer" hide-overlay)
        v-list.pt-4
          v-list-tile
            v-list-tile-content.center-item
              router-link.link-text(to='/')
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
          v-list-tile.pt-5
            v-list-tile-content.center-item
              v-btn(flat color='green accent-4' large @click='signOut' :loading='load') Sign Out
      router-view.router-display
    v-snackbar(v-model='signOutfail' top multi-line :timeout='timeout') Sign Out Fail


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
      mini: false,
      right: null,
      signOutfail: false,
      timeout: 6000,
      load: false,
    };
  },
  methods: {
    goHomePage() {
      this.$router.push('/');
    },

    signOut() {
      this.load = true;
      this.$cookie.delete('sessionToken');
      this.$router.push('login');
      this.signOutfail = true;
    },
  },


};
</script>
<style lang="scss" scoped>
.display {
  margin: 0px 0px 0px 0px;
  padding: 0px;
  display: flex;
  height: 100vh;
}
.router-display {
  width: 100%;
}
.side-drawer {
  border-right: 1px sloid;
}
.center-item {
  align-items: center;
}
.link-text {
  text-decoration: none;
  color: #fff;
}
</style>
