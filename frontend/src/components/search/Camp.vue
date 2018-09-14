<template lang="pug">
  .camp-view
    navbar(color="transparent" :app="true" :absolute="true" :dark="true")

    SearchImagesDialog

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
                span.title.pl-1.green--text.font-weight-bold {{camp.rating}}
                span.subheading.pl-2 (16,035 ratings)

    v-responsive(height="40vh").hidden-sm-and-down
      v-card(color="grey darken-4" flat height="100%" tile
      style="align-items: center; display: flex")
        tiny-slider(:mouse-drag="true" :loop="false" items="4" gutter="20"
        :arrowKeys="true" :nav="false" :controls="false" :lazyload="true"
        :autoplay="true" :autoplay-button-output="false" v-if="camp.images")
          v-responsive(height="30vh" v-for="image in camp.images")
            v-card
              v-img(:src="image" @click="openImageDialog")
      //- For Mobile
    v-responsive(height="30vh").hidden-md-and-up
      v-card(color="grey darken-4" flat height="100%" tile style="align-items: center").hidden-md-and-up
        tiny-slider(:mouse-drag="true" :loop="true" items="1"
        :nav="false" :controls="false" :lazyload="true" v-if="camp.images"
        :autoplay="true" :autoplay-button-output="false")
          v-responsive(height="40vh" v-for="image in camp.images")
            v-card
              v-img(:src="image" @click="openImageDialog")

    v-layout(row wrap style="min-height: 90vh").py-4
      v-flex(sm12 md6).pa-4
        h1.display-1.pb-3 About {{camp.name}}
        v-divider
        p.pt-4.subheading(style="text-align: justify") {{camp.longDescription}}

        h1.headline.mt-5.px-1.font-weight-bold Amenities
        v-layout(row).px-1.mt-4
          v-flex(sm2).text-xs-center
            v-icon wb_cloudy
            h4.grey--text 29&#176;C (Current)
          v-flex(sm2).text-xs-center
            v-icon(color="green") loyalty
            h4.grey--text Campzy Guarantee
          v-flex(sm2).text-xs-center
            v-icon(color="brown") pets
            h4.grey--text Pets Allowed
          v-flex(sm2).text-xs-center
            v-icon rowing
            h4.grey--text Adventure Sports
          v-flex(sm2).text-xs-center
            v-icon(color="red") trending_up
            h4.grey--text Trending
          v-flex(sm2).text-xs-center
            v-icon(color="blue") wifi
            h4.grey--text Internet Available
        v-layout(row).px-1.mt-4
          v-flex(sm2).text-xs-center
            v-icon wb_cloudy
            h4.grey--text 29&#176;C (Current)
          v-flex(sm2).text-xs-center
            v-icon(color="green") loyalty
            h4.grey--text Campzy Guarantee
          v-flex(sm2).text-xs-center
            v-icon(color="brown") pets
            h4.grey--text Pets Allowed
          v-flex(sm2).text-xs-center
            v-icon rowing
            h4.grey--text Adventure Sports
          v-flex(sm2).text-xs-center
            v-icon(color="red") trending_up
            h4.grey--text Trending
          v-flex(sm2).text-xs-center
            v-icon(color="blue") wifi
            h4.grey--text Internet Available

        h1.headline.mt-5.px-1.font-weight-bold Location
        .iframe-container.mt-4
          iframe(v-if="camp" :src="mapUri" allowfullscreen)

        h1.headline.mt-5.px-1.font-weight-bold Places of Interest
        v-list(two-line).mt-4
          v-list-tile(v-for="place in camp.placesOfInterest")
            v-list-tile-content
              v-list-tile-title place
            v-list-tile-avatar
              img(src="https://images.pexels.com/users/avatars/121938/eberhard-grossgasteiger-438.jpeg?w=200&h=200&fit=crop&crop=faces")
          v-divider

      v-divider(inset vertical).mx-3

      v-flex(sm12 md5).py-4.pl-4
        h3.display-1.pb-3 Recent Opinions
        v-divider
        v-card(v-for="comment in comments").ma-4.pa-4
          v-layout(row wrap)
            v-flex(md2 sm3)
              v-avatar(color="red")
                span.white--text.headline K
            v-flex(md7 sm7)
              span.subheading Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            v-flex(md3 sm12)
              v-layout(column)
                span.subtitle.grey--text.text--darken-2.ml-1 3 Days ago
                v-rating(small dense v-model="4.5").mt-1


    //- Bottom Bar
    .bottom-nav
      v-card
        v-layout(row wrap)
          v-flex.divider-border(sm4)
            .d-flex
              v-flex(sm4 offset-sm1).pa-2
                v-combobox(label="Adults (age > 10)" hide-details solo flat suffix="Adults"
                v-model="adultCount" :items="adultNumbers" dense type="number")
              v-flex(sm4 offset-sm1).pa-2
                v-combobox(label="Children (age > 5)" hide-details solo flat suffix="Children"
                v-model="childrenCount" :items="childrenNumbers" dense type="number")
          v-flex(sm4).pa-2.divider-border
            v-menu(v-model="tripDurationMenu" offset-y transition="slide-y-transition"
            :close-on-content-click="false" lazy style="width: 100%")
              v-select(label="Trip duration" readonly block
              :label="dateLabel"  hide-details solo flat
              slot="activator" color="primary")
              v-date-picker(v-model="fromDate" no-title scrollable full-width)
              v-date-picker(v-model="toDate" no-title scrollable full-width)
          v-flex(sm2 style="align-items: center").d-flex
            span(style="text-align: center").pa-2.headline.font-weight-bold
              | @ {{ $n(price, 'currency', 'en-IN') }}
          v-flex(sm2)
            v-btn(color="green" block @click="bookCamp").btn-huge.pa-2.white--text Book Your Camp

