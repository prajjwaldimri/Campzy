<template lang="pug">
  .home-flex
    .search-flex
      .campzy-logo.pb-4.pt-4
        img(src="/vectors/Campzy-logo.svg")
      v-text-field( append-icon="search"
      @click:append="searchClick" autofocus color="green" solo single-line required ticks
      v-model="searchInput" @keyup.enter="searchClick"
      hint="You can search for Nature, Leh, Mountains, etc.").mb-0

      .d-flex.actions-flex
        v-flex(justify-center align-center).button-flex.px-2
          v-btn(outline color="blue" fab to="login")
            v-icon vpn_key
          h3.subheading Login/Register
        v-flex(justify-center align-center).button-flex.px-1
          v-btn(color="orange darken-2" fab outline)
            v-icon trending_up
          h3.subheading Trending Camps
        v-flex(justify-center align-center).button-flex.px-2
          v-btn(color="green darken-2" fab to="profile" outline)
            v-icon account_box
          h3.subheading My Account

    //- .d-flex.users-flex.py-2
    //-   h1.headline.grey--text.text--darken-2.mb-2(style="text-align: center")
    //-     | Currently operational in Uttarakhand and Himanchal Pradesh
    //-   span.title.grey--text.text--darken-1.hidden-sm-and-down
    //-     ICountUp(:startVal="0" :endVal="51235" :duration="2" :options="{useEasing: true}")
    //-     |  users served


</template>

<script>

import anime from 'animejs';
import ICountUp from 'vue-countup-v2';

export default {
  name: 'Home',
  metaInfo: {
    title: 'Campzy',
  },
  components: {
    ICountUp,
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
          letter-spacing: 1px;
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
