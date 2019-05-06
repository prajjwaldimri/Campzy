<template lang="pug">
  v-toolbar(:clipped-left="$vuetify.breakpoint.lgAndUp" absolute flat
  prominent color="transparent" app)
    v-spacer
    v-toolbar-items.hidden-sm-and-down
      v-btn.btn_margin(flat @click="$router.push('/')") Add your Camp
      v-btn.btn_margin(flat @click="$router.push('/profile/wishlist')") Support
      v-btn.btn_margin(flat icon to="/login")
        v-icon account_circle
      v-btn.btn_margin.featured__btn(round depressed color='green' dark ) Featured Camps 
      

    //- v-toolbar-items.hidden-md-and-up
    //-   v-btn(icon @click="$router.push('/')")
    //-     v-icon home
    //-   v-menu(offset-y  :close-on-content-click="false" :nudge-width="200")
    //-     v-btn(icon slot='activator')
    //-       v-icon room
    //-     v-card.places-card
    //-       v-list
    //-         v-list-tile(v-for="(place, index) in places" @click=`$router.push('/places/' + place)` :key="index")
    //-           v-list-tile-content
    //-             v-list-tile-title {{place}}
    //-   v-btn(icon flat v-show="!isLoggedIn" to='/login')
    //-       v-icon account_circle
    //-   v-menu(offset-y  :close-on-content-click="false" :nudge-width="200")
    //-     v-btn(icon flat v-show="isLoggedIn" slot='activator')
    //-       v-icon account_circle
    //-     v-card
    //-       v-list
    //-         v-list-tile(@click="$router.push('/profile')")
    //-           v-list-tile-action
    //-             v-icon settings
    //-           v-list-tile-content
    //-             v-list-tile-title Settings
    //-         v-list-tile(v-show='isAdmin || isCampOwner || isBlogger' @click="$router.push('/dashboard')")
    //-           v-list-tile-action
    //-             v-icon work
    //-           v-list-tile-content
    //-             v-list-tile-title Dashboard
    //-         v-list-tile(@click='signOut')
    //-           v-list-tile-action
    //-             v-icon directions_walk
    //-           v-list-tile-content
    //-             v-list-tile-title Sign out


</template>
<script>
// import { GraphQLClient } from 'graphql-request'
// import { EventBus } from '../layouts/event-bus'

// export default {
//   props: {
//     // eslint-disable-next-line vue/require-default-prop
//     color: String,
//     app: Boolean,
//     absolute: Boolean,
//     dark: Boolean
//   },
//   data: () => ({
//     drawer: null,
//     isLoggedIn: false,
//     dropdown: false,
//     user: {},
//     isBlogger: false,
//     isAdmin: false,
//     isCampOwner: false,
//     places: []
//   }),
//   mounted() {
//     this.getCurrentUser()
//     this.getCampsLocation()
//   },
//   methods: {
//     getCurrentUser() {
//       if (!this.$cookie.get('sessionToken')) {
//         this.isLoggedIn = false
//         return
//       }
//       const query = `{currentUser {
//         name,
//         email,
//         dateOfBirth,
//         type,
//       }}`
//       const client = new GraphQLClient('https://api.campzy.in/graphql', {
//         headers: {
//           Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
//         }
//       })

//       client
//         .request(query)
//         .then(data => {
//           this.user = data.currentUser
//           if (this.user.type === 'Admin') {
//             this.isAdmin = true
//           }
//           if (this.user.type === 'CampOwner') {
//             this.isCampOwner = true
//           }
//           if (this.user.type === 'Blogger') {
//             this.isBlogger = true
//           }
//           this.isLoggedIn = true
//           if (this.user.name === null) {
//             this.user.name = 'Unnamed User'
//           }
//         })
//         .catch(() => {
//           this.user = {}
//           this.isLoggedIn = false
//         })
//     },

//     getCampsLocation() {
//       const locationQuery = `query{
//         getCampsLocation{
//           location
//         }
//       }`

//       const client = new GraphQLClient('https://api.campzy.in/graphql', {
//         headers: {
//           Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
//         }
//       })
//       client
//         .request(locationQuery)
//         .then(data => {
//           const temp = []
//           data.getCampsLocation.forEach(camp => {
//             temp.push(camp.location)
//           })
//           this.places = [...new Set(temp)]
//         })
//         .catch(() => {
//           EventBus.$emit(
//             'show-error-notification-short',
//             'Failed to get Location'
//           )
//         })
//     },
//     signOut() {
//       this.$cookie.delete('sessionToken')
//       if (this.$cookie.get('sessionToken') == null) {
//         EventBus.$emit('show-success-notification-short', 'Logout Successful')
//         this.$router.push('/login')
//       } else {
//         EventBus.$emit('show-error-notification-short', 'Failed to Logout')
//       }
//     },
//     sendPlaces(placeName) {
//       this.$router.push(`/places/${placeName}`)
//       EventBus.$emit('reload-place')
//     }
//   }
// }
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
