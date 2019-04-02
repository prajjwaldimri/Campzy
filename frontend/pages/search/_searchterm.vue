<template lang="pug">
  .home
    navbar

    transition(name="fade-transition" appear)
      line-scale-pulse-out-rapid-loader(color="green" size="40px" v-if="!searchComplete")
    v-container(fluid).top-container
      SearchImagesDialog
      v-layout(row wrap align-start)
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
                    v-date-picker(v-model="fromDate" no-title scrollable :allowed-dates="allowedDates")
                    v-date-picker(v-model="toDate" no-title scrollable :allowed-dates="allowedDates")

                v-flex
                  v-range-slider(v-model="priceRange" :max="80000" :min="1000" :step="500"
                    hint="Price Range" persistent-hint color="green" thumb-label :thumb-size="48")
                  span {{ $n(priceRange[0], 'currency', 'en-IN') }} - {{ $n(priceRange[1], 'currency', 'en-IN') }}

                v-flex
                  v-select(v-model="amenitiesSelected" :items="amenities" attach
                  chips persistent-hint menu-props="{auto, 'offset-y'}"
                  multiple hint="Amenities")
                    template(slot="selection" slot-scope="{item, index}")
                      v-chip(v-if="index <= 2")
                        span {{item}}
                      v-chip(v-if="index === 3").grey--text.caption
                        | (+ {{amenitiesSelected.length - 3}} others)

                v-flex
                  v-layout(row)
                    v-flex(sm6)
                      v-select(hint="Number of tents" persistent-hint
                      v-model="tentCount" :items="tentNumbers")
                    v-flex(sm6)
                      v-select(hint="People per tent" persistent-hint
                      v-model="personCount" :items="personNumbers")


            v-card-actions
              v-btn(color="green" block @click="search").white--text Apply Filters
                v-icon(right) filter_list

        //- Sort Button
        v-menu(top offset-y transition="slide-y-reverse-transition")
          v-btn(color="red" dark fab fixed bottom right
          slot="activator").elevation-19.hidden-sm-and-down
            v-icon sort
          v-list
            v-list-tile(@click="sort('price')")
              v-list-tile-title Price (Low to High)
            v-list-tile(@click="sort('priceReverse')")
              v-list-tile-title Price (High to Low)


        v-flex(xs12 md9 style="margin-bottom: 2rem")
          v-container(v-show="searchComplete" style="padding-top:0")
            v-layout(column)
              v-flex(v-for="result in searchResults" :key="result.id").search-results
                v-card(:to="'/camp/' + result.url")
                  v-container(fluid grid-list-xs)
                    //- Desktop layout for search
                    v-layout(row wrap).hidden-sm-and-down
                      v-flex(md4).image-wrapper
                        v-hover
                          v-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/'+result.heroImage" width="100%" height="17rem" cover
                          slot-scope="{ hover }" :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/'+result.heroImage")
                            v-layout(slot="placeholder" fill-height align-center justify-center)
                              v-progress-circular(indeterminate color="green darken-5")
                            v-expand-transition
                              .d-flex(v-if="hover" style="height: 100%"
                              class="transition-fast-in-fast-out green darken-2 v-card--reveal display-3 white--text")
                                v-btn(dark @click.prevent="openImageDialog(result.url)")
                                  | View All Images

                      v-flex(md4).result-column.pl-3.pt-3
                        .pl-2
                          h1.font-weight-thin.grey--text.text--darken-3 {{result.name}}
                          h3.title.grey--text.mt-3.text--darken-2 {{result.location}}
                        div.mt-4
                          h3.title.mb-3.pl-2
                            | Starting @ {{ $n(result.minPrice, 'currency', 'en-IN') }}
                          v-tooltip(right)
                            v-rating(v-model="result.averageRating" color="green"
                            background-color="green lighten-3" half-increments
                            readonly slot="activator")
                            span {{result.averageRating}}

                      v-flex(md4).result-column.hidden-sm-and-down.pl-3
                        .row.feature-row
                          v-icon.mr-3 cloud
                          span.increase-letter-spacing-1(v-if="result.temperature") {{result.temperature}} °C ({{result.temperatureSummary}})
                          span.increase-letter-spacing-1(v-else) Can't get temperature

                        .row.feature-row(v-if="result.terrain.forest")
                          v-icon.mr-3(color="green") nature
                          span.increase-letter-spacing-1 Forest Terrain
                        .row.feature-row(v-if="result.terrain.glacier")
                          v-icon.mr-3(color="light-blue") ac_unit
                          span.increase-letter-spacing-1 Glacier Terrain
                        .row.feature-row(v-if="result.terrain.hill")
                          v-icon.mr-3(color="brown") terrain
                          span.increase-letter-spacing-1 Hill Terrain
                        .row.feature-row(v-if="result.terrain.desert")
                          v-icon.mr-3(color="yellow darken-3") waves
                          span.increase-letter-spacing-1 Desert Terrain
                        .row.feature-row(v-if="result.terrain.ocean")
                          v-icon.mr-3(color="blue") waves
                          span.increase-letter-spacing-1 Ocean Terrain
                        .row.feature-row(v-if="result.terrain.river")
                          v-icon.mr-3(color="light-blue") pool
                          span.increase-letter-spacing-1 River Terrain

                        .row.feature-row(v-if="result.amenities.washRoomAttached")
                          v-icon.mr-3(color="pink") meeting_room
                          span.increase-letter-spacing-1 Washroom attached
                        .row.feature-row(v-else)
                          v-icon.mr-3(disabled) meeting_room
                          span.increase-letter-spacing-1.grey--text Washroom attached

                        .row.feature-row(v-if="result.amenities.mealsInclude")
                          v-icon.mr-3(color="orange darken-4") room_service
                          span.increase-letter-spacing-1 Meals included
                        .row.feature-row(v-else)
                          v-icon.mr-3(disabled) room_service
                          span.increase-letter-spacing-1.grey--text Meals included

                        .row.feature-row(v-if="result.amenities.chargingPoints")
                          v-icon.mr-3(color="blue") battery_charging_full
                          span.increase-letter-spacing-1 Charging Points
                        .row.feature-row(v-else)
                          v-icon.mr-3(disabled) battery_charging_full
                          span.increase-letter-spacing-1.grey--text Charging Points


                  //- Mobile layout for search cards
                  v-layout(column).hidden-md-and-up.pt-2
                    v-flex.image-wrapper
                      v-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/'+result.heroImage" contain :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/'+result.heroImage"
                      @click="openImageDialog(result.url)")
                        v-layout(slot="placeholder" fill-height align-center justify-center)
                          v-progress-circular(indeterminate color="grey lighten-5")

                    v-flex.result-column
                      div.py-2.text-xs-center
                        h1.font-weight-thin.grey--text.text--darken-3 {{result.name}}
                        h3.grey--text {{result.location}}
                      div.mt-3.text-xs-center
                        h3.title.mb-2.pl-2
                          | Starting @ {{ $n(result.minPrice, 'currency', 'en-IN') }}
                        .d-flex(style="align-items: center").mt-1
                          h3.mr-2 4.5
                          v-rating(v-model="result.averageRating" color="green" small
                          background-color="green lighten-3" half-increments readonly)

              v-dialog(v-model="filterDialog" fullscreen).hidden-md-and-up
                v-card.hidden-md-and-up
                  v-card-title(primary-title)
                    h3.headline.mb-0 Filters
                  v-container(fluid grid-list-md).top-search
                    v-layout(column justify-center)
                      v-flex
                        v-text-field(hint="Try Nature, Leh, Mountains....." append-icon="search"
                        color="green" single-line required v-model="searchInput"
                        @click:append="search" @keyup.enter="search")

                      v-flex
                        v-menu(v-model="tripDurationMenu" offset-y
                        ransition="slide-y-transition"
                        :close-on-content-click="false" lazy style="width: 100%")
                          v-select(hint="Trip duration" readonly block
                          :label="dateLabel"
                          slot="activator" color="primary" single-line persistent-hint)
                          v-date-picker(v-model="fromDate" no-title scrollable
                          full-width :allowed-dates="allowedDates").hidden-md-and-up
                          v-date-picker(v-model="toDate" no-title scrollable
                          full-width :allowed-dates="allowedDates").hidden-md-and-up

                      v-flex
                        v-range-slider(v-model="priceRange" :max="80000" :min="1000"
                          :step="500"
                          hint="Price Range" persistent-hint color="green"
                          thumb-label :thumb-size="48")

                      v-flex
                        v-select(v-model="amenitiesSelected" :items="amenities" attach
                        chips persistent-hint label="Amenities"
                        multiple hint="Amenities")
                          template(slot="selection" slot-scope="{item, index}")
                            v-chip(v-if="index <= 2")
                              span {{item}}
                            v-chip(v-if="index === 3").grey--text.caption
                              | (+ {{amenitiesSelected.length - 3}} others)

                      v-flex
                        v-layout(row)
                          v-flex(sm6)
                            v-select(hint="Number of Tents" persistent-hint
                            v-model="tentCount" :items="tentNumbers")
                          v-flex(sm6)
                            v-select(hint="People per tent" persistent-hint
                            v-model="personCount" :items="personNumbers")

                v-btn(fixed dark fab bottom right color="primary"
                @click.native="search")
                  v-icon done_all


              v-dialog(v-model="sortDialog").hidden-sm-and-down
                v-card
                  v-list
                    v-list-tile(@click="sort('price')")
                      v-list-tile-title Price (Low to High)
                    v-list-tile(@click="sort('priceReverse')")
                      v-list-tile-title Price (High to Low)


              v-bottom-nav(fixed color="white" :value="true").hidden-md-and-up
                v-btn(flat @click.native="filterDialog=true")
                  span Filter
                  v-icon filter_list

                v-btn(flat @click.native="sortDialog=true")
                  span Sort
                  v-icon poll

    Footer

