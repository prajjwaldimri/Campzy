<template lang="pug">
  v-toolbar(:clipped-left="$vuetify.breakpoint.lgAndUp" absolute flat
  prominent color="transparent" app )
    v-spacer
    v-toolbar-items.hidden-md-and-down
      v-btn.btn_margin(flat @click="$router.push({name: 'addYourCamp'})") Add your Camp
      //- v-btn.btn_margin(flat) Support
      v-btn.btn_margin(flat @click="$router.push('blogs')") Blogs
      v-btn.btn_margin(v-if='!isLoggedIn' flat icon to="/login")
        v-icon account_circle
      v-btn.btn_margin(v-else flat icon to="/profile")
        v-icon(color='blue') account_circle
      v-btn(small flat href="tel: +919582421554")
        v-icon call
        span(style="font-size:20px") +91-9582421554
      //- v-btn.btn_margin.featured__btn(round depressed color='green' dark ) Featured Camps 
    
    v-toolbar-items.hidden-lg-and-up
      v-menu(transition="slide-y-transition" bottom)
        template(v-slot:activator="{ on }")
          v-btn(icon flat v-on='on')
            v-icon reorder
        v-list.mt-5
          v-list-tile(v-show='!isLoggedIn' @click="$router.push({name: 'login'})")
            v-list-tile-action
              v-icon account_circle
            v-list-tile-content
              v-list-tile-title Login/ Signup
          v-list-tile(v-show='isLoggedIn' @click="$router.push({name: 'profile'})")
            v-list-tile-action
              v-icon account_circle
            v-list-tile-content
              v-list-tile-title Profile
          v-divider
          
          v-list-tile(@click="$router.push({name: 'addYourCamp'})")
            v-list-tile-action
              v-icon add
            v-list-tile-content
              v-list-tile-title Add Your camp
          v-divider
          v-list-tile(@click="$router.push({name: 'blogs'})")
            v-list-tile-action
              v-icon chrome_reader_mode
            v-list-tile-content
              v-list-tile-title Blogs
          v-divider
          v-list-tile(href="tel: +919582421554")
            v-list-tile-content
              v-list-tile-title.text-xs-center Call Us
              v-list-tile-title.text-xs-center +91-9582421554
         
          //- v-divider
          //- v-list-tile
          //-   v-list-tile-action
          //-     v-icon pages
          //-   v-list-tile-content
          //-     v-list-tile-title Featured Camps
          //- v-divider
          //- v-list-tile
          //-   v-list-tile-action
          //-     v-icon contact_support
          //-   v-list-tile-content
          //-     v-list-tile-title Support
        
     
    
      


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
  @media screen and (max-width: 960px) {
    margin-right: 0px !important;
  }
}
.btn-text {
  font-size: 10px;
}
</style>
