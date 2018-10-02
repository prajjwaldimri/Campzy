<template lang="pug">
  .camp-view
    navbar(color="transparent" :app="true" :absolute="true" :dark="true")

    SearchImagesDialog
    ReviewCampDialog

    v-responsive(height="90vh")
      v-img(src="https://images.pexels.com/photos/776117/pexels-photo-776117.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" height="100%" position="center center")
        v-layout.lightbox.white--text(column fill-height).pt-5.mt-5
          .d-flex.image-flex
            .d-flex.align-self-center
              h1.display-4.camp-name.hidden-sm-and-down {{camp.name}}
              h1.display-3.camp-name.hidden-md-and-up {{camp.name}}
            .d-flex.align-self-start.pb-4.px-5
              span
                v-icon(dark color="green") star
                span.title.pl-1.green--text.font-weight-bold {{camp.averageRating}}
                span.subheading.pl-2 ({{camp.ratingsCount}} ratings)
              v-btn( dark flat @click='addToWishList(camp.id)') Add to WishList

    v-responsive(height="40vh").hidden-sm-and-down
      v-card(color="grey darken-4" flat height="100%" tile
      style="align-items: center; display: flex")
        tiny-slider(:mouse-drag="true" :loop="false" items="4" gutter="20"
        :arrowKeys="true" :nav="false" :controls="false" :lazyload="true"
        :autoplay="true" :autoplay-button-output="false" v-if="camp.images")
          v-responsive(v-for="image in camp.images")
            v-card
              v-img(:src="image" @click="openImageDialog")
      //- For Mobile
    v-responsive(height="40vh").hidden-md-and-up
      v-card(color="grey darken-4" flat height="100%" tile style="align-items: center").hidden-md-and-up
        tiny-slider(:mouse-drag="true" :loop="true" items="1"
        :nav="false" :controls="false" :lazyload="true" v-if="camp.images"
        :autoplay="true" :autoplay-button-output="false")
          v-responsive(height="50vh" v-for="image in camp.images")
            v-card
              v-img(:src="image" @click="openImageDialog")

    v-layout(row wrap style="min-height: 90vh").py-4
      v-flex(sm12 md5 offset-md1).py-4.content-flex
        h1.display-1.pb-3 About {{camp.name}}
        v-divider
        p.pt-4.subheading(style="text-align: justify") {{camp.longDescription}}

        h1.headline.mt-5.px-1.font-weight-bold Amenities
        v-container(grid-list-lg fluid v-if="camp.amenities").mt-2.px-0
          v-layout(row wrap)
            v-flex(xs6 md3).text-xs-center
              v-icon wb_cloudy
              .subheading.grey--text.text--darken-3.font-weight-regular.mt-1(v-if="camp.temperature") {{camp.temperature}} °C ({{camp.temperatureSummary}})
              .subheading.grey--text.font-weight-regular.mt-1(v-else) Temperature Not Available

            v-flex(xs6 md3 v-if="camp.amenities.bonfire").text-xs-center
              v-icon(color="red") whatshot
              .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Bonfire
            v-flex(xs6 md3 v-else).text-xs-center
              v-icon(disabled) whatshot
              .subheading.grey--text.font-weight-regular.mt-1 Bonfire

            v-flex(xs6 md3 v-if="camp.amenities.petsAllowed").text-xs-center
              v-icon(color="brown") pets
              .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Pets Allowed
            v-flex(xs6 md3 v-else).text-xs-center
              v-icon(disabled) pets
              .subheading.grey--text.font-weight-regular.mt-1 Pets Allowed

            v-flex(xs6 md3 v-if="camp.amenities.chargingPoints").text-xs-center
              v-icon(color="blue") battery_charging_full
              .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Charging Points
            v-flex(xs6 md3 v-else).text-xs-center
              v-icon(disabled) battery_charging_full
              .subheading.grey--text.font-weight-regular.mt-1 Charging Points

            v-flex(xs6 md3 v-if="camp.amenities.mobileConnectivity").text-xs-center
              v-icon(color="blue") signal_cellular_4_bar
              .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Mobile Connectivity
            v-flex(xs6 md3 v-else).text-xs-center
              v-icon(disabled) signal_cellular_4_bar
              .subheading.grey--text.font-weight-regular.mt-1 Mobile Connectivity

            v-flex(xs6 md3 v-if="camp.amenities.washRoomAttached").text-xs-center
              v-icon(color="pink") meeting_room
              .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Washroom Attached
            v-flex(xs6 md3 v-else).text-xs-center
              v-icon(disabled) meeting_room
              .subheading.grey--text.font-weight-regular.mt-1 Washroom Attached

            v-flex(xs6 md3 v-if="camp.amenities.mealsInclude").text-xs-center
              v-icon(color="orange darken-4") room_service
              .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Meals Included
            v-flex(xs6 md3 v-else).text-xs-center
              v-icon(disabled) room_service
              .subheading.grey--text.font-weight-regular.mt-1 Meals Included

            v-flex(xs6 md3 v-if="camp.amenities.hotWater").text-xs-center
              v-icon(color="red darken-4") hot_tub
              .subheading.grey--text.text--darken-3.font-weight-regular.mt-1 Hot Water
            v-flex(xs6 md3 v-else).text-xs-center
              v-icon(disabled) hot_tub
              .subheading.grey--text.font-weight-regular.mt-1 Hot Water


        h1.headline.mt-5.px-1.font-weight-bold Location
        .iframe-container.mt-4
          iframe(v-if="camp" :src="mapUri" allowfullscreen)

        h1.headline.mt-5.px-1.font-weight-bold Places of Interest
        v-list(two-line).mt-4
          v-list-tile(v-for="place in camp.placesOfInterest")
            v-list-tile-content
              v-list-tile-title {{place.name}}
            .d-flex
              v-icon.px-2 near_me
              span {{place.distance.toFixed(1)}} Km

      v-divider(inset vertical).mx-3

      v-flex(sm12 md5).py-4.pl-4
        h3.display-1.pb-3 Recent Opinions
        v-divider
        v-card(v-for="review in reviews").ma-4.pa-4.comment-card
          v-layout(row wrap)
            v-flex(md2 sm3)
              v-avatar(color="red")
                img(:src="'https://ui-avatars.com/api/?name=' + review.user.name")
            v-flex(md6 sm7)
              span.subheading {{review.comment}}
            v-flex(md3 sm12 offset-md1)
              v-layout(column)
                span.subtitle.grey--text.text--darken-2.ml-1 {{review.createdAt | moment("from", "now")}}
                v-rating(readonly small dense v-model="review.stars").mt-1


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

