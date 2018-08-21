<template lang="pug">
  .home
    transition(name="slide-y-transition")
      navbar(v-show="searchClicked")
    transition(name="slide-y-transition")
      .top-search
        h1 Hello
    .home-flex
      .search-flex
        .campzy-logo
          span Camp
          span.light-green--text.text--accent-4 zy
        v-text-field(label="Try Nature, Leh, Mountains....." append-icon="search"
        @click:append="searchClick" autofocus color="green" outline single-line required)

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
      searchClicked: false,
    };
  },
  mounted() {
    // Animate Home Elements
    anime({
      targets: ['.campzy-logo', '.v-input'],
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
      anime({
        targets: ['.campzy-logo', '.v-input'],
        translateY: [{ value: -1000, duration: 1000 }],
        easing: 'easeInOutQuad',
        complete: () => {
          document.querySelector('.search-flex').style.display = 'none';
          this.searchClicked = true;
        },
        delay(target, index) {
          return index * 100;
        },
      });
    },
  },
};
</script>

<style lang="scss">
.home-flex {
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url("https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?cs=srgb&dl=camp-camping-dark-45241.jpg&fm=jpg");
  background-size: cover;

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
