<template lang="pug">
  v-toolbar(:clipped-left="$vuetify.breakpoint.lgAndUp" :absolute="absolute" flat
  prominent :color="color" :dark="dark" :app="app")
    v-toolbar-title.ml-0
      .campzy-logo(@click="$router.push('/')")
        span Camp
        span.green--text zy
    v-spacer
    v-toolbar-items.hidden-md-and-down
      v-btn(flat @click="$router.push('/')") HOME
      v-btn(flat @click="$router.push('/profile/wishlist')") WISH LIST
      v-menu(offset-y  :close-on-content-click="false" :nudge-width="100")
        v-btn(flat slot="activator")
          | Places
        v-card.places-card
          v-list
            v-list-tile(v-for="(place, index) in places" @click='sendPlaces(place)' :key="index")
              v-list-tile-content
                v-list-tile-title {{place}}
      v-btn.btn_margin(flat @click="$router.push('/trips/chopta-chandrashila')") Campzy-Trips
      v-btn.btn_margin(flat @click="$router.push('/addYourCamp')") Add your Camp
      v-btn.btn_margin(flat @click="$router.push('/blogs')") Blogs

      v-btn(flat v-show="!isLoggedIn" to="/login") LOGIN/SIGNUP
      v-menu(offset-y  :close-on-content-click="true" :nudge-width="200")
        v-btn(flat slot="activator" v-show="isLoggedIn")
          | Hey, &nbsp; {{user.name}}
        v-card
          v-list
            v-list-tile(@click="$router.push('/profile')")
              v-list-tile-action
                v-icon settings
              v-list-tile-content
                v-list-tile-title Settings
            v-list-tile(v-show='isAdmin || isCampOwner || isBlogger' @click="$router.push('/dashboard')")
              v-list-tile-action
                v-icon work
              v-list-tile-content
                v-list-tile-title Dashboard
            v-list-tile(@click='signOut')
              v-list-tile-action
                v-icon directions_walk
              v-list-tile-content
                v-list-tile-title Sign out
      v-btn(small flat href="tel: +919582421554")
        v-icon(style="font-size:19px") call
        span(style="font-size:16px") &nbsp; +91-9582421554

    v-toolbar-items.hidden-lg-and-up
      v-btn(icon @click="$router.push('/')")
        v-icon home
      v-menu(offset-y  :close-on-content-click="false" :nudge-width="200")
        v-btn(icon slot='activator')
          v-icon room
        v-card.places-card
          v-list
            v-list-tile(v-for="(place, index) in places" @click=`$router.push('/places/' + place)` :key="index")
              v-list-tile-content
                v-list-tile-title {{place}}
      v-btn(icon flat v-show="!isLoggedIn" to='/login')
          v-icon account_circle
      v-menu(offset-y  :close-on-content-click="false" :nudge-width="200")
        v-btn(icon flat v-show="isLoggedIn" slot='activator')
          v-icon account_circle
        v-card
          v-list
            v-list-tile(@click="$router.push('/profile')")
              v-list-tile-action
                v-icon settings
              v-list-tile-content
                v-list-tile-title Settings
            v-list-tile(v-show='isAdmin || isCampOwner || isBlogger' @click="$router.push('/dashboard')")
              v-list-tile-action
                v-icon work
              v-list-tile-content
                v-list-tile-title Dashboard
            v-list-tile(@click='signOut')
              v-list-tile-action
                v-icon directions_walk
              v-list-tile-content
                v-list-tile-title Sign out
      v-btn(icon flat small href="tel: +919582421554" )
        v-icon call


</template>
<script>
import { GraphQLClient } from 'graphql-request'
import { EventBus } from '../layouts/event-bus'

export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    color: String,
    app: Boolean,
    absolute: Boolean,
    dark: Boolean
  },
  data: () => ({
    drawer: null,
    isLoggedIn: false,
    dropdown: false,
    user: {},
    isBlogger: false,
    isAdmin: false,
    isCampOwner: false,
    places: []
  }),
  mounted() {
    this.getCurrentUser()
    this.getCampsLocation()
  },
  methods: {
    getCurrentUser() {
      if (!this.$cookie.get('sessionToken')) {
        this.isLoggedIn = false
        return
      }
      const query = `{currentUser {
        name,
        email,
        dateOfBirth,
        type,
      }}`
      const client = new GraphQLClient('https://api.campzy.in/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })

      client
        .request(query)
        .then(data => {
          this.user = data.currentUser
          if (this.user.type === 'Admin') {
            this.isAdmin = true
          }
          if (this.user.type === 'CampOwner') {
            this.isCampOwner = true
          }
          if (this.user.type === 'Blogger') {
            this.isBlogger = true
          }
          this.isLoggedIn = true
          if (this.user.name === null) {
            this.user.name = 'Unnamed User'
          }
        })
        .catch(() => {
          this.user = {}
          this.isLoggedIn = false
        })
    },

    getCampsLocation() {
      const locationQuery = `query{
        getCampsLocation{
          location
        }
      }`

      const client = new GraphQLClient('https://api.campzy.in/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      client
        .request(locationQuery)
        .then(data => {
          const temp = []
          data.getCampsLocation.forEach(camp => {
            temp.push(camp.location)
          })
          this.places = [...new Set(temp)]
        })
        .catch(() => {
          EventBus.$emit(
            'show-error-notification-short',
            'Failed to get Location'
          )
        })
    },
    signOut() {
      this.$cookie.delete('sessionToken')
      if (this.$cookie.get('sessionToken') == null) {
        EventBus.$emit('show-success-notification-short', 'Logout Successful')
        this.$router.push('/login')
      } else {
        EventBus.$emit('show-error-notification-short', 'Failed to Logout')
      }
    },
    sendPlaces(placeName) {
      this.$router.push(`/places/${placeName}`)
      // EventBus.$emit('reload-place')
    }
  }
}
</script>

<style lang="scss" scoped>
.link-text {
  font-size: 1.5rem;
  text-decoration: none;
}

.campzy-logo {
  font-family: 'GlacialIndifferenceRegular' !important;
  font-size: 1.6rem;
  cursor: pointer;
}

.places-card {
  height: 400px;
  width: 360px;
  overflow: scroll;
  @media screen and (max-width: 966px) {
    height: 450px;
  }
}
</style>
