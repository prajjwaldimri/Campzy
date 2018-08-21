<template lang="pug">
  #nav
    v-toolbar(:clipped-left="$vuetify.breakpoint.lgAndUp" dark color="transparent" app flat)
      v-toolbar-title
        span Camp
        span.light-green--text.text--accent-4 zy
      v-spacer
      v-toolbar-items.hidden-sm-and-down
        v-btn(flat @click='goHome') HOME
        v-btn(flat @click='goHome') CAMPS
        v-btn(flat @click='goHome') LOGIN/SIGNUP

      v-toolbar-items.hidden-md-and-up
        v-btn(icon @click='goHome')
          v-icon home

        v-btn(icon @click='registerUser' flat)
          v-icon account_circle

</template>
<script>
export default {
  data: () => ({
    drawer: null,
  }),
};
</script>
