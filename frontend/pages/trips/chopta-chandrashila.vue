<template lang="pug">
  v-container.pa-0(fluid)
    HomeNav(:dark="true")
    v-container.img-container(fluid)
      v-layout.lightbox.white--text.pt-5.mt-5(column fill-height)
        .d-flex.text-flex
          v-layout(column)
            .d-flex.align-self-center
              h1.camp-name Chopta-Chandrashila Trek
            .d-flex.align-self-center
              h1.display-1 Curated by
            .d-flex.align-self-center
              span.display-2 Camp
              span.display-2.green--text zy
    v-container(fluid)
      h1.display-2.mt-5 About Trek
        

</template>

<script>
import HomeNav from '../../components/HomePageNav.vue'
export default {
  components: {
    HomeNav
  }
}
</script>

<style lang="scss" scoped>
.text-flex {
  flex-direction: column;
  align-items: center;
  height: 55%;
  justify-content: center;
  & > * {
    flex-grow: 0 !important;
    margin-top: auto;
  }
}
.img-container {
  height: 75vh;
  background: black;
  background-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.8),
      rgba(0, 0, 0, 0.8)
    ),
    url('/vectors/chandrashila2.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.camp-name {
  font-family: 'Permanent Marker', cursive !important;
  text-shadow: 0px 0px 20px black;
  text-align: center;
  font-size: 80px;
  @media screen and (max-width: 960px) {
    font-size: 35px;
  }
}
.display-1 {
  font-size: 27px !important;
  font-weight: 300 !important;
  line-height: 100px !important;
  font-family: 'GlacialIndifferenceRegular', sans-serif !important;
  @media screen and (max-width: 960px) {
    font-size: 20px !important;
  }
}
.display-2 {
  font-size: 55px !important;
  font-family: 'GlacialIndifferenceRegular', sans-serif !important;
  @media screen and (max-width: 960px) {
    font-size: 40px !important;
  }
}
</style>
