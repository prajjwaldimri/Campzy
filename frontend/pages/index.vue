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
    div     
      v-container(fluid)
        v-flex.more_btn
          v-btn(icon large color='green' dark @click='getFeaturedCamps')
            v-icon keyboard_arrow_down
      

      .featuredCamps(v-show="isFeaturedCamps")
        h1 Our Featured Camps
        .camps-grid.mt-4
          v-card.wide-card(:href="'/camp/' + camp.url" v-for='(camp, index) in allCamps' :img="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + camp.heroImage" :key="index")
            .card-container
              v-card-title.camp-title.fill-height.align-end(primary-title)
                .div(style="display:flex;flex-direction:column")
                  h2.main-card-title.white--text(style="line-height: 1.5 !important") {{camp.location}}
                  h1.main-card-title.white--text(style="line-height: 1.5 !important") {{camp.name}}
      .loading-div.mt-1
        v-btn(v-show="loadingCamps" large flat :loading='isLoadingCamps')
      v-container.why_campzy(fluid v-show="isFeaturedCamps")
        v-flex(v-html='featuredBtnText')
        v-flex(v-html='featuredBtn' @click="$router.push('/aboutUs')")
        
       

      

    Footer
</template>

<script>
import { request } from 'graphql-request'
import anime from 'animejs'
import HomeNav from '../components/HomePageNav.vue'
import Footer from '../components/Footer.vue'
import { getFeaturedCamps } from '../queries/queries'
import { EventBus } from '../layouts/event-bus'

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
      allCamps: [],
      featuredBtn: '',
      featuredBtnText: '',
      isFeaturedCamps: false,
      isLoadingCamps: true,
      loadingCamps: false
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
        if (document.documentElement.scrollTop > 0) {
          this.featuredBtnText =
            '<h2 class="large_heading" > Convinced yet? </h2>' +
            '<h2 class="details_tagline"> Just think how many people you need to call to plan a camping trip right now? </br> Campzy books camps in one click!</h2>'

          this.featuredBtn =
            '<button type="button" class="featured_btn">Wanna Know More?</button>'
        }

        if (document.documentElement.scrollTop === 0) {
          this.allCamps = []
          this.isFeaturedCamps = false
        }
      }
    },

    getFeaturedCamps() {
      this.loadingCamps = true
      request('https://api.campzy.in/graphql', getFeaturedCamps)
        .then(data => {
          this.isFeaturedCamps = true
          this.allCamps = data.getFeaturedCamps
          this.loadingCamps = false
        })
        .catch(() => {
          EventBus.$emit(
            'show-info-notification-short',
            'Cannot get blogs at this time. Please try again.'
          )
        })
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
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
  max-height: 100vh;
  @media screen and (max-width: 960px) {
    max-height: 40vh !important;
  }
  .search-flex {
    margin-top: auto;
    margin-bottom: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media screen and (max-width: 960px) {
      margin-top: 8rem;
    }

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

.more_btn {
  text-align: center;
  padding-top: 6rem;
  animation: bounce 2s infinite both;
  @media screen and (max-width: 960px) {
    padding-top: 4rem;
  }
}

.featuredCamps {
  margin: 8rem 5rem;
}

.camps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
  grid-gap: 2rem;
}

.wide-card {
  height: 300px;
  transition: transform 1s;
  border-radius: 5px;
  &:hover {
    transform: translateY(-15px);
  }
}

.card-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

.camp-title {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7),
    rgba(255, 255, 255, 0)
  );
}

.align-end {
  align-items: flex-end !important;
}

.main-card-title {
  text-shadow: 0px 0px 20px grey;
}
.loading-div {
  display: flex;
  flex-direction: row;
  justify-content: center;
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
