/* global LC_API */
<template lang="pug">
  div
    navbar(:dark="true")
    v-tabs(dark icons-and-text grow centered style="width:100%" v-model="selectedTab").hidden-sm-and-down
      v-tabs-slider(color="green")
      v-tab(href="#tab-1" @click="$router.push('/profile')")
        | Settings
        v-icon settings
      v-tab(href="#tab-2" @click="$router.push('/profile/activeBookings')")
        | Active Bookings
        v-icon event
      v-tab(href="#tab-3" @click="$router.push('/profile/pastBookings')")
        | Past Bookings
        v-icon receipt
      v-tab(href="#tab-4" @click="$router.push('/profile/wishlist')")
        | Wishlist
        v-icon shopping_cart

    transition(name="fade-transition" mode="out-in")
      router-view


    v-bottom-nav(:value="true" :active.sync="bottomNav" color="grey darken-4"
     fixed).hidden-md-and-up
      v-btn(dark @click="$router.push('/profile')")
        v-icon settings
      v-btn(dark @click="$router.push('/profile/activeBookings')")
        v-icon event
      v-btn(dark @click="$router.push('/profile/pastBookings')")
        v-icon receipt
      v-btn(dark @click="$router.push('/profile/wishlist')")
        v-icon shopping_cart

</template>

<script>
import { GraphQLClient } from 'graphql-request'
import navbar from '../components/Navbar.vue'

import { EventBus } from '../layouts/event-bus'

export default {
  name: 'Profile',
  metaInfo: {
    title: 'Profile - Campzy',
    script: [
      // LiveChat
      {
        innerHTML: `window.__lc = window.__lc || {};
    window.__lc.license = 10150997;
    (function () {
      var lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = true;
      lc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);
    })();`,
        type: 'text/javascript'
      }
    ],
    noscript: [
      {
        innerHTML: `<a href="https://www.livechatinc.com/chat-with/10150997/">Chat with us</a>,
    powered by <a href="https://www.livechatinc.com/?welcome" rel="noopener" target="_blank">LiveChat</a>`
      }
    ]
  },
  components: {
    navbar
  },
  data() {
    return {
      drawer: true,
      userProfileImage: '',
      userName: '',
      bottomNav: 0,
      selectedTab: 'tab-1'
    }
  },
  mounted() {
    if (!this.$cookie.get('sessionToken')) {
      this.$router.push({ name: 'login' })
      EventBus.$emit('show-error-notification-short', 'Please Login First')
    } else {
      this.getProfileImage()
    }

    // Select the proper tab based on the url

    switch (this.$route.name) {
      case 'activeBookings':
        this.selectedTab = 'tab-2'
        break

      case 'pastBookings':
        this.selectedTab = 'tab-3'
        break

      case 'wishlist':
        this.selectedTab = 'tab-4'
        break

      default:
        this.selectedTab = 'tab-1'
    }

    var LC_API = LC_API || {} //eslint-disable-line
    LC_API.on_after_load = () => {
      LC_API.hide_chat_window()
    }
  },
  methods: {
    getProfileImage() {
      const query = `{currentUser {
        name,
      }}`
      const client = new GraphQLClient('https://api.campzy.in/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })

      client
        .request(query)
        .then(data => {
          this.userName = data.currentUser.name
          if (data.currentUser.type === 'Admin') {
            this.isAdmin = true
          }
          if (data.currentUser.type === 'CampOwner') {
            this.isCampOwner = true
          }
          if (data.currentUser.type === 'Blogger') {
            this.isBlogger = true
          }
          if (this.userName === null) {
            this.userName = 'Unnamed User'
          }
          this.userProfileImage = `https://ui-avatars.com/api/?size=256&name=${
            this.userName
          }`
        })
        .catch(err => {
          EventBus.$emit(
            'show-error-notification-long',
            err.response.errors[0].message
          )
          this.$cookie.delete('sessionToken')
          this.$router.push({ name: 'login' })
        })
    },
    logout() {
      this.$cookie.delete('sessionToken')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.full-height {
  height: 100vh;
}

.v-tabs__slider {
  height: 5px;
}
</style>
