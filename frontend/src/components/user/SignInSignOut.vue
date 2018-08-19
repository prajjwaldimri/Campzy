<template lang="pug">
  v-tabs(color='cyan' dark)
    v-tabs-slider(color='yellow')
    v-tab(href="#signin") Sign In
    v-tab(href="#signup") Sign Up
    v-tab-item(id='signin')
      v-card(flat)
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
