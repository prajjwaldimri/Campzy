<template lang="pug">
  .camp-view
    navbar(color="transparent" app="true")

    v-responsive(height="90vh")
      v-img(src="https://images.pexels.com/photos/776117/pexels-photo-776117.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" height="100%" position="center center")
        v-layout.lightbox.white--text(column fill-height).pt-5.mt-5
          .d-flex.image-flex
            .d-flex.align-self-center
              h1.display-4.camp-name.hidden-sm-and-down Riverside Camp
              h1.display-3.camp-name.hidden-md-and-up Riverside Camp
            .d-flex.align-self-start.pb-4.px-5
              span
                v-icon(dark color="green") star
                span.title.pl-1.green--text.font-weight-bold 4.8
                span.subheading.pl-2 (16,035 ratings)

    v-responsive(height="50vh")
      v-card(color="grey darken-4" flat height="100%" tile
      style="align-items: center; display: flex").hidden-sm-and-down
        tiny-slider(:mouse-drag="true" :loop="true" items="4" gutter="20"
        :arrowKeys="true" :edgePadding="40" :nav="false" :controls="false" :lazyload="true"
        :autoplay="true" :autoplay-button-output="false")
          v-responsive(height="30vh" v-for="image in images")
            v-card
              v-img(src="https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
          //- For Mobile
      v-card(color="grey darken-4" flat height="100%" tile style="align-items: center")
      .hidden-md-and-up
        tiny-slider(:mouse-drag="true" :loop="true" items="1"
        :nav="false" :controls="false" :lazyload="true"
        :autoplay="true" :autoplay-button-output="false")
          v-responsive(height="40vh" v-for="image in images" :key="image")
            v-card
              v-img(src="https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")

    v-layout(row wrap style="min-height: 90vh").pa-3
      v-flex(sm12 md6).py-4
        h1.headline.font-weight-bold About Riverside Camp
      v-divider(inset vertical)
      v-flex(sm12 md4 offset-md1).py-4
        h3.headline.font-weight-bold Opinions

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
              v-date-picker(v-model="fromDate" no-title scrollable max="2018-09")
              v-date-picker(v-model="toDate" no-title scrollable)
          v-flex(sm2 style="align-items: center").d-flex
            span(style="text-align: center").pa-2.headline.font-weight-bold
              | @ {{ $n(15000, 'currency', 'en-IN') }}
          v-flex(sm2)
            v-btn(color="green" block).btn-huge.pa-2.white--text Book Your Camp

</template>

<script>
import VueTinySlider from 'vue-tiny-slider';
import Navbar from '../Navbar.vue';

export default {
  components: {
    navbar: Navbar,
    'tiny-slider': VueTinySlider,
  },
  data() {
    return {
      tripDurationMenu: false,
      fromDate: null,
      toDate: null,
      adultCount: 2,
      adultNumbers: [1, 2, 3, 4, 5],
      childrenCount: 1,
      childrenNumbers: [0, 1, 2, 3, 4],
      dateLabel: 'Choose a date',
      images: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    };
  },
  mounted() {
    // Set the default date label
    this.fromDate = this.$moment().format('YYYY-MM-DD');
    this.toDate = this.$moment().add(2, 'days').format('YYYY-MM-DD');
  },

  watch: {
    fromDate() {
      this.dateLabel = `${this.$moment(this.fromDate).format('DD MMMM')} - ${this.$moment(this.toDate).format('DD MMMM')}`;
    },
    toDate() {
      this.dateLabel = `${this.$moment(this.fromDate).format('DD MMMM')} - ${this.$moment(this.toDate).format('DD MMMM')}`;
    },
    adultCount() {
      this.calculatePrice();
    },
    childrenCount() {
      this.calculatePrice();
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
}
</style>
