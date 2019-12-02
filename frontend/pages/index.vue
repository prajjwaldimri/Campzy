<template lang="pug">
  div
    HomeNav(:dark="false")
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
      //- .loading-div.mt-1
      //-   vue-loaders-ball-pulse(color="green" scale="0.8" v-if="loadingCamps")
      //- .featuredCamps(v-show="isFeaturedCamps")
      //-   h1.headings Our Featured Camps
      //-   .camps-grid.mt-4
      //-     v-card.wide-card(:href="'/camp/' + camp.url" v-for='(camp, index) in allCamps' :img="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + camp.heroImage" :key="index")
      //-       .card-container
              
      //-         v-card-title.camp-title.fill-height.align-end(primary-title)
      //-           v-layout(row)
      //-             .div(style="display:flex;flex-direction:column")
      //-               h2.main-card-title.white--text(style="line-height: 1.5 !important") {{camp.location}}
      //-               h1.main-card-title.white--text(style="line-height: 1.5 !important") {{camp.name}}
      //-             v-spacer
      //-             .d-flex(style="text-align:right;")
      //-               span.align-right.pt-1(style='width:100%;')
      //-                 v-icon(dark color="green") star
      //-                 span.title.pl-1.green--text.font-weight-bold {{camp.averageRating}}
                      
      
      //- .wishListCamps(v-show="isWishListCamps")
      //-   h1.headings Camps from Your Wishlist
      //-   .camps-grid.mt-4
      //-     v-card.wide-card(:href="'/camp/' + camp.url" v-for='(camp, index) in wishList' :img="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + camp.heroImage" :key="index")
      //-       .card-container
      //-         v-card-title.camp-title.fill-height.align-end(primary-title)
      //-           v-layout(row)
      //-             .div(style="display:flex;flex-direction:column")
      //-               h2.main-card-title.white--text(style="line-height: 1.5 !important") {{camp.location}}
      //-               h1.main-card-title.white--text(style="line-height: 1.5 !important") {{camp.name}}
      //-             v-spacer
      //-             .d-flex(style="text-align:right;")
      //-               span.align-right.pt-1(style='width:100%;')
      //-                 v-icon(dark color="green") star
      //-                 span.title.pl-1.green--text.font-weight-bold {{camp.averageRating}}
      
      v-container.trip-container(fluid)
        .d-flex.trip-div
          v-flex
            h2.large_heading(style="color:white") Take a Trip with us!
            h2.details_tagline.hidden-sm-and-down(style="color:white") Campzy provides a 3 days 3 nights Chopta-Chandrashila Trip from Delhi for you, 
            .details_tagline.hidden-sm-and-down(style="color:white") with first-rated facilities on affordable prices.
            h2.details_tagline.hidden-md-and-up(style="color:white") Campzy provides a 3 days 3 nights Chopta-Chandrashila Trip from Delhi for you, with first-rated facilities on affordable prices.
          v-flex
            v-btn.featured_btn(large @click="$router.push('/trips/chopta-chandrashila')") Know More about Trips
      
      v-container.why_campzy(fluid)
        v-flex(v-html='featuredBtnText')
        v-flex(v-html='featuredBtn' @click="$router.push('/aboutUs')")
        
       

      

    Footer(style="margin-top:13rem")
</template>

<script>
// import { GraphQLClient, request } from 'graphql-request'
import anime from 'animejs'
import HomeNav from '../components/HomePageNav.vue'
import Footer from '../components/Footer.vue'
// import { getFeaturedCamps } from '../queries/queries'

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
      // isFeaturedCamps: false,
      isLoadingCamps: true,
      loadingCamps: true,
      wishList: []
      // isWishListCamps: false
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
      translateY: [
        { value: 100, duration: 0 },
        { value: 0, duration: 500 }
      ],
      opacity: [0, 1],
      easing: 'easeInOutQuad',
      duration: 500,
      elasticity: 1200,
      delay(target, index) {
        return index * 150
      }
    })

    this.scrollToLoadContent()
    this.getFeaturedCamps()
    this.getCampsFromWishList()
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
      }
    },

    // getFeaturedCamps() {
    //   request('https://api.campzy.in/graphql', getFeaturedCamps)
    //     .then(data => {
    //       this.isFeaturedCamps = true
    //       this.allCamps = data.getFeaturedCamps
    //     })
    //     .catch(() => {
    //       this.isFeaturedCamps = false
    //     })
    //     .finally(() => {
    //       this.loadingCamps = false
    //     })
    // },

    // getCampsFromWishList() {
    //   const getWishlistInIndex = `query getWishlistInProfile{
    //   getWishlistInProfile{
    //     localWishlist{
    //       id,
    //       name,
    //       url,
    //       location,
    //       averageRating,
    //       heroImage,
    //         }
    //       }
    //     }`
    //   const client = new GraphQLClient('https://api.campzy.in/graphql', {
    //     headers: {
    //       Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
    //     }
    //   })

    //   client
    //     .request(getWishlistInIndex)
    //     .then(data => {
    //       this.isWishListCamps = true
    //       this.wishList = data.getWishlistInProfile.localWishlist
    //       if (this.wishList.length === 0) {
    //         this.isWishListCamps = false
    //       }
    //     })
    //     .catch(() => {
    //       this.isWishListCamps = false
    //     })
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
  margin: 4rem 5rem;
  @media screen and (max-width: 960px) {
    margin: 3rem 1rem;
  }
}

.wishListCamps {
  margin: 4rem 5rem;
  margin-top: 12rem;
  @media screen and (max-width: 960px) {
    margin: 3rem 1rem;
  }
}

.camps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
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
.rating-bar {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
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
  justify-content: center;
}

.why_campzy {
  text-align: center;
  margin-top: 10rem;
  @media screen and (max-width: 960px) {
    margin-top: 4rem;
  }
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

.trip-container {
  height: 70vh;
  text-align: center;
  margin-top: 10rem;
  padding: 0;
  background-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.8),
      rgba(0, 0, 0, 0.8)
    ),
    url('/vectors/chandrashila3.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  @media screen and (max-width: 960px) {
    margin-top: 4rem;
  }

  .trip-div {
    flex-direction: column;
    align-items: center;
    height: 90%;
    justify-content: center;
    margin: auto;
    & > * {
      flex-grow: 0 !important;
    }
  }
}

.headings {
  font-weight: 600;
  display: inline-block;
  position: relative;
  padding: 20px 0;
}
.headings::after {
  content: '';
  width: 50%;
  height: 6px;
  left: 0;
  bottom: 0;
  position: absolute;
  z-index: 9;
  background: linear-gradient(to right, green 100%, white 0%);
}

.featured_btn {
  background-color: #4caf50 !important;
  color: white !important;
  border-radius: 40px;
  height: 60px;
  width: 370px;
  font-size: 25px !important;
  margin-top: 3rem;
  @media screen and (max-width: 960px) {
    font-size: 18px !important;
    height: 45px;
    width: 280px;
    font-size: 20px;
  }
}

.featured_btn:hover {
  transform: scale(1.1);
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
