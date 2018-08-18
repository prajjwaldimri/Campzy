<template lang="pug">
  v-toolbar(:clipped-left="$vuetify.breakpoint.lgAndUp" color="blue darken-3" dark app fixed)
    v-toobal-title(style="width: 300px" class="ml-0 pl-3")
      span.hidden-sm-and-down CAMPZY
    v-spacer
    v-btn(flat) HOME
    v-btn(flat) ABOUT
    v-menu(offset-y :close-on-content-click='false')
      v-avatar(size='32' slot='activator')
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
