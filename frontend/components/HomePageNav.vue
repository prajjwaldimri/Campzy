<template lang="pug">
  v-toolbar(:clipped-left="$vuetify.breakpoint.lgAndUp" absolute flat
  prominent color="transparent" app )
    v-spacer
    v-toolbar-items.hidden-sm-and-down
      v-btn.btn_margin(flat @click="$router.push({name: 'addYourCamp'})") Add your Camp
      v-btn.btn_margin(flat) Support
      v-btn.btn_margin(flat @click="$router.push('blogs')") Blogs
      v-btn.btn_margin(v-if='!isLoggedIn' flat icon to="/login")
        v-icon account_circle
      v-btn.btn_margin(v-else flat icon to="/profile")
        v-icon(color='blue') account_circle
      v-btn.btn_margin.featured__btn(round depressed color='green' dark ) Featured Camps 


</template>
<script>
export default {
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
}
</style>
