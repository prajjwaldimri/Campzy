<template lang="pug">
  .home
    transition(name="slide-y-transition")
      navbar(v-show="searchClicked")
    transition(name="slide-y-transition")
      v-container(fluid grid-list-md).top-search
        v-layout(row wrap)
          v-flex(sm4 xs12)
            v-text-field(label="Try Nature, Leh, Mountains....." append-icon="search"
            autofocus color="green" outline single-line required)
          v-flex(md3)
            v-menu(v-model="tripDurationMenu" offset-y transition="slide-y-transition"
            :close-on-content-click="false" lazy)
              v-select(readonly label="21 August - 25 August" slot="activator" color="primary"
              outline single-line)
              v-date-picker(v-model="fromDate" no-title scrollable)
              v-date-picker(v-model="toDate" no-title scrollable)
          v-flex(md2)
          v-flex(md2)
          v-flex(md2)
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
      fromDate: null,
      toDate: null,
      tripDurationMenu: false,
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
.top-search {
  margin-top: 5rem !important;
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
