<template lang="pug">
  .camp-view
    navbar(:dark="true")

    SearchImagesDialog
    ReviewCampDialog
    v-container.px-0(fluid)
      v-layout(row wrap)
        v-flex(sm12 md7)
          v-layout.hidden-sm-and-down.pl-4(row style="height:100%")
            v-flex(md12)
              v-carousel
                v-carousel-item(v-for="image in images" :key="image")
                  img.slide-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + image" @click="openImageDialog" :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + image")
            //- hooper.small-slider.ml-2(group="group1" :vertical="true" :itemsToShow="4" :centerMode="true" :infiniteScroll="true")
            //-   slide.pb-2(v-for="image in camp.images" :key="image")
            //-     img.slide-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + image" @click="openImageDialog" :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + image")
            //-   hooper-navigation( slot="hooper-addons")

            //- hooper.large-slider.ml-3(group="group1" :itemsToShow="1" :infiniteScroll="true")
            //-   slide(v-for="image in camp.images" :key="image")
            //-     img.slide-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + image" @click="openImageDialog" :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + image")
            //-   hooper-pagination(slot="hooper-addons")
              
          
          // Mobile Slider
          hooper.hidden-md-and-up.large-slider(:itemsToShow="1" :infiniteScroll="true")
            slide(v-for="image in camp.images" :key="image")
              img.slide-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + image" @click="openImageDialog" :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + image")
            
            hooper-pagination(slot="hooper-addons")
        v-flex(sm12 md5 style="position:relative")
          v-layout.lightbox.justify-center(column fill-height)
            .d-flex.image-flex
              .d-flex.align-self-center
                h1.display-3.camp-name {{camp.name}}
              .d-flex.align-self-center
                h2.gray-text.text-xs-bold
                  v-icon where_to_vote
                  span.ml-1 {{camp.location}}
              .d-flex.align-self-center
                v-rating(v-model="camp.averageRating" readonly)
            .d-flex.mt-5
              v-layout(column)
                h2 Description
                p.pt-3(style="text-align: justify") {{camp.longDescription}}
            .d-flex.align-self-end(style="position:absolute; top: 100%;")
              v-btn(v-if='!isInWishList' dark @click='addToWishList(camp.id)')
                span Add To Wishlist
                v-icon(color='green').pl-1 bookmarks
              v-btn(v-else dark @click='removeFromWishList(camp.id)')
                span Remove from Wishlist
                v-icon(color='error').pl-1 close
            
                
    .iframe-container.mt-5
      iframe(:src="mapUri" allowfullscreen)
    v-divider.mt-4
    v-container.mt-4(fluid)
      v-layout.justify-center(row wrap)
        v-flex(sm12 md5)
          v-container(grid-list-lg fluid v-if="camp.amenities").mt-2.px-0
            h1.text-xs-center.page-headings Amenities
            v-layout.mt-5(row wrap)
              v-flex(xs4 md3).text-xs-center
                v-icon wb_cloudy
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1(v-if="camp.temperature") {{camp.temperature}} °C ({{camp.temperatureSummary}})
                .subheading.grey--text.font-weight-regular.mt-1(v-else) Temperature Not Available

              v-flex(xs4 md3 v-show="camp.amenities.bonfire").text-xs-center
                v-icon(color="red") whatshot
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Bonfire
              

              v-flex(xs4 md3 v-show="camp.amenities.petsAllowed").text-xs-center
                v-icon(color="brown") pets
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Pets Allowed
              

              v-flex(xs4 md3 v-show="camp.amenities.chargingPoints").text-xs-center
                v-icon(color="blue") battery_charging_full
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Charging Points
              

              v-flex(xs4 md3 v-show="camp.amenities.mobileConnectivity").text-xs-center
                v-icon(color="blue") signal_cellular_4_bar
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Mobile Connectivity
              

              v-flex(xs4 md3 v-show="camp.amenities.washRoomAttached").text-xs-center
                v-icon(color="pink") meeting_room
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Washroom Attached
              

              v-flex(xs4 md3 v-show="camp.amenities.mealsInclude").text-xs-center
                v-icon(color="orange darken-4") room_service
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Meals Included
              

              v-flex(xs4 md3 v-show="camp.amenities.hotWater").text-xs-center
                v-icon(color="red darken-4") hot_tub
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Hot Water
        v-divider(inset vertical).mx-3.hidden-sm-and-down
        v-flex(sm12 md5)
          v-container(grid-list-lg fluid v-if="camp.nearByActivities").mt-2.px-0
            h1.text-xs-center.page-headings Nearby Activities
            v-layout.mt-5(row wrap)
              v-flex(xs4 md3 v-show="camp.nearByActivities.waterRafting").text-xs-center
                v-img.activities_icon(src="/vectors/rafting.svg" height="24" width="24") 
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Water Rafting

              v-flex(xs4 md3 v-show="camp.nearByActivities.kayaking").text-xs-center
                v-img.activities_icon(src="/vectors/kayaking.svg" height="24" width="24")
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Kayaking
            

              v-flex(xs4 md3 v-show="camp.nearByActivities.skiing").text-xs-center
                v-img.activities_icon(src="/vectors/skking.svg" height="24" width="24")
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Skiing
            

              v-flex(xs4 md3 v-show="camp.nearByActivities.waterfallRappelling").text-xs-center
                v-img.activities_icon(src="/vectors/waterfall.svg" height="24" width="24")
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Waterfall Rappel
            

              v-flex(xs4 md3 v-show="camp.nearByActivities.skydiving").text-xs-center
                v-img.activities_icon(src="/vectors/skydiving.svg" height="24" width="24")
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Sky Diving
            

              v-flex(xs4 md3 v-show="camp.nearByActivities.scubaDiving").text-xs-center
                v-img.activities_icon(src="/vectors/scuba.svg" height="24" width="24")
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Scuba Diving
            

              v-flex(xs4 md3 v-show="camp.nearByActivities.hotAirBallon").text-xs-center
                v-img.activities_icon(src="/vectors/hotair.svg" height="24" width="24")
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Hot Air Ballon
            
              v-flex(xs4 md3 v-show="camp.nearByActivities.caving").text-xs-center
                v-img.activities_icon(src="/vectors/caving.svg" height="24" width="24")
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Caving
            
              v-flex(xs4 md3 v-show="camp.nearByActivities.trekking").text-xs-center
                v-img.activities_icon(src="/vectors/trekking.svg" height="24" width="24")
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Trekking
            
              v-flex(xs4 md3 v-show="camp.nearByActivities.snorkelling").text-xs-center
                v-img.activities_icon(src="/vectors/snorkel.svg" height="24" width="24")
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Snorkelling
            
              v-flex(xs4 md3 v-show="camp.nearByActivities.cliffJumping").text-xs-center
                v-img.activities_icon(src="/vectors/cliff.svg" height="24" width="24")
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Cliff Jumping
            
              v-flex(xs4 md3 v-show="camp.nearByActivities.paragliding").text-xs-center
                v-img.activities_icon(src="/vectors/paragliding.svg" height="24" width="24")
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Paragliding
              
              v-flex(xs4 md3 v-show="camp.nearByActivities.cycling").text-xs-center
                v-img.activities_icon(src="/vectors/bicycle.svg" height="24" width="24")
                .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Cycling
        
    v-divider.mt-4
    v-container.mt-4(fluid)
      h1.page-headings Recent Opinions
      v-carousel(cycle hide-delimiters hide-delimiter-background show-arrows-on-hover :show-arrows="false" style="box-shadow:none;")
        v-carousel-item(v-for="review in reviews" :key="review")
          v-layout.review-layout(column)
            v-avatar(color="orange" size="62")
              v-img(:src="'https://ui-avatars.com/api/?name=' + review.user.name")
            h1 {{review.user.name}}
            v-rating(readonly small dense v-model="review.stars")
            span.subtitle.grey--text.text--darken-2.ml-1 {{review.createdAt | moment("from", "now")}}
            p.text-xs-center.review-para {{review.comment}}
    v-divider.mt-4
    v-container.mt-4(fluid)
      h1.page-headings Similar Camps
      hooper.hidden-sm-and-down.mt-5.activities-slider(:itemsToShow="4.5" :infiniteScroll="true" )
        slide.px-2(v-for="(similarCamp, index) in similarCamps" :key="index")
          v-card.activity-card(@click="$router.push('/camp/' + similarCamp.url)")
            v-img.card-image(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + similarCamp.heroImage" :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + similarCamp.heroImage") 
            v-layout(row)
              v-flex(md6)
                v-layout.mx-3.my-2(column)
                  h5 {{similarCamp.name}}
                  h5 Chopta, Uttarakhand
              v-flex(md6)
                v-rating.text-xs-center.my-2(small readonly)
            v-card-text.text-primary.gray-text.card-para {{similarCamp.shortDescription}}
        
        hooper-navigation(slot="hooper-addons")
      // Mobile Similar Camps Slider
      hooper.hidden-md-and-up.activities-slider(:itemsToShow="1" :infiniteScroll="true")
        slide.px-2(v-for="(similarCamp, index) in similarCamps" :key="index")
          v-card.activity-card(@click="$router.push('/camp/' + similarCamp.url)")
            v-img.card-image(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + similarCamp.heroImage" :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + similarCamp.heroImage") 
            v-layout(row)
              v-flex(md6)
                v-layout.mx-3.my-2(column)
                  h5 {{similarCamp.name}}
                  h5 Chopta, Uttarakhand
              v-flex(md6)
                v-rating.text-xs-center.my-3(small readonly)
            v-card-text.text-primary.gray-text.card-para {{similarCamp.shortDescription}}
        hooper-pagination(slot="hooper-addons")

    //- Bottom Bar
    .bottom-nav
      v-card
        v-layout(row wrap)
          v-flex.divider-border(sm4)
            .d-flex
              v-flex(sm4 offset-sm1).pa-2
                v-select(label="Number of Tents" hide-details solo flat suffix="Tents"
                v-model="tentCount" :items="tentNumbers" dense )
              v-flex(sm6 offset-sm1).pa-2
                v-select(label="People per tent" hide-details solo flat suffix="Person per tent"
                v-model="personCount" :items="personNumbers" dense)
          v-flex(sm4).pa-2.divider-border
            v-menu(v-model="tripDurationMenu" offset-y transition="slide-y-transition"
            :close-on-content-click="true" lazy style="width: 100%")
              v-select(label="Trip duration" readonly block
              :label="dateLabel"  hide-details solo flat
              slot="activator" color="primary")
              v-date-picker(v-model="fromDate" no-title scrollable :allowed-dates="allowedDates").hidden-sm-and-down
              v-date-picker(v-model="fromDate" no-title scrollable full-width :allowed-dates="allowedDates").hidden-md-and-up
              v-date-picker(v-model="toDate" no-title scrollable @click="tripDurationMenu = false" :allowed-dates="allowedDates").hidden-sm-and-down
              v-date-picker(v-model="toDate" no-title scrollable full-width @click="tripDurationMenu = false" :allowed-dates="allowedDates").hidden-md-and-up
          v-flex(sm2 style="align-items: center").d-flex
            span(style="text-align: center").pa-2.headline.font-weight-bold
              | @ {{ $n(price, 'currency', 'en-IN') }}
          v-flex(sm2)
            v-btn(color="green" block @click="bookCamp" :loading="bookButtonLoading" :disabled="!isBookingPossible").btn-huge.pa-2.white--text Book Your Camp
    Footer
