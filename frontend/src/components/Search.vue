<template lang="pug">
  .home
    transition(name="slide-y-transition" appear)
      navbar
    transition(name="slide-y-transition" appear)
      v-container(fluid grid-list-md ).top-search
        v-layout(row wrap justify-center)
          v-flex(md4 xs12)
            v-text-field(label="Try Nature, Leh, Mountains....." append-icon="search"
            autofocus color="green" solo single-line required v-model="searchInput"
            @click:append="searchClick" @keyup.enter="searchClick")
          v-flex(md4 xs12 justify-center style="display:flex")
            v-menu(v-model="tripDurationMenu" offset-y transition="slide-y-transition"
            :close-on-content-click="false" lazy)
              v-select(hint="Select your trip duration" readonly label="21 August - 25 August"
              slot="activator" color="primary" solo single-line persistent-hint)
              v-date-picker(v-model="fromDate" no-title scrollable)
              v-date-picker(v-model="toDate" no-title scrollable)
          v-flex(md4 xs12)
            v-layout(row)
              v-flex(xs3)
                v-text-field(solo single-line readonly v-model="priceRange[0]" hint="Min. Price"
                persistent-hint)
              v-flex(xs6 style="margin: 0 1rem;")
                v-range-slider(v-model="priceRange" :max="20000" :min="5000" :step="500"
                hint="Price Range" persistent-hint height="3.5rem" color="green")
              v-flex(xs3)
                v-text-field(solo single-line readonly v-model="priceRange[1]" hint="Max. Price"
                persistent-hint)

    v-container(grid-list-md v-show="searchComplete")
      v-layout(column)
        v-flex(v-for="result in searchResults" :key="result").search-results
          v-card(hover)
            v-container(fluid grid-list-md)
              v-layout(row wrap)
                v-flex(sm12 md3).image-wrapper
                  img(:src="result.imgSrc" height="100%", width="100%")
                v-flex(sm12 md3).result-column
                  h1.font-weight-thin.grey--text.text--darken-3 {{result.name}}
                  h3.grey--text.mb-2 {{result.location}}

                  h3.title.mb-2 Starting @ ₹ {{result.starting}}

                  v-chip(label color="green" text-color="white").ma-0
                    v-avatar(tile class="green darken-4") {{result.rating}}
                    span.caption.increase-letter-spacing-2 Excellent

                  //- v-btn(color="green") BOOK NOW!

                v-flex(md3).result-column.hidden-sm-and-down
                  .row.feature-row
                    v-icon.mr-3 directions_car
                    span.increase-letter-spacing-1 3 Hour Drive
                  .row.feature-row
                    v-icon.mr-3 airplanemode_active
                    span.increase-letter-spacing-1 1 Hour Flight
                  .row.feature-row
                    v-icon.mr-3 wifi_off
                    span.increase-letter-spacing-1 No Internet
                  .row.feature-row
                    v-icon.mr-3 accessible
                    span.increase-letter-spacing-1 Wheel Chair Accessible
                  .row.feature-row
                    v-icon.mr-3.green--text check_circle
                    span.increase-letter-spacing-1 Campzy Quality Assurance

                v-flex(md3).pr-2.result-column.hidden-sm-and-down
                  v-btn(small color="green" block).white--text Book Now!
                    v-icon(right dark) shop_two
                  v-btn(small dark block).white--text Learn More
                  v-btn(small dark block).white--text Location on Map

                v-flex(sm12).px-2.hidden-md-and-up.result-column
                  v-btn(color="green").white--text Book Now!
                    v-icon(right dark) shop_two


</template>

<script>
import navbar from './Navbar.vue';

export default {
  components: {
    navbar,
  },
  data() {
    return {
      searchInput: '',
      searchResults: [{
        name: 'Chopta Camp', location: 'Chamoli, Uttarakhand', starting: '5000', rating: '4.6', imgSrc: 'https://images.pexels.com/photos/939723/pexels-photo-939723.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200',
      }, {
        name: 'Leh Camp', location: 'Jammu and Kashmir', starting: '8000', rating: '4.2', imgSrc: 'https://images.pexels.com/photos/965153/pexels-photo-965153.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      }, {
        name: 'Thar Camp', location: 'Rajasthan', starting: '15000', rating: '4.9', imgSrc: 'https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
      }, {
        name: 'Himanchal Camp', location: 'Himanchal Pradesh', starting: '3000', rating: '4.8', imgSrc: 'https://images.pexels.com/photos/6714/light-forest-trees-morning.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
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
  },
};
</script>

<style lang="scss">
.feature-row {
  display: flex;
  align-items: center;
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
    height: 13rem;
    @media screen and (max-width: 960px) {
      padding: 0 0 0 0 !important;
    }
    padding: 0 1rem 0 0 !important;
  }
}

.home {
  min-height: 100vh;
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
}
</style>
