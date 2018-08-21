<template lang="pug">
  v-toolbar(:clipped-left="$vuetify.breakpoint.lgAndUp" app flat prominent)
    v-toolbar-title
      span Camp
      span.light-green--text.text--accent-4 zy
    v-spacer
    v-toolbar-items.hidden-sm-and-down
      v-btn(flat) HOME
      v-btn(flat) CAMPS
      v-btn(flat) LOGIN/SIGNUP

    v-toolbar-items.hidden-md-and-up
      v-btn(icon)
        v-icon home

      v-btn(icon flat)
        v-icon account_circle

</template>
<script>
export default {
  data: () => ({
    drawer: null,
  }),
};
</script>
