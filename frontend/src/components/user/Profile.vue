<template lang="pug">
  div
    navbar
    v-tabs(dark icons-and-text grow centered style="width:100%")
      v-tabs-slider(color="green")
      v-tab(href="#tab-1")
        | Recent Bookings
        v-icon event
      v-tab(href="#tab-2")
        | Past Bookings
        v-icon receipt
      v-tab(href="#tab-3")
        | Billings
        v-icon credit_card
      v-tab(href="#tab-4" @click="$router.push('/profile/settings')")
        | Settings
        v-icon settings

    router-view


    v-bottom-nav(:value="true" :active.sync="bottomNav" color="grey darken-4"
     fixed).hidden-md-and-up
      v-btn(dark)
        v-icon event
      v-btn(dark)
        v-icon receipt
      v-btn(dark)
        v-icon credit_card
      v-btn(dark @click="$router.push('/profile/settings')")
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

.v-tabs__slider {
  height: 5px;
}
</style>
