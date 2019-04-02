<template lang="pug">
  v-container(grid-list-lg)
    v-layout(column)
      transition-group(name="fade-transition" mode="out-in")
        v-card(v-for="(camp, index) in wishList" :key="camp").py-4.my-2
          v-layout(row wrap)
            v-flex(md2 sm12).pl-5
              v-flex
                router-link(:to="'/camp/' + camp.url" style="text-decoration: none")
                  h2.headline.mt-1.green--text.text--darken-2.font-weight-medium {{camp.name}}
            v-divider(vertical).pr-5.hidden-sm-and-down

            v-flex(md6).pl-5
              v-layout(row wrap)
                v-flex(md3)
                  h5.caption.grey--text Location
                  h3.mt-1.subheading {{camp.location}}

                v-flex(md5 offset-md1)
                  h5.caption.grey--text Rating
                  v-layout(row)
                    v-icon(color='green') star
                    h3.ml-1.mt-1.subheading {{camp.averageRating}}

                v-flex(md12).mt-4
                  h5.caption.grey--text Description
                  h3.mt-1.subheading {{ camp.shortDescription }}


            v-divider(vertical).pr-3.hidden-sm-and-down
            v-flex(md3 sm12)
              .d-flex.justify-center(style="height: 100%; align-items:center")
                v-btn(color="error" @click='removeFromWishlist(camp.id)').white--text
                  span Remove From Wishlist
                  v-icon.ml-2 cancel

</template>

<script>
import { GraphQLClient } from 'graphql-request'
import { getWishlistInProfile } from '../../queries/queries'
import { removeCampFromWishlist } from '../../queries/mutationQueries'
import { EventBus } from '../../layouts/event-bus'

export default {
  data() {
    return {
      wishList: []
    }
  },
  mounted() {
    this.getUserWishList()
  },
  methods: {
    getUserWishList() {
      const client = new GraphQLClient('https://api.campzy.in', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })

      client
        .request(getWishlistInProfile)
        .then(data => {
          this.wishList = data.getWishlistInProfile.localWishlist
        })
        .catch(() => {
          EventBus.$emit(
            'show-error-notification-long',
            'Unable to get Wishlist or Login first'
          )
        })
    },

    removeFromWishlist(campID) {
      EventBus.$emit('show-progress-bar')
      const client = new GraphQLClient('https://api.campzy.in', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      const variables = {
        campId: campID
      }

      client
        .request(removeCampFromWishlist, variables)
        .then(() => {
          EventBus.$emit(
            'show-info-notification-short',
            'Removed from Wishlist!'
          )
          this.getUserWishList()
        })
        .catch(() => {
          EventBus.$emit('show-error-notification-long', 'Failed to Remove')
        })
        .finally(() => {
          EventBus.$emit('hide-progress-bar')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.settings-card {
  padding: 2rem;
}

.settings-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
