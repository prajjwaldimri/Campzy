<template lang="pug">
  v-toolbar(:clipped-left="$vuetify.breakpoint.lgAndUp" :absolute="absolute" flat
  prominent :color="color" :dark="dark" :app="app")
    v-toolbar-title.ml-0
      span Camp
      span.green--text zy
    v-spacer
    v-toolbar-items.hidden-sm-and-down
      v-btn(flat @click="$router.push('/')") HOME
      v-btn(flat @click="$router.push('/profile/billing')") WISH LIST
      v-btn(flat v-show="!isLoggedIn" to="/login") LOGIN/SIGNUP
      v-menu(offset-y  :close-on-content-click="false" :nudge-width="200")
        v-btn(flat slot="activator" v-show="isLoggedIn")
          | Hey, &nbsp; {{user.name}}
        v-card
          v-list
            v-list-tile(@click="$router.push('/profile')")
              v-list-tile-action
                v-icon settings
              v-list-tile-content
                v-list-tile-title Settings
            v-list-tile(v-show='isAdmin || isCampOwner || isBlogger' @click="$router.push('/dashboard')")
              v-list-tile-action
                v-icon work
              v-list-tile-content
                v-list-tile-title Dashboard
            v-list-tile(@click='signOut')
              v-list-tile-action
                v-icon directions_walk
              v-list-tile-content
                v-list-tile-title Sign out

    v-toolbar-items.hidden-md-and-up
      v-btn(icon @click="$router.push('/')")
        v-icon home
      v-btn(icon flat v-show="!isLoggedIn" to='/login')
          v-icon account_circle
      v-menu(offset-y  :close-on-content-click="false" :nudge-width="200")
        v-btn(icon flat v-show="isLoggedIn" slot='activator')
          v-icon account_circle
        v-card
          v-list
            v-list-tile(@click="$router.push('/profile')")
              v-list-tile-action
                v-icon settings
              v-list-tile-content
                v-list-tile-title Settings
            v-list-tile(v-show='isAdmin || isCampOwner || isBlogger' @click="$router.push('/dashboard')")
              v-list-tile-action
                v-icon work
              v-list-tile-content
                v-list-tile-title Dashboard
            v-list-tile(@click='signOut')
              v-list-tile-action
                v-icon directions_walk
              v-list-tile-content
                v-list-tile-title Sign out


</template>
<script>
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../event-bus';

export default {
  data: () => ({
    drawer: null,
    isLoggedIn: false,
    dropdown: false,
    user: {},
    isBlogger: false,
    isAdmin: false,
    isCampOwner: false,
  }),
  props: {
    color: String,
    app: Boolean,
    absolute: Boolean,
    dark: Boolean,
  },
  mounted() {
    if (!this.$cookie.get('sessionToken')) {
      this.isLoggedIn = false;
      return;
    }
    const query = `{currentUser {
        name,
        email,
        dateOfBirth,
        type,
      }}`;
    const client = new GraphQLClient('/graphql', {
      headers: {
        Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
      },
    });

    client.request(query)
      .then((data) => {
        this.user = data.currentUser;
        if (this.user.type === 'Admin') {
          this.isAdmin = true;
        }
        if (this.user.type === 'CampOwner') {
          this.isCampOwner = true;
        }
        if (this.user.type === 'Blogger') {
          this.isBlogger = true;
        }
        this.isLoggedIn = true;
        if (this.user.name === null) {
          this.user.name = 'Unnamed User';
        }
      })
      .catch(() => {
        this.user = {}; this.isLoggedIn = false;
      });
  },
  methods: {
    signOut() {
      this.$cookie.delete('sessionToken');
      if (this.$cookie.get('sessionToken') == null) {
        EventBus.$emit('show-success-notification-short', 'Logout Successful');
        this.$router.push('/login');
      } else {
        EventBus.$emit('show-error-notification-short', 'Failed to Logout');
      }
    },
  },
};
</script>
