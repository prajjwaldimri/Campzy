<template lang="pug">
  .home
    transition(name="slide-y-transition" appear)
      navbar

    v-container(fluid grid-list-md)
      SearchImagesDialog
      v-layout(row wrap align-start)
        transition(name="slide-y-transition" appear)
          v-flex(md3).hidden-sm-and-down.filter-flex

            v-container(fluid grid-list-md).top-search
              v-layout(column justify-center)
                v-flex
                  v-text-field(label="Try Nature, Leh, Mountains....." append-icon="search"
                  autofocus color="green" solo single-line required v-model="searchInput"
                  @click:append="searchClick" @keyup.enter="searchClick")

                v-flex
                  v-menu(v-model="tripDurationMenu" offset-y transition="slide-y-transition"
                  :close-on-content-click="false" lazy)
                    v-select(hint="Select your trip duration" readonly label="21 August - 25 August"
                    slot="activator" color="primary" solo single-line persistent-hint)
                    v-date-picker(v-model="fromDate" no-title scrollable)
                    v-date-picker(v-model="toDate" no-title scrollable)

                v-flex
                  v-range-slider(v-model="priceRange" :max="20000" :min="5000" :step="500"
                    hint="Price Range" persistent-hint height="3.5rem" color="green")


        v-flex(xs12 md9)
          v-container(grid-list-md v-show="searchComplete")
            v-layout(column)
              v-flex(v-for="result in searchResults" :key="result.name").search-results
                v-card
                  v-container(fluid grid-list-md)
                    //- Desktop layout for search
                    v-layout(row wrap).hidden-sm-and-down
                      v-flex(md4).image-wrapper
                        v-hover
                          v-img(:src="result.imgSrc" width="100%" height="15rem" cover
                          slot-scope="{ hover }")
                            v-layout(slot="placeholder" fill-height align-center justify-center)
                              v-progress-circular(indeterminate color="grey lighten-5")
                            v-expand-transition
                              .d-flex(v-if="hover" style="height: 100%"
                              class="transition-fast-in-fast-out green darken-2 v-card--reveal display-3 white--text")
                                v-btn(dark @click="openImageDialog(result.name, result.name)") View All Images

                      v-flex(md4).result-column.pl-3
                        div
                          h1.font-weight-thin.grey--text.text--darken-3.pl-2 {{result.name}}
                          h3.grey--text.mt-2.pl-2 {{result.location}}
                        div
                          h3.title.mb-2.pl-2 Starting @ ₹ {{result.starting}}
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
                        v-img(:src="result.imgSrc" contain @click="openImageDialog(result.name, result.name)")
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
import navbar from '../Navbar.vue';
import SearchImagesDialog from './SearchImagesDialog.vue';
import { EventBus } from '../../event-bus';

export default {
  components: {
    navbar,
    InfiniteLoading,
    SearchImagesDialog,
  },
  data() {
    return {
      searchInput: '',
      searchResults: [{
        name: 'Chopta Camp', location: 'Chamoli, Uttarakhand', starting: '5000', rating: 4.6, imgSrc: 'https://images.pexels.com/photos/939723/pexels-photo-939723.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200',
      }, {
        name: 'Leh Camp', location: 'Jammu and Kashmir', starting: '8000', rating: 4.2, imgSrc: 'https://images.pexels.com/photos/965153/pexels-photo-965153.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      }, {
        name: 'Thar Camp', location: 'Rajasthan', starting: '15000', rating: 5, imgSrc: 'https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      }, {
        name: 'Himanchal Camp', location: 'Himanchal Pradesh', starting: '3000', rating: 3, imgSrc: 'https://images.pexels.com/photos/6714/light-forest-trees-morning.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      }],
      searchComplete: false,
      fromDate: null,
      toDate: null,
      tripDurationMenu: false,
      minPrice: 5000,
      maxPrice: 20000,
      priceRange: [5000, 20000],
      priceLabels: [],
    };
  },
  mounted() {
    for (let i = this.minPrice; i <= this.maxPrice; i += 500) {
      this.priceLabels.push(i);
    }
    this.searchComplete = true;
    this.searchInput = this.$route.params.searchterm;
  },

  methods: {
    searchClick() {
    },
    openImageDialog(campId, campName) {
      EventBus.$emit('open-image-dialog', { campId, campName });
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
