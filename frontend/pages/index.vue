<template lang="pug">
  div
    HomeNav
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
          h2.tagline Bringing camping 🏕 to your doorstep 🚪
          //- v-layout(row).hidden-sm-and-down
          //-   v-flex(justify-center align-center md4).button-flex
          //-     v-btn(outline color="blue" fab @click="login")
          //-       v-icon account_box
          //-     h3.subheading Account
          //-   v-flex(justify-center align-center md4).button-flex
          //-     v-btn(color="green" fab outline)
          //-       v-icon pages
          //-     h3.subheading Featured Camps
          //-   v-flex(justify-center align-center md4).button-flex
          //-     v-btn(color="blue-grey" fab outline @click="$router.push('blogs')")
          //-       v-icon chrome_reader_mode
          //-     h3.subheading Blogs

          //- //- Mobile Layout
          //- v-layout(row).hidden-md-and-up
          //-   v-flex(justify-center align-center sm4).button-flex
          //-     v-btn(outline color="blue" fab @click="login" small)
          //-       v-icon account_box
          //-     h3.body-2 Account
          //-   v-flex(justify-center align-center sm4).button-flex
          //-     v-btn(color="green" fab outline small)
          //-       v-icon pages
          //-     h3.body-2 Featured Camps
          //-   v-flex(justify-center align-center sm4).button-flex
          //-     v-btn(color="blue-grey" fab outline small @click="$router.push('blogs')")
          //-       v-icon chrome_reader_mode
          //-     h3.body-2 Blogs
      v-container(fluid)
        v-flex.more_btn.pt-5
          v-btn(icon large color='green' dark @click='showContent')
            v-icon keyboard_arrow_down
        v-flex.why_campzy(v-html='content' transition="scale-transition" origin="center center")
        

        
       
       
          
        


    Footer
</template>

<script>
import anime from 'animejs'
import HomeNav from '../components/HomePageNav.vue'
import Footer from '../components/Footer.vue'

export default {
  name: 'Home',
  metaInfo: {
    title: 'Campzy'
  },
  components: {
    Footer,
    HomeNav
  },
  data() {
    return {
      searchInput: '',
      searchClicked: false,
      content: ''
    }
  },
  mounted() {
    // Animate Home Elements

    anime({
      targets: [
        '.campzy-logo',
        '.search-flex .v-input',
        '.home-flex .account-flex',
        '.home-flex .actions-flex',
        '.more_btn'
      ],
      translateY: [{ value: 100, duration: 0 }, { value: 0, duration: 500 }],
      opacity: [0, 1],
      easing: 'easeInOutQuad',
      duration: 500,
      elasticity: 1200,
      delay(target, index) {
        return index * 150
      }
    })

    this.scrollToLoadContent()
  },
  methods: {
    scrollToLoadContent() {
      window.onscroll = () => {
        const bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight ===
          document.documentElement.offsetHeight

        if (bottomOfWindow) {
          this.content =
            '<h2 class="details_tagline"> Just think how many people you need to call to plan a camping trip right now? </br> Campzy books camps in one click!</h2>' +
            '<img class="camp_img" src="/android-chrome-192x192.png"/>'
        }

        if (document.documentElement.scrollTop === 0) {
          this.content = ''
        }
      }
    },
    showContent() {
      this.content =
        '<h2 class="details_tagline"> Just think how many people you need to call to plan a camping trip right now? </br> Campzy books camps in one click!</h2>' +
        '<img class="camp_img" src="/android-chrome-192x192.png"/>'
    },
    login() {
      if (this.$cookie.get('sessionToken')) {
        this.$router.push('profile')
      } else {
        this.$router.push('login')
      }
    },
    searchClick() {
      if (this.searchInput === '') {
        anime({
          targets: ['.search-flex .v-input'],
          translateX: [
            { value: -50, duration: 100 },
            { value: 0, duration: 100 }
          ],
          easing: 'easeInOutQuad',
          loop: 2,
          delay(target, index) {
            return index * 100
          }
        })
      } else {
        this.$router.push(`/search/${this.searchInput}`)
      }
    }
  }
}
</script>

<style lang="scss">
.home-flex {
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  max-height: 100vh;

  .search-flex {
    margin-top: 20rem;
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
      .v-input__slot {
        border-radius: 30px !important;
      }
    }

    .actions-flex {
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
        font-family: 'GlacialIndifferenceRegular', sans-serif !important;
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

.tagline {
  font-weight: normal;
  font-size: 24px;
  letter-spacing: 4px;

  @media screen and (max-width: 960px) {
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 1px;
  }
}

.why_campzy {
  padding-top: 5rem;
  text-align: center;
  @media screen and (max-width: 960px) {
    padding-top: 2rem;
  }
  .details_tagline {
    font-weight: normal;
    font-size: 25px;
    text-align: center;
    animation: fadeInFadeOut 2s;
    @media screen and (max-width: 960px) {
      font-size: 14px;
      font-weight: normal;
      letter-spacing: 1px;
    }
  }
  .camp_img {
    height: 80px;
    width: 75px;
    margin-top: 1rem;
    animation: fadeInFadeOut 2s;
    @media screen and (max-width: 960px) {
      height: 70px;
      width: 65px;
    }
  }
}

.more_btn {
  text-align: center;
}

@keyframes fadeInFadeOut {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
