<template lang="pug">
  .camp-view
    navbar(:dark="true")

    SearchImagesDialog
    ReviewCampDialog
    v-container.px-0(fluid)
      v-layout(row wrap)
        v-flex(sm12 md7)
          v-layout.hidden-sm-and-down.pl-4(row style="height:100%")
            hooper.small-slider.ml-2(group="group1" :vertical="true" :itemsToShow="4" :centerMode="true" :infiniteScroll="true")
              slide.pb-2(v-for="image in camp.images" :key="image")
                img.slide-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + image" @click="openImageDialog" :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + image")
              hooper-navigation( slot="hooper-addons")

            hooper.large-slider.ml-3(group="group1" :itemsToShow="1" :infiniteScroll="true")
              slide(v-for="image in camp.images" :key="image")
                img.slide-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + image" @click="openImageDialog" :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + image")
              hooper-pagination(slot="hooper-addons")
              
          
          // Mobile Slider
          hooper.hidden-md-and-up.large-slider(:itemsToShow="1" :infiniteScroll="true")
            slide(v-for="image in camp.images" :key="image")
              img.slide-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + image" @click="openImageDialog" :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + image")
            
            hooper-pagination(slot="hooper-addons")
        v-flex(sm12 md5)
          v-layout.lightbox.justify-center(column fill-height)
            .d-flex.image-flex
              .d-flex.align-self-center
                h1.display-3.camp-name {{camp.name}}
              .d-flex.align-self-center
                h2.camp-name
                  v-icon where_to_vote
                  span.ml-1 {{camp.location}}
              .d-flex.align-self-center
                v-rating()
            .d-flex.mt-5
              v-layout(column)
                h2 Description
                p.pt-3(style="text-align: justify") {{camp.longDescription}}
                .d-flex.justify-center
                  v-flex.mx-1.mt-3(xs1 md1).text-xs-center
                    v-icon(color="red") whatshot
                  v-flex.mx-1.mt-3(xs1 md1).text-xs-center
                    v-icon(color="brown") pets
                  v-flex.mx-1.mt-3(xs1 md1).text-xs-center
                    v-icon(color="red") whatshot
                  v-flex.mx-1.mt-3(xs1 md1).text-xs-center
                    v-icon(color="brown") pets
                  v-flex.mx-1.mt-3(xs1 md1).text-xs-center
                    v-icon(color="red") whatshot
                  v-flex.mx-1.mt-3(xs1 md1).text-xs-center
                    v-icon(color="brown") pets
                  v-flex.mx-1.mt-3(xs1 md1).text-xs-center
                    v-icon(color="red") whatshot
                  v-flex.mx-1.mt-3(xs1 md1).text-xs-center
                    v-icon(color="brown") pets  
    .iframe-container.mt-5
      iframe(:src="mapUri" allowfullscreen)
    v-divider.mt-4
    v-container.mt-4(fluid)
      h1.page-headings Nearby Activities
      hooper.hidden-sm-and-down.mt-5.activities-slider(:itemsToShow="4" )
        slide.px-2(v-if="activities.caving")
          v-card.activity-card 
            v-img(src="/activities/cave.jpg" style="height:200px") 
            v-card-title.headline Caving
            v-card-text.text-primary(style="padding-top:0") Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        slide.px-2(v-if="activities.cliffJumping")
          v-card.activity-card 
            v-img(src="/activities/cliff.jpg" style="height:200px") 
            v-card-title.headline Cliff Jumping
            v-card-text.text-primary(style="padding-top:0") Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.  
        slide.px-2(v-if="activities.cycling")
          v-card.activity-card 
            v-img(src="/activities/cycling.jpg" style="height:200px")
            v-card-title.headline Cycling
            v-card-text.text-primary(style="padding-top:0") Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.  
        slide.px-2(v-if="activities.hotAirBallon")
          v-card.activity-card 
            v-img(src="/activities/hotair.jpg" style="height:200px") 
            v-card-title.headline Hotair Ballon
            v-card-text.text-primary(style="padding-top:0") Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.  
        slide.px-2(v-if="activities.kayaking")
          v-card.activity-card 
            v-img(src="/activities/kayaking.jpg" style="height:200px") 
            v-card-title.headline Kayaking
            v-card-text.text-primary(style="padding-top:0") Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. 
        slide.px-2(v-if="activities.paragliding")
          v-card.activity-card 
            v-img(src="/activities/paragliding.jpg" style="height:200px")
            v-card-title.headline Paragliding 
            v-card-text.text-primary(style="padding-top:0") Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        slide.px-2(v-if="activities.waterRafting")
          v-card.activity-card 
            v-img(src="/activities/rafting.jpg" style="height:200px")
            v-card-title.headline River Rafting 
            v-card-text.text-primary(style="padding-top:0") Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.

        slide.px-2(v-if="activities.waterfallRappelling")
          v-card.activity-card 
            v-img(src="/activities/rappling.jpg" style="height:200px") 
            v-card-title.headline Waterfall Rappeling
            v-card-text.text-primary(style="padding-top:0") Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        slide.px-2(v-if="activities.scubaDiving")
          v-card.activity-card 
            v-img(src="/activities/scuba.jpg" style="height:200px") 
            v-card-title.headline Scuba Diving
            v-card-text.text-primary(style="padding-top:0") Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        slide.px-2(v-if="activities.skking")
          v-card.activity-card 
            v-img(src="/activities/skiing.jpg" style="height:200px") 
            v-card-title.headline SkKing
            v-card-text.text-primary(style="padding-top:0") Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        slide.px-2(v-if="activities.skydiving")
          v-card.activity-card 
            v-img(src="/activities/skydiving.jpg" style="height:200px") 
            v-card-title.headline Sky Diving
            v-card-text.text-primary(style="padding-top:0") Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.  
        slide.px-2(v-if="activities.snorkelling")
          v-card.activity-card 
            v-img(src="/activities/snorkelling.jpg" style="height:200px") 
            v-card-title.headline Snorkelling
            v-card-text.text-primary(style="padding-top:0") Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.  
        slide.px-2(v-if="activities.trekking")
          v-card.activity-card 
            v-img(src="/activities/trekking.jpg" style="height:200px") 
            v-card-title.headline Trekking
            v-card-text.text-primary(style="padding-top:0") Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.    
        hooper-navigation(slot="hooper-addons")
      // Mobile Activity Slider
      hooper.hidden-md-and-up.large-slider(:itemsToShow="1" :infiniteScroll="true")
        slide
          v-card.activity-card 
            v-img(src="/activities/cave.jpg")
            v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. 
        slide
          v-card.activity-card 
            v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
            v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. 
        slide
          v-card.activity-card 
            v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
            v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        hooper-pagination(slot="hooper-addons")   
    v-divider.mt-4
    v-container.mt-4(fluid)
      h1.page-headings Our Customers Reviews
      v-carousel(hide-delimiters hide-delimiter-background show-arrows-on-hover :show-arrows="false" style="box-shadow:none;")
        v-carousel-item(v-for="(slide,i) in slides" :key="i")
          v-layout.review-layout(column)
            v-avatar(color="orange" size="62")
              span AB
            h1 Ayush Bahuguna
            v-rating()
            p.text-xs-center.review-para Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    v-divider.mt-4
    v-container.mt-4(fluid)
      h1.page-headings Similar Camps
      hooper.hidden-sm-and-down.mt-5.activities-slider(:itemsToShow="4" :infiniteScroll="true" )
        slide.px-2
          v-card.activity-card 
            v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
            v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        slide.px-2
          v-card.activity-card
            v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
            v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.  
        slide.px-2
          v-card.activity-card
            v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
            v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.  
        slide.px-2
          v-card.activity-card 
            v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
            v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.   
        hooper-navigation(slot="hooper-addons")
      // Mobile Similar Camps Slider
      hooper.hidden-md-and-up.large-slider(:itemsToShow="1" :infiniteScroll="true")
        slide
          v-card.activity-card 
            v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
            v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. 
        slide
          v-card.activity-card 
            v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
            v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. 
        slide
          v-card.activity-card 
            v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
            v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        hooper-pagination(slot="hooper-addons")

    //- v-responsive(height="90vh")
    //-   v-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + camp.heroImage" height="100%" position="center center" v-if="camp.heroImage"
    //-   :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + camp.heroImage")
    //-     v-layout.lightbox.white--text(column fill-height).pt-5.mt-5
    //-       .d-flex.image-flex
    //-         .d-flex.align-self-center
    //-           h1.display-4.camp-name.hidden-sm-and-down {{camp.name}}
    //-           h1.display-3.camp-name.hidden-md-and-up {{camp.name}}

    //-         .d-flex.align-self-start.pb-4.px-4(style='width:100%')
    //-           span.pt-1(style='width:100%')
    //-             v-icon(dark color="green") star
    //-             span.title.pl-1.green--text.font-weight-bold {{camp.averageRating}}
    //-             span.subheading.pl-2 ({{camp.ratingsCount}} ratings)
    //-           .d-flex.align-self-end
    //-             v-btn(v-if='!isInWishList' dark @click='addToWishList(camp.id)')
    //-               span Add To Wishlist
    //-               v-icon(color='green').pl-1 bookmarks
    //-             v-btn(v-else dark @click='removeFromWishList(camp.id)')
    //-               span Remove from Wishlist
    //-               v-icon(color='error').pl-1 close
    //- v-responsive(height="40vh").hidden-sm-and-down
    //-   v-card(color="grey darken-4" flat height="100%" tile
    //-   style="align-items: center; display: flex")
    //-     tiny-slider(:mouse-drag="true" :loop="false" items="4" gutter="20"
    //-     :arrowKeys="true" :nav="false" :controls="false" :lazyload="true"
    //-     :autoplay="true" :autoplay-button-output="false" v-if="camp.images" :autoHeight="true")
    //-       v-responsive(v-for="image in camp.images" :key="image")
    //-         v-card
    //-           v-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + image" @click="openImageDialog" :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + image")
    //-   //- For Mobile
    //- v-responsive(height="40vh").hidden-md-and-up
    //-   v-card(color="grey darken-4" flat height="100%" tile style="align-items: center").hidden-md-and-up
    //-     tiny-slider(:mouse-drag="true" :loop="true" items="1"
    //-     :nav="false" :controls="false" :lazyload="true" v-if="camp.images"
    //-     :autoplay="true" :autoplay-button-output="false")
    //-       v-responsive(height="50vh" v-for="image in camp.images" :key="image")
    //-         v-card
    //-           v-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + image" @click="openImageDialog" :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + image")

    //- v-layout(row wrap style="min-height: 90vh").py-4
    //-   v-flex(sm12 md5 offset-md1).py-4.content-flex
    //-     h1.display-1.pb-3 About {{camp.name}}
    //-     v-divider
    //-     p.pt-4.subheading(style="text-align: justify") {{camp.longDescription}}

    //-     h1.headline.mt-5.px-1.font-weight-bold Amenities
    //-     v-container(grid-list-lg fluid v-if="camp.amenities").mt-2.px-0
    //-       v-layout(row wrap)
    //-         v-flex(xs6 md3).text-xs-center
    //-           v-icon wb_cloudy
    //-           .subheading.grey--text.text--darken-3.font-weight-regular.mt-1(v-if="camp.temperature") {{camp.temperature}} °C ({{camp.temperatureSummary}})
    //-           .subheading.grey--text.font-weight-regular.mt-1(v-else) Temperature Not Available

    //-         v-flex(xs6 md3 v-show="camp.amenities.bonfire").text-xs-center
    //-           v-icon(color="red") whatshot
    //-           .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Bonfire
           

    //-         v-flex(xs6 md3 v-show="camp.amenities.petsAllowed").text-xs-center
    //-           v-icon(color="brown") pets
    //-           .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Pets Allowed
            

    //-         v-flex(xs6 md3 v-show="camp.amenities.chargingPoints").text-xs-center
    //-           v-icon(color="blue") battery_charging_full
    //-           .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Charging Points
            

    //-         v-flex(xs6 md3 v-show="camp.amenities.mobileConnectivity").text-xs-center
    //-           v-icon(color="blue") signal_cellular_4_bar
    //-           .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Mobile Connectivity
            

    //-         v-flex(xs6 md3 v-show="camp.amenities.washRoomAttached").text-xs-center
    //-           v-icon(color="pink") meeting_room
    //-           .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Washroom Attached
            

    //-         v-flex(xs6 md3 v-show="camp.amenities.mealsInclude").text-xs-center
    //-           v-icon(color="orange darken-4") room_service
    //-           .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Meals Included
           

    //-         v-flex(xs6 md3 v-show="camp.amenities.hotWater").text-xs-center
    //-           v-icon(color="red darken-4") hot_tub
    //-           .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Hot Water
           


    //-     h1.headline.mt-5.px-1.font-weight-bold Location
    //-     .iframe-container.mt-4
    //-       iframe(v-if="camp" :src="mapUri" allowfullscreen)

               
            

    //-   v-divider(inset vertical).mx-3

    //-   v-flex(sm12 md5).py-4.pl-4
    //-     h3.display-1.pb-3 Recent Opinions
    //-     v-divider
    //-     v-card(v-for="review in reviews" :key="review").ma-4.pa-4.comment-card
    //-       v-layout(row wrap)
    //-         v-flex(md2 sm3)
    //-           v-avatar(color="red")
    //-             img(:src="'https://ui-avatars.com/api/?name=' + review.user.name")
    //-         v-flex(md6 sm7)
    //-           span.subheading {{review.comment}}
    //-         v-flex(md3 sm12 offset-md1)
    //-           v-layout(column)
    //-             span.subtitle.grey--text.text--darken-2.ml-1 {{review.createdAt | moment("from", "now")}}
    //-             v-rating(readonly small dense v-model="review.stars").mt-1


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
      slides: ['First', 'Second', 'Third', 'Fourth', 'Fifth'],
      activities: []
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
          // eslint-disable-next-line
          console.log(this.camp.nearByActivities)
          this.activities = this.camp.nearByActivities
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
  height: 100%;
}
.activity-card {
  width: 400px;
  @media screen and (max-width: 960px) {
    width: 100%;
    padding: 0rem 1rem;
    margin-top: 2rem;
  }
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
</style>
