<template lang="pug">
  v-toolbar(:clipped-left="$vuetify.breakpoint.lgAndUp" absolute flat
  prominent color="transparent" app :dark="dark" )
    v-spacer
    v-toolbar-items
      v-btn.hidden-lg-and-up(small icon flat href="tel: +919582421554")
          v-icon call
      v-btn.btn_margin(v-if='!isLoggedIn' flat icon to="/login")
        v-icon account_circle
      v-btn.btn_margin(v-else flat icon to="/profile")
        v-icon(color='blue') account_circle
      v-btn.hidden-md-and-down(small flat href="tel: +919582421554")
        v-icon(style="font-size:19px") call
        span(style="font-size:16px") &nbsp; +91-9582421554
      //- v-btn.btn_margin.featured__btn(round depressed color='green' dark ) Featured Camps 

</template>
<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    dark: Boolean
  },
  data: () => ({
    isLoggedIn: false
  }),
  mounted() {
    this.getCurrentUser()
  },
  methods: {
    getCurrentUser() {
      if (!this.$cookie.get('sessionToken')) {
        this.isLoggedIn = false
      } else {
        this.isLoggedIn = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.featured__btn {
  height: 42px !important;
  width: 200px !important;
}

.btn_margin {
  margin-right: 2rem !important;
  @media screen and (max-width: 960px) {
    margin-right: 0px !important;
  }
}
.btn-text {
  font-size: 10px;
}
</style>
