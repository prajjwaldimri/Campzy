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
    //- div     
    //-   v-container(fluid)
    //-     v-flex.more_btn
    //-       v-btn(icon large color='green' dark @click='showContent')
    //-         v-icon keyboard_arrow_down
    //-     v-flex.why_campzy(v-html='whyCmapzycontent')
    //-   v-container.content_container(fluid)
    //-     v-layout(row wrap)
    //-       v-flex.text_content(xs12 md5 v-html='valueForMoney')
    //-       v-flex.scroll_image(xs12 md7 v-html='valueForMoneyImg')
    //-   v-container.content_container_right(fluid)
    //-     v-layout(row wrap)
    //-       v-flex.scroll_image(xs12 md7 v-html='exoticLocationsImg')
    //-       v-flex.text_content(xs12 md5 v-html='exoticLocations')
    //-   v-container.content_container(fluid)
    //-     v-layout(row wrap)
    //-       v-flex.text_content(xs12 md5 v-html='paymentOptions')
    //-       v-flex.scroll_image(xs12 md7 v-html='paymentOptionsImg')
    //-   v-container.why_campzy(fluid)
    //-     v-flex(v-html='featuredBtnText')
    //-     v-flex(v-html='featuredBtn')
          


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
      whyCmapzycontent: '',
      valueForMoney: '',
      valueForMoneyImg: '',
      exoticLocations: '',
      exoticLocationsImg: '',
      paymentOptions: '',
      paymentOptionsImg: '',
      featuredBtn: '',
      featuredBtnText: ''
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

    // this.scrollToLoadContent()
  },
  methods: {
    // scrollToLoadContent() {
    //   window.onscroll = () => {
    //     if (document.documentElement.scrollTop > 0) {
    //       this.whyCmapzycontent =
    //         '<h2 class="details_tagline"> Just think how many people you need to call to plan a camping trip right now? </br> Campzy books camps in one click!</h2>' +
    //         '<img class="camp_img" src="/android-chrome-192x192.png"/>'

    //       this.valueForMoney =
    //         '<h2 class="main_headings" > 💸 Get the best deals everytime </h2>' +
    //         '<h2 class="light_headings"> Here at campzy, we don’t trick users into buying something using price manupulation. Every price you see will be fair to the camp owners and you</h2>'

    //       this.valueForMoneyImg =
    //         '<img class="scroll_image" src="/vectors/money.svg"/>'

    //       this.exoticLocations =
    //         '<h2 class="main_headings" > Exotic Locations 🏔️ </h2>' +
    //         '<h2 class="light_headings"> Locations like you have never seen before including famous hotspots like Chopta, Rishikesh, Himachal, Caribbean etc.</h2>'

    //       this.exoticLocationsImg =
    //         '<img class="scroll_image" src="/vectors/mountain.svg"/>'

    //       this.paymentOptions =
    //         '<h2 class="main_headings" > 💳 Every payment option available </h2>' +
    //         '<h2 class="light_headings"> Whether you like UPI, credit card, debit card, online banking we accept everything.</h2>'

    //       this.paymentOptionsImg =
    //         '<img class="scroll_image" src="/vectors/payment.svg"/>'

    //       this.featuredBtnText =
    //         '<h2 class="large_heading" > Convinced yet? </h2>' +
    //         '<h2 class="details_tagline"> Just think how many people you need to call to plan a camping trip right now? </br> Campzy books camps in one click!</h2>'

    //       this.featuredBtn =
    //         '<button type="button" class="featured_btn">Show our featured camps</button>'
    //     }

    //     if (document.documentElement.scrollTop === 0) {
    //       this.whyCmapzycontent = ''
    //       this.valueForMoney = ''
    //       this.valueForMoneyImg = ''
    //       this.exoticLocations = ''
    //       this.exoticLocationsImg = ''
    //       this.paymentOptions = ''
    //       this.paymentOptionsImg = ''
    //       this.featuredBtn = ''
    //       this.featuredBtnText = ''
    //     }
    //   }
    // },
    // showContent() {
    //   this.whyCmapzycontent =
    //     '<h2 class="details_tagline"> Just think how many people you need to call to plan a camping trip right now? </br> Campzy books camps in one click!</h2>' +
    //     '<img class="camp_img" src="/android-chrome-192x192.png"/>'
    // },

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
    // @media screen and (max-width: 960px) {
    //   margin-top: 8rem;
    // }

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

.why_campzy {
  text-align: center;
  margin-top: 10rem;
  @media screen and (max-width: 960px) {
    margin-top: 4rem;
  }
  .details_tagline {
    font-weight: normal;
    font-size: 25px;
    text-align: center;
    color: gray;
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
  padding-top: 6rem;
  animation: bounce 2s infinite both;
  @media screen and (max-width: 960px) {
    padding-top: 4rem;
  }
}

.content_container {
  padding-left: 12rem;
  margin-top: 12rem;
  @media screen and (max-width: 960px) {
    padding: 1rem;
    margin-top: 4rem;
  }
}

.content_container_right {
  padding-right: 12rem;
  margin-top: 12rem;
  @media screen and (max-width: 960px) {
    padding: 1rem;
    margin-top: 4rem;
  }
}
.text_content {
  padding: 5rem 0 0 10rem;
  @media screen and (max-width: 960px) {
    padding: 0;
  }

  .light_headings {
    font-weight: normal;
    font-size: 25px;
    text-align: left;
    color: gray;
    animation: fadeInFadeOut 2s;
    @media screen and (max-width: 960px) {
      font-size: 14px;
      font-weight: normal;
      letter-spacing: 1px;
    }
  }

  .main_headings {
    font-weight: bold;
    font-size: 25px;
    text-align: left;
    animation: fadeInFadeOut 2s;
    @media screen and (max-width: 960px) {
      font-size: 14px;
      font-weight: normal;
      letter-spacing: 1px;
    }
  }
}

.scroll_image {
  margin: 0px;
  height: 300px;
  width: 450px;
  animation: fadeInFadeOut 2s;
  text-align: center;
  @media screen and (max-width: 960px) {
    height: 200px;
    width: 300px;
    margin: 1rem 0 1rem 0;
  }
}
.featured_btn {
  background-color: #4caf50;
  color: white;
  border-radius: 40px;
  height: 60px;
  width: 350px;
  font-size: 25px;
  margin-top: 3rem;
  @media screen and (max-width: 960px) {
    height: 45px;
    width: 280px;
    font-size: 20px;
  }
}

.large_heading {
  font-size: 40px;
  @media screen and (max-width: 960px) {
    font-size: 30px;
  }
}
@keyframes fadeInFadeOut {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-15px);
  }
  60% {
    transform: translateY(-10px);
  }
}
</style>
