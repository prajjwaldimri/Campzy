<template lang="pug">
  #nav
    v-navigation-drawer.hidden-lg-only(:clipped-left="$vuetify.breakpoint.lgAndUp" v-model="drawer"  fixed app)
      v-toolbar.transparent(flat)
        v-list.pa-0
          v-list-tile(avatar)
            v-list-tile-avatar
              img(src='https://pbs.twimg.com/profile_images/688242296282730497/mx0W43W6_400x400.jpg')
            v-list-tile-content
              v-list-tile-title Sign in / Sing up
      v-list.pt-0(dense)
      v-divider
      v-list-tile
        v-list-tile-action
          i.fa.fa-home
        v-list-tile-content
          v-list-tile-title Home
      v-list-tile
        v-list-tile-action
          i.fa.fa-search
        v-list-tile-content
          v-list-tile-title Search
      v-list-tile
        v-list-tile-action
          i.fa.fa-info-circle
        v-list-tile-content
          v-list-tile-title About
      v-list-tile
        v-list-tile-action
          i.fa.fa-phone
        v-list-tile-content
          v-list-tile-title Contact
    v-toolbar(:clipped-left="$vuetify.breakpoint.lgAndUp" lights-out dark app fixed)
      v-toolbar-title
        v-toolbar-side-icon.pt-0.hidden-lg-only(@click.stop="drawer = !drawer")
        span.hidden-sm-and-down CAMPZY
      v-spacer
      v-toolbar-title
        span.hidden-md-and-up CAMPZY
      v-spacer
      v-toolbar-items.hidden-sm-and-down
        v-btn(flat @click='goHome') HOME
        v-btn(flat @click='goHome') ABOUT
        v-btn(size='32' @click='registerUser' flat)
          i.fas.fa-user-circle.fa-lg

</template>
<script>
// import gql from 'graphql-tag';

export default {
  data: () => ({
    drawer: null,
    valid: false,
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid',
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
    ],
  }),
  methods: {
    registerUser() {
      window.location.href = `${window.location.origin}/#/signIN`;
    },
    goHome() {
      window.location.href = `${window.location.origin}/#/`;
    },
  },
};
</script>
