<template lang="pug">
  div
    v-container.display(fluid)
      v-navigation-drawer.side-drawer.hidden-sm-and-down(:mini-variant.sync="mini" dark
      v-model="drawer" hide-overlay)
        .d-flex.content-justify
          v-container.side-container(fluid)
            v-list.pt-4
              v-list-tile
                v-list-tile-content.center-item
                  router-link.link-text(to='/')
                    h1.font-weight-light
                      span Camp
                      span.green--text zy
          v-container.side-container(fluid)
            v-list.pt-3
              v-list-tile(avatar)
                v-list-tile-avatar
                  img(src="https://randomuser.me/api/portraits/men/85.jpg")
                v-list-tile-content
                  v-list-tile-title.increase-letter-spacing-2 {{user.name}}
          v-container.side-container(fluid)
            v-list.pt-5(dense)
              v-list-tile.pt-3(@click="$router.push('/dashboard/userManagement')" v-show='isAdmin')
                v-list-tile-action
                  v-icon supervised_user_circle
                v-list-tile-content.increase-letter-spacing-1 User Management
              v-list-tile.pt-3(@click="$router.push('/dashboard/campManagement')" v-show='isAdmin')
                v-list-tile-action
                  v-icon explore
                v-list-tile-content.increase-letter-spacing-1 Camp Management
              v-list-tile.pt-3(@click="$router.push('/dashboard/campDetails')")
                v-list-tile-action
                  v-icon details
                v-list-tile-content.increase-letter-spacing-1 Camp Details
              v-list-tile.pt-3(@click="$router.push('/dashboard/campInventory')"
              v-show='isCampOwner')
                v-list-tile-action
                  v-icon local_grocery_store
                v-list-tile-content.increase-letter-spacing-1 Inventory
          v-container.side-container(fluid)
            v-list(dense)
              v-list-tile.pt-3(@click='signOut')
                v-list-tile-action
                  v-icon(color='red') exit_to_app
                v-list-tile-content.increase-letter-spacing-1.red--text Sign Out
              v-list-tile(v-show='isDrawerOpen')
                v-list-tile-action
                  v-btn(icon @click.stop='mini=!mini; isDrawerOpen=false')
                    v-icon chevron_left
                v-list-tile-content.increase-letter-spacing-1 Close Drawer
              v-list-tile(v-show='!isDrawerOpen')
                v-list-tile-action
                  v-btn(icon @click.stop='mini=!mini; isDrawerOpen=true')
                    v-icon chevron_right
      router-view.router-display
      v-bottom-nav(:value="true" :active.sync="bottomNav" color="grey darken-4"
     fixed shift).hidden-md-and-up
        v-btn(dark @click="$router.push('/dashboard/userManagement')" v-show='isAdmin')
          span User Management
          v-icon supervised_user_circle
        v-btn(dark @click="$router.push('/dashboard/userManagement')" v-show='isCampOwner')
          span Camp Details
          v-icon details
        v-btn(dark @click="$router.push('/dashboard/campManagement')" v-show='isAdmin')
          span Camp Management
          v-icon explore
        v-btn(dark @click="$router.push('/dashboard/campManagement')" v-show='isCampOwner')
          span Camp Inventory
          v-icon add_shopping_cart
        v-btn(dark @click='signOut')
          span Sign Out
          v-icon(style="color: red") exit_to_app

</template>
<script>
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../event-bus';

export default {
  name: 'Dashboard',
  data() {
    return {
      drawer: true,
      mini: false,
      right: null,
      load: false,
      user: {},
      isCampOwner: false,
      isAdmin: false,
      isDrawerOpen: true,
      bottomNav: 0,
    };
  },
  mounted() {
    this.getCurrentUser();
  },
  methods: {

    signOut() {
      this.$cookie.delete('sessionToken');
      this.$router.push('/login');
    },

    getCurrentUser() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/login');
      }
      const query = `{currentUser {
        name,
        type,
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
          if (this.user.type !== 'Admin' && this.user.type !== 'CampOwner') {
            this.$router.push('login');
            EventBus.$emit('show-error-notification-short', 'You ara not Previledge for this action');
          }
          if (this.user.type === 'CampOwner') {
            this.isCampOwner = true;
          }
          if (this.user.type === 'Admin') {
            this.isAdmin = true;
          }
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
  box-shadow: none !important;
}
.center-item {
  align-items: center;
}
.link-text {
  font-size: 1.5rem;
  text-decoration: none;
  color: #fff;
}
.content-justify {
  flex-direction: column;
  height: 100%;
  justify-content: space-around;
  padding: 0;
}

.side-container {
  padding: 0;
}
</style>
