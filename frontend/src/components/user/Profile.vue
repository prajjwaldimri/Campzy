<template lang="pug">
  div
    navbar
    .d-flex.full-height.hidden-sm-and-down
      v-navigation-drawer(hide-overlay v-model="drawer" app clipped mini-variant
      permanent stateless).side-nav.grey.darken-4
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
              v-btn(dark flat)
                v-icon settings
        v-list.pt-0.mt-0
          v-list-tile
            v-list-tile-action
              v-btn(dark flat color="red")
                v-icon exit_to_app


      router-view
</template>

<script>
import { GraphQLClient } from 'graphql-request';
import navbar from '../Navbar.vue';

export default {
  name: 'Profile',
  data() {
    return {
      drawer: true,
      userProfileImage: '',
      userName: '',
    };
  },
  components: {
    navbar,
  },
  mounted() {
    this.getProfileImage();
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
