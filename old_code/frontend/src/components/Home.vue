<template lang="pug">
  div
    .home-flex
      .search-flex
        .campzy-logo.pb-4.pt-4
          //- img(src="/vectors/Campzy-logo-black.svg")
          span.display-3 Camp
          span.display-3.green--text zy
        v-text-field( append-icon="search"
        @click:append="searchClick" autofocus color="green" solo single-line required ticks
        v-model="searchInput" @keyup.enter="searchClick"
        hint="You can search for Nature, Leh, Mountains, etc.").mb-0

        .d-flex.actions-flex.py-2
          v-layout(row).hidden-sm-and-down
            v-flex(justify-center align-center md4).button-flex
              v-btn(outline color="blue" fab @click="login")
                v-icon account_box
              h3.subheading Account
            v-flex(justify-center align-center md4).button-flex
              v-btn(color="green" fab outline)
                v-icon pages
              h3.subheading Featured Camps
            v-flex(justify-center align-center md4).button-flex
              v-btn(color="blue-grey" fab outline @click="$router.push('blogs')")
                v-icon chrome_reader_mode
              h3.subheading Blogs

          //- Mobile Layout
          v-layout(row).hidden-md-and-up
            v-flex(justify-center align-center sm4).button-flex
              v-btn(outline color="blue" fab @click="login" small)
                v-icon account_box
              h3.body-2 Account
            v-flex(justify-center align-center sm4).button-flex
              v-btn(color="green" fab outline small)
                v-icon pages
              h3.body-2 Featured Camps
            v-flex(justify-center align-center sm4).button-flex
              v-btn(color="blue-grey" fab outline small @click="$router.push('blogs')")
                v-icon chrome_reader_mode
              h3.body-2 Blogs


    Footer
</template>

<script>

import anime from 'animejs';
import ICountUp from 'vue-countup-v2';
import Footer from './Footer.vue';

export default {
  name: 'Home',
  metaInfo: {
    title: 'Campzy',
  },
  components: {
    ICountUp,
    Footer,
  },
  data() {
    return {
      searchInput: '',
      searchClicked: false,
    };
  },
  mounted() {
    // Animate Home Elements

    anime({
      targets: ['.campzy-logo', '.search-flex .v-input', '.home-flex .account-flex', '.home-flex .actions-flex'],
      translateY: [{ value: 100, duration: 0 }, { value: 0, duration: 500 }],
      opacity: [0, 1],
      easing: 'easeInOutQuad',
      duration: 500,
      elasticity: 1200,
      delay(target, index) {
        return index * 150;
      },
    });
  },
  methods: {
    login() {
      if (this.$cookie.get('sessionToken')) {
        this.$router.push('profile');
      } else {
        this.$router.push('login');
      }
    },
    searchClick() {
      if (this.searchInput === '') {
        anime({
          targets: ['.search-flex .v-input'],
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
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  max-height: 100vh;

  .search-flex {
    margin-top: auto;
    margin-bottom: auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    .v-input {
      min-width: 40vw;
      user-select: none;
      @media screen and (max-width: 960px) {
        min-width: 90vw;
      }
    }

    .actions-flex {
      width: 100%;
      align-content: space-between;
      flex-wrap: wrap;

      .button-flex {
        display: flex;
        flex-direction: column;

        > .subheading {
          letter-spacing: 0.0625em;
        }
      }
    }

    .campzy-logo {
      min-width: 40vw;
      @media screen and (max-width: 960px) {
        min-width: 90vw;
      }
      text-align: center;
      user-select: none;

      .display-3 {
        font-family: "GlacialIndifferenceRegular", sans-serif !important;
        font-size: 5rem !important;
      }

      img {
        height: 4.2rem;
      }
    }
  }

  .users-flex {
    flex-direction: column;
    align-items: center;
  }

  .green-text {
    color: #2ecc71;
  }
}
</style>
