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
    v-toolbar(:clipped-left="$vuetify.breakpoint.lgAndUp" color="blue darken-3" dark app fixed)
      v-toolbar-title
        v-toolbar-side-icon.pt-0.hidden-lg-only(@click.stop="drawer = !drawer")
        span.hidden-sm-and-down CAMPZY
      v-spacer
      v-toolbar-title
        span.hidden-md-and-up CAMPZY
      v-spacer
      v-toolbar-items.hidden-sm-and-down
        v-btn(flat) HOME
        v-btn(flat) ABOUT
        v-menu(offset-y :close-on-content-click='false')
          v-btn(size='32' slot='activator' flat)
            i.fas.fa-user-circle.fa-lg
          v-card
            v-flex.text-xs-center(xs12 style='margin:10px').pt-2
              span SIGN IN
            form(v-model='valid' style='margin:10px')
              v-text-field(v-model="email" :rules='emailRules' label='Email' required)
              v-text-field(v-model="password" :rules='passwordRules' type='password' label='Password' required)
            .text-xs-center(style='margin:10px;display:flex;flex-direction:column')
              v-btn(round color='primary' dark) Sign In
              p Or Using
            v-flex.text-xs-center
              a(href='#')
                v-avatar(size='32' style='margin:10px')
                  i.fab.fa-google.fa-2x
              a(href="#")
                v-avatar(size='32' style='margin:10px')
                  i.fab.fa-facebook.fa-2x
</template>
<script>
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
};
</script>
