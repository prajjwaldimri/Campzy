<template lang="pug">
  .home
    transition(name="slide-y-transition")
      navbar(v-show="searchClicked")
    transition(name="slide-y-transition")
      v-container(fluid grid-list-md v-show="searchClicked").top-search
        v-layout(row wrap justify-center)
          v-flex(md4 xs12)
            v-text-field(label="Try Nature, Leh, Mountains....." append-icon="search"
            autofocus color="green" outline single-line required v-model="searchInput")
          v-flex(md4 xs12 justify-center style="display:flex")
            v-menu(v-model="tripDurationMenu" offset-y transition="slide-y-transition"
            :close-on-content-click="false" lazy)
              v-select(hint="Select your trip duration" readonly label="21 August - 25 August"
              slot="activator" color="primary" outline single-line persistent-hint)
              v-date-picker(v-model="fromDate" no-title scrollable)
              v-date-picker(v-model="toDate" no-title scrollable)
          v-flex(md4 xs12)
            v-layout(row)
              v-flex(xs3)
                v-text-field(outline single-line readonly v-model="priceRange[0]" hint="Min. Price"
                persistent-hint)
              v-flex(xs6 style="margin: 0 1rem;")
                v-range-slider(v-model="priceRange" :max="20000" :min="5000" :step="500"
                hint="Price Range" persistent-hint height="3.5rem")
              v-flex(xs3)
                v-text-field(outline single-line readonly v-model="priceRange[1]" hint="Max. Price"
                persistent-hint)

    v-container(grid-list-md v-show="searchComplete")
      v-layout(column)
        v-flex(v-for="result in searchResults" :key="result").search-results
          v-card(height="300")
            h1 {{result}}
    .home-flex
      .search-flex
        .campzy-logo
          span Camp
          span.light-green--text.text--accent-4 zy
        v-text-field(label="Try Nature, Leh, Mountains....." append-icon="search"
        @click:append="searchClick" autofocus color="green" outline single-line required ticks
        v-model="searchInput" @keyup.enter="searchClick")

</template>

<script>

import anime from 'animejs';
import navbar from './Navbar.vue';

export default {
  name: 'Home',
  components: {
    navbar,
  },
  data() {
    return {
      searchInput: '',
      searchClicked: false,
      searchResults: [1, 2, 3],
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
    // Animate Home Elements
    anime({
      targets: ['.campzy-logo', '.search-flex .v-input'],
      translateY: [{ value: 100, duration: 0 }, { value: 0, duration: 500 }],
      opacity: [0, 1],
      easing: 'easeInOutQuad',
      duration: 500,
      elasticity: 1200,
      delay(target, index) {
        return index * 100;
      },
    });
  },
  methods: {
    searchClick() {
      if (this.searchInput === '') {
        anime({
          targets: '.search-flex .v-input',
          translateX: [{ value: -50, duration: 100 }, { value: 0, duration: 100 }],
          easing: 'easeInOutQuad',
          loop: 2,
          delay(target, index) {
            return index * 100;
          },
        });
      } else {
        anime({
          targets: ['.campzy-logo', '.search-flex .v-input'],
          translateY: [{ value: -500, duration: 500 }],
          easing: 'easeInOutQuad',
          complete: () => {
            document.querySelector('.home-flex').style.display = 'none';
            this.searchClicked = true;
          },
          delay(target, index) {
            return index * 100;
          },
        });
      }
    },
  },
  watch: {
    searchComplete(val) {
      if (val === true) {
        anime({
          targets: '.search-results',
          translateY: [{ value: 100, duration: 250 }, { value: 0, duration: 250 }],
          easing: 'easeInOutQuad',
          opacity: [0, 1],
          duration: 500,
          delay(el, index) { return index * 100; },
        });
      }
    },
  },
};
</script>

<style lang="scss">
.top-search {
  margin-top: 4rem !important;
}

.home {
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url("https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?cs=srgb&dl=camp-camping-dark-45241.jpg&fm=jpg");
  background-size: cover;
}

.home-flex {
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 90vh;

  .search-flex {
    position: absolute;

    .v-input {
      min-width: 50vw;
      user-select: none;
    }

    .campzy-logo {
      min-width: 50vw;
      text-align: center;
      user-select: none;
    }
  }

  .campzy-logo > * {
    font-size: 3.5rem;
  }

  .green-text {
    color: #2ecc71;
  }
}
</style>
