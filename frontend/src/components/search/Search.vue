<template lang="pug">
  .home
    transition(name="slide-y-transition" appear)
      navbar

    v-container(fluid grid-list-md)
      SearchImagesDialog
      v-layout(row wrap align-start)
        transition(name="slide-y-transition" appear)
          v-flex(md3 style="max-height: 90vh;").hidden-sm-and-down.filter-flex
            v-card(style="max-height: 90vh; border-top: 4px green solid")
              v-container(fluid grid-list-md).top-search
                v-layout(column justify-center)
                  v-flex
                    v-text-field(hint="Try Nature, Leh, Mountains....." append-icon="search"
                    color="green" single-line required v-model="searchInput"
                    @click:append="search" @keyup.enter="search")

                  v-flex
                    v-menu(v-model="tripDurationMenu" offset-y transition="slide-y-transition"
                    :close-on-content-click="false" lazy style="width: 100%")
                      v-select(hint="Trip duration" readonly block
                      :label="dateLabel"
                      slot="activator" color="primary" single-line persistent-hint)
                      v-date-picker(v-model="fromDate" no-title scrollable)
                      v-date-picker(v-model="toDate" no-title scrollable)

                  v-flex
                    v-range-slider(v-model="priceRange" :max="80000" :min="1000" :step="500"
                      hint="Price Range" persistent-hint color="green" thumb-label :thumb-size="48")

                  v-flex
                    v-select(v-model="tentType" :items="tentTypes" attach chips persistent-hint
                    multiple hint="Tent types")

                  v-flex
                    v-layout(row)
                      v-flex(sm6)
                        v-combobox(hint="Adults (age > 10)" persistent-hint
                        v-model="adultCount" :items="adultNumbers")
                      v-flex(sm6)
                        v-combobox(hint="Children (age > 5)" persistent-hint
                        v-model="childrenCount" :items="childrenNumbers")

                  v-flex
                    v-select(v-model="amenitiesSelected" :items="amenities" attach
                    chips persistent-hint
                    multiple hint="Amenities")
                      template(slot="selection" slot-scope="{item, index}")
                        v-chip(v-if="index <= 2")
                          span {{item}}
                        v-chip(v-if="index === 3").grey--text.caption
                          | (+ {{amenitiesSelected.length - 3}} others)

              v-card-actions
                v-btn(color="green" block @click="search").white--text Apply Filters
                  v-icon(right) filter_list


        //- Sort Button
        v-fab-transition(appear)
          v-tooltip(top)
            v-btn(color="red" dark fab fixed bottom right slot="activator").elevation-19
              v-icon sort
            span Sort By


        v-flex(xs12 md9)
          v-container(grid-list-xs v-show="searchComplete")
            v-layout(column)
              v-flex(v-for="result in searchResults" :key="result.id").search-results
                v-card
                  v-container(fluid grid-list-md)
                    //- Desktop layout for search
                    v-layout(row wrap).hidden-sm-and-down
                      v-flex(md4).image-wrapper
                        v-hover
                          v-img(:src="result.heroImage" width="100%" height="15rem" cover
                          slot-scope="{ hover }")
                            v-layout(slot="placeholder" fill-height align-center justify-center)
                              v-progress-circular(indeterminate color="grey lighten-5")
                            v-expand-transition
                              .d-flex(v-if="hover" style="height: 100%"
                              class="transition-fast-in-fast-out green darken-2 v-card--reveal display-3 white--text")
                                v-btn(dark @click="openImageDialog(result.name, result.name)")
                                  | View All Images

                      v-flex(md4).result-column.pl-3
                        div
                          h1.font-weight-thin.grey--text.text--darken-3.pl-2 {{result.name}}
                          h3.grey--text.mt-2.pl-2 {{result.location}}
                        div
                          h3.title.mb-2.pl-2
                            | Starting @ {{ $n(result.minPrice, 'currency', 'en-IN') }}
                          v-tooltip(right)
                            v-rating(v-model="result.rating" color="green"
                            background-color="green lighten-3" half-increments
                            readonly slot="activator")
                            span {{result.rating}}

                      v-flex(md4).result-column.hidden-sm-and-down
                        .row.feature-row
                          v-icon.mr-3 ac_unit
                          span.increase-letter-spacing-1 29 C (Snowing)
                        .row.feature-row
                          v-icon.mr-3 nature
                          span.increase-letter-spacing-1 Jungle Terrain
                        .row.feature-row
                          v-icon.mr-3 wifi_off
                          span.increase-letter-spacing-1 No Internet
                        .row.feature-row
                          v-icon.mr-3 accessible
                          span.increase-letter-spacing-1 Wheel Chair Accessible
                        .row.feature-row
                          v-icon.mr-3.green--text verified_user
                          span.increase-letter-spacing-1 Campzy Quality Assurance


                  //- Mobile layout for search cards
                  v-layout(column).hidden-md-and-up
                      v-flex.image-wrapper
                        v-img(:src="result.imgSrc" contain
                        @click="openImageDialog(result.name, result.name)")
                          v-layout(slot="placeholder" fill-height align-center justify-center)
                            v-progress-circular(indeterminate color="grey lighten-5")


                      v-flex.result-column
                        div
                          h1.font-weight-thin.grey--text.text--darken-3 {{result.name}}
                          h3.grey--text {{result.location}}
                        div.mt-3
                          h3.title.mb-2.pl-2 Starting @ ₹ {{result.starting}}
                          v-tooltip(right)
                            v-rating(v-model="result.rating" color="green"
                            background-color="green lighten-3" half-increments
                            readonly slot="activator")
                            span {{result.rating}}

                  v-bottom-nav(fixed color="white" :value="true").hidden-md-and-up
                    v-btn(flat)
                      span Filter
                      v-icon poll
                    v-btn(flat) Filter


