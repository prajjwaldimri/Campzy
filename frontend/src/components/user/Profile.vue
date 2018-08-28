<template lang="pug">
  div
    navbar
    .d-flex.full-height
      v-navigation-drawer(hide-overlay v-model="drawer" app clipped mini-variant
      permanent stateless).side-nav.grey.darken-4.hidden-sm-and-down
        v-toolbar(flat).transparent.mt-3
          v-list.pa-0
            v-divider(inset)
            v-list-tile(avatar)
              v-list-tile-avatar(tile)
                img(v-if="userProfileImage" :src="userProfileImage")
        v-list.pt-4
          v-list-tile
            v-list-tile-action
              v-btn(dark flat)
                v-icon event
        v-list.pt-0.mt-0
          v-list-tile
            v-list-tile-action
              v-btn(dark flat)
                v-icon receipt
        v-list.pt-0.mt-0
          v-list-tile
            v-list-tile-action
              v-btn(dark flat)
                v-icon credit_card
        v-list.pt-0.mt-0
          v-list-tile
            v-list-tile-action
              v-btn(dark flat @click="$router.push('/profile/settings')")
                v-icon settings
        v-list.pt-0.mt-0
          v-list-tile
            v-list-tile-action
              v-btn(dark flat color="red" @click="logout")
                v-icon exit_to_app


      router-view


    v-bottom-nav(:value="true" :active.sync="bottomNav" color="grey darken-4"
     fixed).hidden-md-and-up
      v-btn(dark)
        v-icon event
      v-btn(dark)
        v-icon receipt
      v-btn(dark)
        v-icon credit_card
      v-btn(dark)
        v-icon settings

</template>

<script>
import { GraphQLClient } from 'graphql-request';
import navbar from '../Navbar.vue';

import { EventBus } from '../../event-bus';

export default {
  name: 'Profile',
  data() {
    return {
      drawer: true,
      userProfileImage: '',
      userName: '',
      bottomNav: 0,
    };
  },
  components: {
    navbar,
  },
  mounted() {
    if (!this.$cookie.get('sessionToken')) {
      this.$router.push({ name: 'login' });
      EventBus.$emit('show-error-notification-short', 'Please Login First');
    } else {
      this.getProfileImage();
    }
  },
  methods: {
    getProfileImage() {
      const query = `{currentUser {
        name,
      }}`;
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(query)
        .then((data) => {
          this.userName = data.currentUser.name;
          if (this.userName === null) {
            this.userName = 'Unnamed User';
          }
          this.userProfileImage = `https://ui-avatars.com/api/?size=256&name=${this.userName}`;
        });
    },
    logout() {
      this.$cookie.delete('sessionToken');
      this.$router.push('/login');
    },
  },
};
</script>

<style lang="scss" scoped>
.full-height {
  height: 100vh;
}

.side-nav {
}
</style>