</template>

<script>
/* global Razorpay */
import VueTinySlider from 'vue-tiny-slider';
import { GraphQLClient, request } from 'graphql-request';
import navbar from '../Navbar.vue';
import SearchImagesDialog from '../search/SearchImagesDialog.vue';
import ReviewCamp from './ReviewCamp.vue';
import { getCampByUrl, getBestTentAvailable, getReviewsForCamp } from '../../queries/queries';
import { bookCampCheck, bookCamp, addCampToWishlist } from '../../queries/mutationQueries';
import { EventBus } from '../../event-bus';

export default {
  components: {
    navbar,
    'tiny-slider': VueTinySlider,
    SearchImagesDialog,
    ReviewCampDialog: ReviewCamp,
  },
  data() {
    return {
      camp: {},
      campName: '',
      reviews: [],
      price: 0,
      tripDurationMenu: false,
      fromDate: null,
      toDate: null,
      tentCount: 2,
      tentNumbers: [1, 2, 3, 4, 5],
      personCount: 1,
      personNumbers: [1, 2, 3, 4],
      dateLabel: 'Choose a date',
      images: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      mapUri: '',
      bookButtonLoading: false,
      isBookingPossible: true,
      tents: [],
      user: {},
    };
  },
  metaInfo() {
    return {
      title: this.camp.name,
      titleTemplate: 'Campzy - %s',
      script: [
        { src: 'https://checkout.razorpay.com/v1/checkout.js' },
      ],
    };
  },
  mounted() {
    this.getCamp();
    this.tentCount = parseInt(sessionStorage.getItem('tentCount'), 10) || 2;
    this.personCount = parseInt(sessionStorage.getItem('personCount'), 10) || 1;
    this.fromDate = sessionStorage.getItem('fromDate');
    this.toDate = sessionStorage.getItem('toDate');
    this.getUser();
  },
  methods: {
    allowedDates(val) { return this.$moment(val).isSameOrAfter(Date.now(), 'days'); },
    getCamp() {
      EventBus.$emit('show-progress-bar');
      const variables = {
        url: this.$route.params.campUrl,
        tentCount: this.tentCount,
        personCount: this.personCount,
      };
      request('/graphql', getCampByUrl, variables).then((data) => {
        this.camp = data.campUser;
        this.mapUri = `https://www.google.com/maps/embed/v1/view?key=AIzaSyDUX5To9kCG343O7JosaLR3YwTjA3_jX6g&center=${this.camp.coordinates.latitude},${this.camp.coordinates.longitude}`;
      }).catch((err) => {
        console.log(err);
        this.$router.go(-1);
        EventBus.$emit('show-error-notification-short', 'We can\'t find what you were looking for!');
      }).finally(() => {
        EventBus.$emit('hide-progress-bar');
        this.getReviews();
      });
    },
    getUser() {
      if (!this.$cookie.get('sessionToken')) {
        return;
      }
      const query = `{currentUser {
            name,
            email,
            phoneNumber,
          }}`;
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(query)
        .then((data) => {
          this.user = data.currentUser;
          if (this.user.isEmailVerified === false) {
            this.isEmailVerified = false;
          }
          // this.getUserWishList();
        })
        .catch((err) => {
          EventBus.$emit('show-error-notification-long', err.response.errors[0].message);
        });
    },
    getReviews() {
      const variables = {
        campId: this.camp.id,
      };
      request('/graphql', getReviewsForCamp, variables).then((data) => {
        this.reviews = data.getReviewsForCamp;
      }).catch(() => {
        EventBus.$emit('show-info-notification-short', 'No Reviews for this camp.');
      });
    },
    openImageDialog() {
      EventBus.$emit('open-image-dialog', { campId: this.camp.id, campName: this.camp.name });
    },
    calculatePrice() {
      EventBus.$emit('show-progress-bar');
      const variables = {
        url: this.$route.params.campUrl,
        tentCount: parseInt(this.tentCount, 10),
        preBookPeriod: this.$moment(this.fromDate).diff(Date.now(), 'days'),
        bookingStartDate: this.fromDate,
        bookingEndDate: this.toDate,
        personCount: parseInt(this.personCount, 10),
      };
      request('/graphql', getBestTentAvailable, variables).then((data) => {
        if (!data.bestTentInCamp || data.bestTentInCamp.length <= 0) {
          EventBus.$emit('show-error-notification-long', 'We don\'t have the required amount of tents available. ');
          this.isBookingPossible = false;
          return;
        }
        let price = 0;
        this.tents = [];
        for (let i = 0; i < data.bestTentInCamp.length; i += 1) {
          this.tents.push(data.bestTentInCamp[i].id);
          price += data.bestTentInCamp[i].bookingPrice;
        }
        // Add the number of days of trip criteria to price
        this.price = price * this.$moment(this.toDate).diff(this.fromDate, 'days');
        this.isBookingPossible = true;
      }).catch(() => {
        EventBus.$emit('show-error-notification-short', 'Error getting prices for the camp');
        this.isBookingPossible = false;
      }).finally(() => {
        EventBus.$emit('hide-progress-bar');
      });
    },
    bookCamp() {
      this.bookButtonLoading = true;
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      let variables = {
        tentIds: this.tents,
        fromDate: this.fromDate,
        toDate: this.toDate,
      };
      client.request(bookCampCheck, variables).then((data) => {
        const that = this;
        that.bookButtonLoading = true;
        // Implement razorpay API
        const razorOptions = {
          key: 'rzp_test_7nPC922fL6RkVG',
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
              toDate: that.toDate,
            };
            client.request(bookCamp, variables).then(() => {
              EventBus.$emit('show-success-notification-long', 'Tent Successfully Booked!');
              that.$router.push('/profile/activeBookings');
            }).catch((err) => {
              console.log(err);
              EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
            }).finally(() => {
              that.bookButtonLoading = false;
            });
          },
          prefill: {
            name: this.user.name,
            email: this.user.email,
            contact: this.user.phoneNumber,
          },
        };

        const rzpl = new Razorpay(razorOptions);
        rzpl.open();
      }).catch((err) => {
        if (err.response.errors[0].message === 'NotLoggedInError') {
          EventBus.$emit('show-info-notification-short', 'Please Login First!');
          this.$router.push('/login');
        } else {
          EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
        }
      }).finally(() => {
        this.bookButtonLoading = false;
      });
    },

    addToWishList(campID) {
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      const variables = {
        campId: campID,
      };

      client.request(addCampToWishlist, variables).then(() => {
        EventBus.$emit('show-info-notification-short', 'Added to your Wishlist!');
      }).catch((err) => {
        EventBus.$emit('show-error-notification-long', err.response.errors[0].message);
      });
    },


  },

  watch: {
    fromDate() {
      this.dateLabel = `${this.$moment(this.fromDate).format('DD MMMM')} - ${this.$moment(this.toDate).format('DD MMMM')}`;
      sessionStorage.setItem('fromDate', this.fromDate);

      if (this.$moment(this.toDate).diff(this.fromDate, 'days') < 1) {
        this.toDate = this.$moment(this.fromDate).add(1, 'days').format('YYYY-MM-DD');
      }
      this.calculatePrice();
    },
    toDate() {
      this.dateLabel = `${this.$moment(this.fromDate).format('DD MMMM')} - ${this.$moment(this.toDate).format('DD MMMM')}`;
      sessionStorage.setItem('toDate', this.toDate);

      if (this.$moment(this.toDate).diff(this.fromDate, 'days') < 1) {
        this.toDate = this.$moment(this.fromDate).add(1, 'days').format('YYYY-MM-DD');
      }
      this.calculatePrice();
    },
    tentCount() {
      this.calculatePrice();
      sessionStorage.setItem('tentCount', this.tentCount);
    },
    personCount() {
      this.calculatePrice();
      sessionStorage.setItem('personCount', this.personCount);
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Permanent+Marker");
@import "/styles/tiny-slider.css";

.camp-view {
  padding-bottom: 5rem;
  @media screen and (max-width: 960px) {
    padding-bottom: 8rem;
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

.image-flex {
  flex-direction: column;
  align-items: center;
  height: 90%;
  justify-content: center;
  & > * {
    flex-grow: 0 !important;
    margin-top: auto;
  }
}

.camp-name {
  font-family: "Permanent Marker", cursive !important;
  text-shadow: 0px 0px 20px black;
  text-align: center;
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
</style>
