<template lang="pug">
  div
    HomeNav
    v-container.content_container(fluid)
      v-layout(row wrap)
        v-flex.text_content(xs12 md5)
          h2.main_headings 💸 Get the best deals everytime
          h2.light_headings Here at campzy, we don’t trick users into buying something using price manupulation. Every price you see will be fair to the camp owners and you
        v-flex.scroll_image(xs12 md7)
          v-img.scroll_image(src='/vectors/money.svg')
    v-container.content_container_right(fluid)
      v-layout(row wrap)
        v-flex.scroll_image(xs12 md5)
          v-img.scroll_image(src='/vectors/mountain.svg')
        v-flex.text_content(xs12 md5)
          h2.main_headings Exotic Locations 🏔️
          h2.light_headings Locations like you have never seen before including famous hotspots like Chopta, Rishikesh, Himachal, Caribbean etc.
    v-container.content_container(fluid)
      v-layout(row wrap)
        v-flex.text_content(xs12 md5 )
          h2.main_headings 💳 Every payment option available
          h2.light_headings Whether you like UPI, credit card, debit card, online banking we accept everything.
        v-flex.scroll_image(xs12 md7)
          v-img.scroll_image(src='/vectors/payment.svg')
          
    Footer
</template>
<script>
import HomeNav from '../components/HomePageNav.vue'
import Footer from '../components/Footer.vue'
export default {
  name: 'About',
  metaInfo: {
    title: 'About Us'
  },
  components: {
    Footer,
    HomeNav
  }
}
</script>

<style lang="scss" scoped>
.aboutFlex {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
  max-height: 100vh;
  margin-top: 10rem;
  @media screen and (max-width: 960px) {
    max-height: 40vh !important;
    margin-top: 4rem;
  }
}

.text {
  display: flex;
  flex-direction: column;
}
// .details_tagline {
//   font-weight: normal;
//   font-size: 25px;
//   text-align: left;
//   color: gray;
//   animation: fadeInFadeOut 2s;
//   @media screen and (max-width: 960px) {
//     font-size: 14px;
//     font-weight: normal;
//     letter-spacing: 1px;
//   }
// }
// .camp_img {
//   height: 80px;
//   width: 75px;
//   margin-top: 1rem;
//   animation: fadeInFadeOut 2s;
//   @media screen and (max-width: 960px) {
//     height: 70px;
//     width: 65px;
//   }
// }

@keyframes fadeInFadeOut {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
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
</style>