</template>

<script>
/* eslint no-param-reassign: ["error", { "props": false }] */
import InfiniteLoading from 'vue-infinite-loading'
import { request } from 'graphql-request'
import navbar from '../../components/Navbar.vue'
import Footer from '../../components/Footer.vue'
import { EventBus } from '../../layouts/event-bus'
import { campSearchUser } from '../../queries/queries'
import SearchImagesDialog from '../../components/SearchImagesDialog.vue'

export default {
  components: {
    navbar,
    InfiniteLoading,
    SearchImagesDialog,
    Footer
  },
  metaInfo() {
    return {
      title: this.searchInput,
      titleTemplate: '%s - Campzy'
    }
  },
  data() {
    return {
      searchInput: '',
      searchResults: [],
      searchComplete: false,
      fromDate: null,
      toDate: null,
      tripDurationMenu: false,
      priceRange: [1000, 50000],
      priceLabels: [],
      tentType: ['Dome', 'Swiss'],
      tentTypes: ['Dome', 'Swiss'],
      amenitiesSelected: [],
      amenities: [
        'Attached Washroom',
        'Charging Points',
        'Meals Included',
        'Mobile Connectivity',
        'Bonfire',
        'Pets Allowed',
        'Meals Included'
      ],
      tentCount: 1,
      tentNumbers: [1, 2, 3, 4, 5],
      personCount: 1,
      personNumbers: [0, 1, 2, 3, 4, 5],
      dateLabel: 'Choose a date',
      filterDialog: false,
      sortDialog: false,
      isSearching: false
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
    },
    tentCount() {
      sessionStorage.setItem('tentCount', this.tentCount)
      this.calculatePrice()
    },
    personCount() {
      sessionStorage.setItem('personCount', this.personCount)
      this.calculatePrice()
    }
  },
  mounted() {
    for (let i = this.minPrice; i <= this.maxPrice; i += 500) {
      this.priceLabels.push(i)
    }
    this.searchInput = this.$route.params.searchterm

    this.tentCount = parseInt(sessionStorage.getItem('tentCount'), 10) || 1
    this.personCount = parseInt(sessionStorage.getItem('personCount'), 10) || 2

    // Set the default date label
    this.fromDate = this.$moment().format('YYYY-MM-DD')
    this.toDate = this.$moment()
      .add(1, 'days')
      .format('YYYY-MM-DD')
    this.search()
  },

  methods: {
    allowedDates(val) {
      return this.$moment(val).isSameOrAfter(Date.now(), 'days')
    },

    search() {
      EventBus.$emit('show-progress-bar')
      this.searchComplete = false
      this.filterDialog = false
      if (this.searchInput.trim() === '') {
        return
      }
      this.$router.push({
        name: 'search',
        params: { searchterm: this.searchInput.trim() }
      })
      const variables = {
        searchTerm: this.searchInput,
        minPrice: this.priceRange[0],
        maxPrice: this.priceRange[1],
        bookingStartDate: this.fromDate,
        bookingEndDate: this.toDate,
        preBookPeriod: this.$moment(this.fromDate).diff(Date.now(), 'days'),
        page: 1,
        tentCount: this.tentCount,
        personCount: this.personCount,
        tripDuration: this.$moment(this.toDate).diff(this.fromDate, 'days'),
        amenities: this.amenitiesSelected
      }
      request('https://api.campzy.in', campSearchUser, variables)
        .then(data => {
          this.searchResults = data.campSearchUser
          this.calculatePrice()
        })
        .catch(() => {
          this.searchResults = []
        })
        .finally(() => {
          this.searchComplete = true
          EventBus.$emit('hide-progress-bar')
        })
    },
    openImageDialog(campUrl, campName) {
      EventBus.$emit('open-image-dialog', { campUrl, campName })
    },
    calculatePrice() {
      this.searchResults.forEach(searchResult => {
        // If the backend search provides more tents than needed then sort the tents and remove additional ones
        let { inventory } = searchResult
        if (inventory.length > this.tentCount) {
          const tents = inventory.sort(
            (a, b) => a.bookingPrice - b.bookingPrice
          )
          inventory = tents.slice(0, this.tentCount)
        }
        searchResult.inventory = inventory

        // Calculate the minimum price for each Camp.
        const minPrice = searchResult.inventory.reduce(
          (price, tent) => price + tent.bookingPrice,
          0
        )
        searchResult.minPrice =
          minPrice * this.$moment(this.toDate).diff(this.fromDate, 'days')
      })
    },
    sort(option) {
      this.sortDialog = false
      switch (option) {
        case 'price':
          this.searchResults.sort((a, b) => a.minPrice > b.minPrice)
          break
        case 'priceReverse':
          this.searchResults.sort((a, b) => a.minPrice < b.minPrice)
          break

        default:
          break
      }
    }
  }
}
</script>

<style lang="scss">
.line-scale-pulse-out-rapid {
  position: absolute;
  top: 50%;
  left: 60%;
  @media screen and (max-width: 960px) {
    left: 50%;
    transform: translateX(-50%);
  }
}

.top-container {
  @media screen and (max-width: 960px) {
    padding: 0;
  }
}

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
  @media screen and (max-width: 960px) {
    margin-bottom: 1rem;
  }

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

.v-menu__content .menuable__content__active {
  top: -5rem !important;
}
</style>
