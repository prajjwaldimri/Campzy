<template lang="pug">
  .home-flex
    .search-flex
      .campzy-logo.pb-3
        img(src="/vectors/Campzy-logo.svg")
      v-text-field( append-icon="search"
      @click:append="searchClick" autofocus color="green" solo single-line required ticks
      v-model="searchInput" @keyup.enter="searchClick")
      h3.title.grey--text.pt-1(style="max-width:70%") Try searching for Nature, Leh, Mountains.....

</template>

<script>

import anime from 'animejs';

export default {
  name: 'Home',
  data() {
    return {
      searchInput: '',
      searchClicked: false,
    };
  },
  mounted() {
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
        this.$router.push(`/search/${this.searchInput}`);
      }
    },
  },
};
</script>

<style lang="scss">
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
    display: flex;
    flex-direction: column;
    align-items: center;

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

      img {
        height: 4rem;
      }
    }
  }

  .green-text {
    color: #2ecc71;
  }
}
</style>
