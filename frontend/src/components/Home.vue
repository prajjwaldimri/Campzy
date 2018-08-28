<template lang="pug">
  .home
    .home-flex
      .search-flex
        .campzy-logo
          img(src="/vectors/Campzy-logo.svg")
        v-text-field(label="Try searching for Nature, Leh, Mountains....." append-icon="search"
        @click:append="searchClick" autofocus color="green" solo single-line required ticks
        v-model="searchInput" @keyup.enter="searchClick" hint="Press Enter To Search!")

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
            this.searchComplete = true;
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

.home-flex {
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  max-height: 100vh;

  .search-flex {
    position: absolute;

    .v-input {
      min-width: 40vw;
      user-select: none;
    }

    .campzy-logo {
      min-width: 40vw;
      @media screen and (max-width: 960px) {
        min-width: 90vw;
      }
      text-align: center;
      user-select: none;
      padding: 1rem;

      img {
        height: 3.5rem;
      }
    }
  }

  .green-text {
    color: #2ecc71;
  }
}
</style>