</template>

<script>
/* global Razorpay */
// import VueTinySlider from 'vue-tiny-slider'
import { GraphQLClient, request } from 'graphql-request'
import {
  Hooper,
  Slide,
  Navigation as HooperNavigation,
  Pagination as HooperPagination
} from 'hooper'
import 'hooper/dist/hooper.css'
import navbar from '../../components/Navbar.vue'
import SearchImagesDialog from '../../components/SearchImagesDialog.vue'
import Footer from '../../components/Footer.vue'
import {
  getCampByUrl,
  getBestTentAvailable,
  getReviewsForCamp,
  getWishList
} from '../../queries/queries'
import {
  bookCampCheck,
  bookCamp,
  addCampToWishlist,
  removeCampFromWishlist
} from '../../queries/mutationQueries'
import { EventBus } from '../../layouts/event-bus'
import ReviewCamp from '../../components/ReviewCamp.vue'
const VueTinySlider = {}
if (process.client) {
  VueTinySlider.tiny = require('vue-tiny-slider')
}

export default {
  components: {
    Hooper,
    Slide,
    HooperNavigation,
    HooperPagination,
    navbar,
    'tiny-slider': VueTinySlider.tiny,
    SearchImagesDialog,
    ReviewCampDialog: ReviewCamp,
    Footer
  },
  data() {
    return {
      camp: {},
      reviews: [],
      price: 0,
      tripDurationMenu: false,
      fromDate: null,
      toDate: null,
      tentCount: 2,
      tentNumbers: [1, 2, 3, 4, 5],
      personCount: 1,
      personNumbers: [1, 2, 3, 4, 5],
      dateLabel: 'Choose a date',
      images: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      mapUri: '',
      bookButtonLoading: false,
      isBookingPossible: true,
      tents: [],
      user: {},
      userWishList: [],
      isInWishList: false,
      similarCamps: []
    }
  },
  metaInfo() {
    return {
      title: this.camp.name,
      titleTemplate: 'Campzy - %s',
      script: [{ src: 'https://checkout.razorpay.com/v1/checkout.js' }]
    }
  },

  watch: {
    fromDate() {
      this.dateLabel = `${this.$moment(this.fromDate).format(
        'DD MMMM'
      )} - ${this.$moment(this.toDate).format('DD MMMM')}`
      sessionStorage.setItem('fromDate', this.fromDate)

      if (this.$moment(this.toDate).diff(this.fromDate, 'days') < 1) {
        this.toDate = this.$moment(this.fromDate)
          .add(1, 'days')
          .format('YYYY-MM-DD')
      }

      this.calculatePrice()
    },
    toDate() {
      this.dateLabel = `${this.$moment(this.fromDate).format(
        'DD MMMM'
      )} - ${this.$moment(this.toDate).format('DD MMMM')}`
      sessionStorage.setItem('toDate', this.toDate)

      if (this.$moment(this.toDate).diff(this.fromDate, 'days') < 1) {
        this.toDate = this.$moment(this.fromDate)
          .add(1, 'days')
          .format('YYYY-MM-DD')
      }
      this.calculatePrice()
    },
    tentCount() {
      this.calculatePrice()
      sessionStorage.setItem('tentCount', this.tentCount)
    },
    personCount() {
      this.calculatePrice()
      sessionStorage.setItem('personCount', this.personCount)
    }
  },
  mounted() {
    this.getCamp()

    this.tentCount = parseInt(sessionStorage.getItem('tentCount'), 10) || 1
    this.personCount = parseInt(sessionStorage.getItem('personCount'), 10) || 2
    if (
      sessionStorage.getItem('fromDate') &&
      sessionStorage.getItem('toDate')
    ) {
      this.fromDate = sessionStorage.getItem('fromDate')
      this.toDate = sessionStorage.getItem('toDate')
    } else {
      this.fromDate = `${this.$moment().format('YYYY-MM-DD')}`
      this.toDate = `${this.$moment()
        .add(1, 'days')
        .format('YYYY-MM-DD')}`
    }

    this.getUser()
  },
  methods: {
    allowedDates(val) {
      return this.$moment(val).isSameOrAfter(Date.now(), 'days')
    },
    getCamp() {
      EventBus.$emit('show-progress-bar')
      const variables = {
        url: this.$route.params.campUrl,
        tentCount: this.tentCount,
        personCount: this.personCount
      }
      request('https://api.campzy.in/graphql', getCampByUrl, variables)
        .then(data => {
          this.camp = data.campUser
          this.getSimilarCamps(this.camp.location)
          this.mapUri = `https://www.google.com/maps/embed/v1/view?key=AIzaSyDUX5To9kCG343O7JosaLR3YwTjA3_jX6g&center=${this.camp.coordinates.lat},${this.camp.coordinates.lng}&zoom=18&maptype=satellite`
        })
        .catch(() => {
          this.$router.go(-1)
          EventBus.$emit(
            'show-error-notification-short',
            "We can't find what you were looking for!"
          )
        })
        .finally(() => {
          EventBus.$emit('hide-progress-bar')
          this.getReviews()
        })
    },
    getUser() {
      if (!this.$cookie.get('sessionToken')) {
        return
      }
      const query = `{currentUser {
            name,
            email,
            phoneNumber,
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
          if (this.user.isEmailVerified === false) {
            this.isEmailVerified = false
          }
          this.getUserWishList()
        })
        .catch(err => {
          if (err.response.errors[0].message.includes('session')) {
            this.$cookie.delete('sessionToken')
          }
          EventBus.$emit(
            'show-error-notification-long',
            err.response.errors[0].message
          )
        })
    },
    getReviews() {
      const variables = {
        campId: this.camp.id
      }
      request('https://api.campzy.in/graphql', getReviewsForCamp, variables)
        .then(data => {
          this.reviews = data.getReviewsForCamp
        })
        .catch(() => {
          EventBus.$emit(
            'show-info-notification-short',
            'No Reviews for this camp.'
          )
        })
    },
    openImageDialog() {
      EventBus.$emit('open-image-dialog', {
        campUrl: this.$route.params.campUrl
      })
    },
    calculatePrice() {
      EventBus.$emit('show-progress-bar')
      const variables = {
        url: this.$route.params.campUrl,
        tentCount: parseInt(this.tentCount, 10),
        preBookPeriod: this.$moment(this.fromDate).diff(Date.now(), 'days'),
        bookingStartDate: this.fromDate,
        bookingEndDate: this.toDate,
        personCount: parseInt(this.personCount, 10)
      }
      request('https://api.campzy.in/graphql', getBestTentAvailable, variables)
        .then(data => {
          if (!data.bestTentInCamp || data.bestTentInCamp.length <= 0) {
            EventBus.$emit(
              'show-error-notification-long',
              "We don't have the required amount of tents available. "
            )
            this.isBookingPossible = false
            return
          }
          let price = 0
          this.tents = []
          for (let i = 0; i < data.bestTentInCamp.length; i += 1) {
            this.tents.push(data.bestTentInCamp[i].id)
            price += data.bestTentInCamp[i].bookingPrice
          }
          // Add the number of days of trip criteria to price
          this.price =
            price * this.$moment(this.toDate).diff(this.fromDate, 'days')
          this.isBookingPossible = true
        })
        .catch(() => {
          EventBus.$emit(
            'show-error-notification-short',
            'Error getting prices for the camp'
          )
          this.isBookingPossible = false
        })
        .finally(() => {
          EventBus.$emit('hide-progress-bar')
        })
    },
    bookCamp() {
      this.bookButtonLoading = true
      const client = new GraphQLClient('https://api.campzy.in/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      let variables = {
        tentIds: this.tents,
        fromDate: this.fromDate,
        toDate: this.toDate
      }
      client
        .request(bookCampCheck, variables)
        .then(data => {
          const that = this
          that.bookButtonLoading = true
          // Implement razorpay API
          const razorOptions = {
            key: 'rzp_live_8WKqvYktwfxYIe',
            amount: data.bookCampCheck.amount * 100, // Razorpay counts money in paise
            name: 'Campzy',
            description: 'Purchase Description',
            handler(response) {
              // Use data.bookCampCheck.amount to get the amount from user
              variables = {
                razorpayPaymentId: response.razorpay_payment_id,
                tentIds: that.tents,
                personCount: that.personCount,
                tentCount: that.tentCount,
                fromDate: that.fromDate,
                toDate: that.toDate
              }
              that.bookButtonLoading = true
              client
                .request(bookCamp, variables)
                .then(() => {
                  EventBus.$emit(
                    'show-success-notification-long',
                    'Tent Successfully Booked!'
                  )
                  that.$router.push('/profile/activeBookings')
                  that.bookButtonLoading = false
                })
                .catch(err => {
                  EventBus.$emit(
                    'show-error-notification-short',
                    err.response.errors[0].message
                  )
                })
            },
            prefill: {
              name: this.user.name,
              email: this.user.email,
              contact: this.user.phoneNumber
            }
          }

          const rzpl = new Razorpay(razorOptions)
          rzpl.open()
          this.bookButtonLoading = false
        })
        .catch(err => {
          if (err.response.errors[0].message === 'NotLoggedInError') {
            EventBus.$emit(
              'show-info-notification-short',
              'Please Login First!'
            )
            this.$router.push('/login')
          } else {
            EventBus.$emit(
              'show-error-notification-short',
              err.response.errors[0].message
            )
          }
        })
    },

    addToWishList(campID) {
      EventBus.$emit('show-progress-bar')
      const client = new GraphQLClient('https://api.campzy.in/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      const variables = {
        campId: campID
      }

      client
        .request(addCampToWishlist, variables)
        .then(() => {
          EventBus.$emit(
            'show-info-notification-short',
            'Added to your Wishlist!'
          )
          this.getUserWishList()
        })
        .catch(() => {
          EventBus.$emit('show-error-notification-long', 'Please Login first!')
          this.$router.push('/login')
        })
        .finally(() => {
          EventBus.$emit('hide-progress-bar')
        })
    },
    getUserWishList() {
      const client = new GraphQLClient('https://api.campzy.in/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })

      client
        .request(getWishList)
        .then(data => {
          this.userWishList = data.getUserWishlist.wishlist
          if (this.userWishList.includes(this.camp.id)) {
            this.isInWishList = true
          } else {
            this.isInWishList = false
          }
        })
        .catch(err => {
          EventBus.$emit(
            'show-error-notification-long',
            err.response.errors[0].message
          )
        })
    },
    removeFromWishList(campID) {
      EventBus.$emit('show-progress-bar')
      const client = new GraphQLClient('https://api.campzy.in/graphql', {
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
        .catch(err => {
          EventBus.$emit(
            'show-error-notification-long',
            err.response.errors[0].message
          )
        })
        .finally(() => {
          EventBus.$emit('hide-progress-bar')
        })
    },
    getSimilarCamps(placeName) {
      const client = new GraphQLClient('https://api.campzy.in/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      const getCampByPlace = `query($place: String!){
        getCampsInPlace(place: $place){
          luxuryCamps{
            name
            url
            inventory {
              id,
              bookingPrice
            }
            heroImage
            shortDescription
          },
          premiumCamps{
            name
            url
            inventory {
              id,
              bookingPrice
            }
            heroImage
            shortDescription
          },
          normalCamps{
            name
            url
            inventory {
              id,
              bookingPrice
            }
            heroImage
            shortDescription
          }
          cheapCamps{
            name
            url
            inventory {
              id,
              bookingPrice
            }
            heroImage
            shortDescription
          }
        }
      }`
      const variables = {
        place: placeName
      }

      client
        .request(getCampByPlace, variables)
        .then(data => {
          Object.values(data.getCampsInPlace).forEach(arr => {
            this.similarCamps.push(...arr)
          })
        })
        .catch(() => {
          EventBus.$emit(
            'show-error-notification-short',
            'Unable to get Camps rigth now!'
          )
        })
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Permanent+Marker');
@import 'static/styles/tiny-slider.css';

.camp-view {
  padding-bottom: 5rem;
  @media screen and (max-width: 960px) {
    padding-bottom: 17rem;
  }
}

.tns-outer {
  @media screen and (min-width: 960px) {
    flex: 1 1 auto !important;
  }
}

.bottom-nav {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  box-shadow: 0 3px 14px 2px rgba(0, 0, 0, 0.12);
  justify-content: center;
  z-index: 50;
}

.btn-huge {
  padding: 1.6rem !important;
  margin: 0;
  height: 100%;
  font-size: 1.2rem;
  font-weight: bold;
}

.divider-border {
  border-right: 2px solid rgba(246, 246, 246, 1);
}

.content-flex {
  padding-right: 2rem;
  @media screen and (max-width: 960px) {
    padding-left: 2rem;
  }
}

.comment-card {
  @media screen and (max-width: 960px) {
    margin-left: 0 !important;
  }
}

.iframe-container {
  overflow: hidden;
  padding-top: 56.25%;
  position: relative;

  iframe {
    border: 0;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
}
.activities_icon {
  margin-left: auto;
  margin-right: auto;
}

// New Camp Page Style

.slide-img {
  height: 100%;
  width: 100%;
  background-size: cover;
}

.image-flex {
  flex-direction: column;
  align-items: center;
  // height: 90%;
  justify-content: center;
  & > * {
    flex-grow: 0 !important;
    margin-top: auto;
  }
}

.lightbox {
  padding: 0rem 2.5rem;
  @media screen and (max-width: 960px) {
    padding: 0rem 1.5rem;
  }
}
.small-slider {
  height: 100%;
  width: 18%;
}
.large-slider {
  height: 100%;
  width: 82%;
  @media screen and (max-width: 960px) {
    width: 100%;
  }
}
.camp-name {
  font-family: 'Permanent Marker', cursive !important;
  text-align: center;
}
.iframe-container {
  overflow: hidden;
  padding-top: 21.25%;
  position: relative;
  border-style: solid;
  border-color: rgba($color: gray, $alpha: 0.4);
  border-width: 1px;
  @media screen and (max-width: 960px) {
    height: 280px;
  }

  iframe {
    border: 0;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
}

.activities-slider {
  width: 100%;
  height: 400px;
}
.activity-card {
  height: 350px;
  @media screen and (max-width: 960px) {
    width: 100%;
    // padding: 0rem 1rem;
    margin-top: 2rem;
  }
}
.card-image {
  height: 170px;
}

.page-headings {
  font-size: 40px;
  text-align: center;
  @media screen and (max-width: 960px) {
    font-size: 30px;
  }
}

.review-para {
  font-size: 22px;
  color: gray;
  font-weight: 400;
  @media screen and (max-width: 960px) {
    font-size: 15px;
  }
}

.review-layout {
  align-items: center;
  width: 65%;
  margin: 4rem auto auto auto;
  @media screen and (max-width: 960px) {
    margin: 4rem 0rem;
    width: 100%;
  }
}
.gray-text {
  color: gray;
}
.card-para {
  padding: 0 1rem;
  text-align: justify;
  letter-spacing: 0.05rem;
  @media screen and (min-width: 960px) and (max-width: 1469px) {
    font-size: 12px;
    letter-spacing: 0;
  }
}

// .hooper-slide {
//   width: 380px !important;
//   @media screen and (max-width: 960px) {
//     width: 100%;
//   }
// }

.v-rating i {
  padding: 2px 2px !important;
}
</style>
