<template lang="pug">
  div
    Navbar
    v-container.main_container
      v-container.bestFrom(fluid)
        v-flex
          h2.large_heading Get Best from Us...
      v-container.content_container(fluid)
        v-layout(row wrap)
          v-flex.text_content(xs12 md5)
            h2.main_headings 💸 Get the best deals everytime
            h2.light_headings Here at campzy, we don’t trick users into buying something using price manupulation. Every price you see will be fair to the camp owners and you
          v-flex(xs12 md7)
            v-img.scroll_image(src='/vectors/money.svg')
      v-container.content_container_right(fluid)
        v-layout(row wrap)
          v-flex(xs12 md5)
            v-img.scroll_image.left_img(src='/vectors/mountain.svg')
          v-flex.text_content(xs12 md5)
            h2.main_headings Exotic Locations 🏔️
            h2.light_headings Locations like you have never seen before including famous hotspots like Chopta, Rishikesh, Himachal, Caribbean etc.
      v-container.content_container(fluid)
        v-layout(row wrap)
          v-flex.text_content(xs12 md5 )
            h2.main_headings 💳 Every payment option available
            h2.light_headings Whether you like UPI, credit card, debit card, online banking we accept everything.
          v-flex(xs12 md7)
            v-img.scroll_image(src='/vectors/payment.svg')
      
      //- v-container.meet_team(fluid)
      //-   v-flex
      //-     h2.large_heading Meet Our Team
      //-   v-flex
      //-     v-layout.avt_container(row)
      //-       v-layout.avt_container(column style="flex: 0 0 auto;")
      //-         v-avatar.avatar
      //-           v-img(src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John")
      //-         h2 Priyanshu Agarwal
      //-         h2.designation CEO
      //-       v-layout.avt_container(column style="flex: 0 0 auto;")
      //-         v-avatar.avatar
      //-           v-img(src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John")
      //-         h2 Manish Bharadwaj
      //-         h2.designation CEO
      //-       v-layout.avt_container(column style="flex: 0 0 auto;")
      //-         v-avatar.avatar
      //-           v-img(src="/myPic.jpg" alt="Ayush Bahuguna")
      //-         h2 Ayush Bahuguna
      //-         h2.designation Developer
          
    Footer
</template>
<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
export default {
  name: 'About',
  metaInfo: {
    title: 'About Us'
  },
  components: {
    Footer,
    Navbar
  }
}
</script>

<style lang="scss" scoped>
.main_container {
  margin: 0rem 5rem !important;
  flex: 1 1 100% !important;
  padding: 24px !important;
  @media screen and (max-width: 960px) {
    margin: 0rem !important;
  }
  @media screen and (max-width: 1264px) and (min-width: 961px) {
    max-width: 100% !important;
    margin: 0 !important;
  }
}

.bestFrom {
  text-align: center;
}
.large_heading {
  font-size: 40px;
  @media screen and (max-width: 960px) {
    font-size: 30px;
  }
}

.content_container {
  padding-left: 12rem;
  margin-top: 12rem;
  @media screen and (max-width: 960px) {
    padding: 1rem;
    margin-top: 4rem;
  }
  @media screen and (max-width: 1264px) and (min-width: 961px) {
    padding-left: 0rem;
    margin-top: 6rem;
  }
}

.content_container_right {
  // padding-right: 14rem;
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
  @media screen and (max-width: 1264px) and (min-width: 961px) {
    padding: 5rem 0 0 7rem;
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
  margin-left: 6.5rem;
  height: 350px;
  width: 470px;
  animation: fadeInFadeOut 2s;
  text-align: center;
  @media screen and (max-width: 960px) {
    height: 250px;
    width: 320px;
    margin: 1rem 0 1rem 0;
  }
}
.left_img {
  margin-left: 20rem;
  @media screen and (max-width: 959px) {
    margin-left: 0 !important;
  }
  @media screen and (max-width: 1264px) and (min-width: 960px) {
    margin-left: 2rem !important;
  }
  @media screen and (max-width: 1900px) and (min-width: 1265px) {
    margin-left: 5rem !important;
  }
}

.meet_team {
  text-align: center;
  margin-top: 6rem;
  @media screen and (max-width: 960px) {
    margin-top: 4rem;
  }
}
.avt_container {
  justify-content: center !important;
  @media screen and (max-width: 960px) {
    display: inline;
  }
}

.avatar {
  margin: 48px 48px !important;
  height: 200px !important;
  width: 200px !important;
  @media screen and (max-width: 960px) {
    margin: 24px 24px !important;
    height: 100px !important;
    width: 100px !important;
  }
}
.designation {
  font-weight: normal;
  font-size: 18px;
  color: gray;
  animation: fadeInFadeOut 2s;
  @media screen and (max-width: 960px) {
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 1px;
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
</style>
