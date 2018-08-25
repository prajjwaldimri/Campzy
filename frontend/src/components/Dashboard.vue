<template lang="pug">
  div
    v-container.display(fluid)
      v-navigation-drawer.side-drawer.hidden-sm-and-down(:mini-variant.sync="mini" dark v-model="drawer" hide-overlay)
        v-list.pt-4
          v-list-tile
            v-list-tile-content.center-item
              router-link.link-text(to='/')
                h1.font-weight-light
                  span Camp
                  span.green--text zy
        v-list.pt-3
          v-list-tile(avatar)
            v-list-tile-avatar
              img(src="https://randomuser.me/api/portraits/men/85.jpg")
            v-list-tile-content
              v-list-tile-title.increase-letter-spacing-2 {{user.name}}
            v-list-tile-action
              v-btn(icon @click.stop='mini=!mini')
                v-icon chevron_left
        v-list.pt-5(dense)
          v-list-tile.pt-3(@click='userManagement')
            v-list-tile-action
              v-icon wc
            v-list-tile-content.increase-letter-spacing-1 User Management
          v-list-tile.pt-3(@click='campManagement')
            v-list-tile-action
              v-icon beach_access
            v-list-tile-content.increase-letter-spacing-1 Camp Management
          v-list-tile.pt-3(@click='campDetails')
            v-list-tile-action
              v-icon add
            v-list-tile-content.increase-letter-spacing-1 Camp Details
          v-list-tile.pt-3(@click='campInventory')
            v-list-tile-action
              v-icon add
            v-list-tile-content.increase-letter-spacing-1 Inventory
          v-list-tile.pt-3(@click='')
            v-list-tile-action
              v-icon add
            v-list-tile-content.increase-letter-spacing-1 Pricing
          v-list-tile.pt-5
            v-list-tile-content.center-item
              v-btn(flat color='green accent-4' large @click='signOut' :loading='load') Sign Out
      router-view.router-display
      v-bottom-nav.theme--dark.hidden-md-and-up( :value="true" absolute shift )
        v-btn
          span User Management
          v-icon wc
        v-btn
          span Camp Management
          v-icon beach_access
        v-btn
          span Camps
          v-icon room_service
        v-btn
          span Inventory
          v-icon add

</template>
<script>
import { GraphQLClient } from 'graphql-request';

export default {
  name: 'Dashboard',
  data() {
    return {
      drawer: true,
      mini: false,
      right: null,
      load: false,
      user: {},
    };
  },
  mounted() {
    this.getCurrentUser();
  },
  methods: {
    goHomePage() { this.$router.push('/'); },
    campDetails() { this.$router.push('/dashboard/campDetails'); },
    userManagement() { this.$router.push('/dashboard/userManagement'); },
    campInventory() { this.$router.push('/dashboard/campInventory'); },
    campManagement() { this.$router.push('/dashboard/campManagement'); },

    signOut() {
      this.load = true;
      this.$cookie.delete('sessionToken');
      this.$router.push('login');
      this.signOutfail = true;
    },

    getCurrentUser() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/login');
      }
      const query = `{currentUser {
        name,
        email
      }}`;
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(query)
        .then((data) => {
          this.user = data.currentUser;
          this.isLoggedIn = true;
          if (this.user.name === null) {
            this.user.name = 'Unnamed User';
          }
        })
        .catch(() => { this.user = {}; this.isLoggedIn = false; });
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
  font-size: 1.5rem;
  text-decoration: none;
  color: #fff;
}
</style>