</template>

<script>
import VueTinySlider from 'vue-tiny-slider';
import { GraphQLClient, request } from 'graphql-request';
import navbar from '../Navbar.vue';
import SearchImagesDialog from './SearchImagesDialog.vue';
import { getCampByUrl } from '../../queries/queries';
import { bookCampCheck } from '../../queries/mutationQueries';
import { EventBus } from '../../event-bus';

export default {
  components: {
    navbar,
    'tiny-slider': VueTinySlider,
    SearchImagesDialog,
  },
  data() {
    return {
      camp: {},
      price: 0,
      tripDurationMenu: false,
      fromDate: null,
      toDate: null,
      adultCount: 2,
      adultNumbers: [1, 2, 3, 4, 5],
      childrenCount: 1,
      childrenNumbers: [0, 1, 2, 3, 4],
      dateLabel: 'Choose a date',
      images: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      comments: [1, 2, 3, 4],
      mapUri: '',
    };
  },
  mounted() {
    this.getCamp();
    this.adultCount = parseInt(sessionStorage.getItem('adultCount'), 10) || 2;
    this.childrenCount = parseInt(sessionStorage.getItem('childrenCount'), 10) || 1;
    this.fromDate = sessionStorage.getItem('fromDate');
    this.toDate = sessionStorage.getItem('toDate');
  },
  methods: {
    getCamp() {
      EventBus.$emit('show-progress-bar');
      const variables = {
        url: this.$route.params.campUrl,
      };
      request('/graphql', getCampByUrl, variables).then((data) => {
        this.camp = data.campUser;
        this.calculatePrice();
        this.mapUri = `https://www.google.com/maps/embed/v1/view?key=AIzaSyDUX5To9kCG343O7JosaLR3YwTjA3_jX6g&center=${this.camp.coordinates.latitude},${this.camp.coordinates.longitude}`;
      }).catch(() => {
        this.$router.push('404');
      }).finally(() => {
        EventBus.$emit('hide-progress-bar');
      });
    },
    openImageDialog() {
      EventBus.$emit('open-image-dialog', { campId: this.camp.id, campName: this.camp.name });
    },
    calculatePrice() {
      if (!this.camp.inventory) {
        return;
      }
      this.price = (this.camp.inventory[0].bookingPriceAdult * this.adultCount)
      + (this.camp.inventory[0].bookingPriceChildren * this.childrenCount);
    },
    bookCamp() {
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      const variables = {
        campId: this.camp.id,
        adultCount: this.adultCount,
        childrenCount: this.childrenCount,
        fromDate: this.fromDate,
        toDate: this.toDate,
      };
      client.request(bookCampCheck, variables).then((data) => {
        console.log(data);
      }).catch((err) => {
        console.log(err);
      });
    },
  },

  watch: {
    fromDate() {
      this.dateLabel = `${this.$moment(this.fromDate).format('DD MMMM')} - ${this.$moment(this.toDate).format('DD MMMM')}`;
      sessionStorage.setItem('fromDate', this.fromDate);
    },
    toDate() {
      this.dateLabel = `${this.$moment(this.fromDate).format('DD MMMM')} - ${this.$moment(this.toDate).format('DD MMMM')}`;
      sessionStorage.setItem('toDate', this.toDate);
    },
    adultCount() {
      this.calculatePrice();
      sessionStorage.setItem('adultCount', this.adultCount);
    },
    childrenCount() {
      this.calculatePrice();
      sessionStorage.setItem('childrenCount', this.childrenCount);
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

#tns1-ow {
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