</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import { request } from 'graphql-request';
import navbar from '../Navbar.vue';
import SearchImagesDialog from './SearchImagesDialog.vue';
import { EventBus } from '../../event-bus';
import { campSearchUser } from '../../queries/queries';

export default {
  components: {
    navbar,
    InfiniteLoading,
    SearchImagesDialog,
  },
  data() {
    return {
      searchInput: '',
      searchResults: [],
      searchComplete: false,
      fromDate: null,
      toDate: null,
      tripDurationMenu: false,
      priceRange: [1000, 20000],
      priceLabels: [],
      tentType: ['Dome', 'Swiss'],
      tentTypes: ['Dome', 'Swiss'],
      amenitiesSelected: [],
      amenities: ['Amenity-1', 'Amenity-2', 'Amenity-3', 'Amenity-4', 'Amenity-5', 'Amenity-6'],
      adultCount: 2,
      adultNumbers: [1, 2, 3, 4, 5],
      childrenCount: 1,
      childrenNumbers: [0, 1, 2, 3, 4],
      dateLabel: 'Choose a date',
    };
  },
  mounted() {
    for (let i = this.minPrice; i <= this.maxPrice; i += 500) {
      this.priceLabels.push(i);
    }
    this.searchInput = this.$route.params.searchterm;

    // Set the default date label
    this.fromDate = this.$moment().format('YYYY-MM-DD');
    this.toDate = this.$moment().add(2, 'days').format('YYYY-MM-DD');
    this.search();
  },

  methods: {
    search() {
      if (this.searchInput.trim() === '') {
        return;
      }
      const variables = {
        searchTerm: this.searchInput,
        minPrice: this.priceRange[0],
        maxPrice: this.priceRange[1],
        bookingStartDate: this.$moment().diff(this.fromDate, 'days'),
        page: 1,
      };
      request('/graphql', campSearchUser, variables).then((data) => {
        this.searchResults = data.campSearchUser;
        this.calculatePrice();
      }).catch(() => {
        this.searchResults = [];
      }).finally(() => {
        this.searchComplete = true;
      });
    },
    openImageDialog(campId, campName) {
      EventBus.$emit('open-image-dialog', { campId, campName });
    },
    calculatePrice() {
      for (let i = 0; i < this.searchResults.length; i += 1) {
        let minPriceAdult = 99999;
        let minPriceChildren = 99999;
        this.searchResults[i].inventory.forEach((tent) => {
          if (tent.bookingPriceAdult < minPriceAdult) {
            minPriceAdult = tent.bookingPriceAdult;
          }
          if (tent.bookingPriceChildren < minPriceChildren) {
            minPriceChildren = tent.bookingPriceChildren;
          }
        });
        this.searchResults[i].minPrice = (minPriceAdult * this.adultCount) + (minPriceChildren * this.childrenCount);
      }
    },
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
.feature-row {
  display: flex;
  align-items: center;
}

.filter-flex {
  position: sticky;
  top: 0;
}

.increase-letter-spacing-2 {
  letter-spacing: 2px;
}

.increase-letter-spacing-1 {
  letter-spacing: 1px;
}
.search-results {
  margin-bottom: 2rem;

  .result-column {
    @media screen and (max-width: 960px) {
      align-items: center;
    }
    @media screen and (min-width: 961px) {
      align-items: flex-start;
    }
    justify-content: space-around;
    display: flex;
    flex-direction: column;
  }

  .container {
    padding: 0;
  }
  .image-wrapper {
    @media screen and (max-width: 960px) {
      padding: 0 4px 0 4px !important;
    }
    padding: 0 1rem 0 0 !important;
  }
}

.home {
  min-height: 100vh;
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
}

.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.9;
  position: absolute;
  width: 100%;
}
</style>
