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
      h1.display-2.mt-5.headings About Trek
      p.paragraphs Chopta is one of the prettiest spot on the Ukhimath-Chamoli road that connects kedarnath and Badrinath via a more picturesque, somewhat shorter route. This sleepy place, 35 kms form Ukimath, is really just a bend in a very narrow, thick forrest mountain road. It’s the quaintest place you are likely to see en route, along with the famed bugyals (meadows) of the state peeking through towering tress, framed by snowy mountains in the distance. Chopta is the springboard for a 5km trek to Chandrashilla Peak and Tungnath - one of the Panch Kedar (Sacred Shiva Temples).
    v-container(fluid)
      h1.display-2.mt-5.headings Brief Itinerary
      div
        v-stepper(alt-labels non-linear)
          v-stepper-header
            v-stepper-step(step="Day 0") Depart to Chopta
            v-divider
            v-stepper-step(step="Day 1") Depart to Chopta
            v-divider
            v-stepper-step(step="Day 2") Depart to Chopta
            v-divider
            v-stepper-step(step="Day 3") Depart to Chopta
    v-container(fluid)
      h1.display-2.mt-5.headings What to Pack
      v-layout.justify-center.my-5(row wrap)
        v-flex.brief-flex(xs12 md1).text-xs-center
          v-img.brief-img(src="/vectors/bag.svg")
          span.text--darken-3.font-weight-regular.mt-3(style="font-size:25px") Rucksack
        v-flex.brief-flex(xs12 md1).text-xs-center
          v-img.brief-img(src="/vectors/jacket.svg")
          span.text--darken-3.font-weight-regular.mt-3(style="font-size:25px") Adequate amount of warm clothes
        v-flex.brief-flex(xs12 md1).text-xs-center
          v-img.brief-img(src="/vectors/sun-cream.svg")
          span.text--darken-3.font-weight-regular.mt-3(style="font-size:25px") Sunscreen lotion, cold cream
        v-flex.brief-flex(xs12 md1).text-xs-center
          v-img.brief-img(src="/vectors/sun-glasses.svg")
          span.text--darken-3.font-weight-regular.mt-3(style="font-size:25px") Sunglasses
        v-flex.brief-flex(xs12 md1).text-xs-center
          v-img.brief-img(src="/vectors/shoes.svg")
          span.text--darken-3.font-weight-regular.mt-3(style="font-size:25px") Shoes with good ground grip
        v-flex.brief-flex(xs12 md1).text-xs-center
          v-img.brief-img(src="/vectors/meds.svg")
          span.text--darken-3.font-weight-regular.mt-3(style="font-size:25px") Essential Meds
        v-flex.brief-flex(xs12 md1).text-xs-center
          v-img.brief-img(src="/vectors/camera.svg")
          span.text--darken-3.font-weight-regular.mt-3(style="font-size:25px") Camera and other gadgets
        v-flex.brief-flex(xs12 md1).text-xs-center
          v-img.brief-img(src="/vectors/wallet.svg")
          span.text--darken-3.font-weight-regular.mt-3(style="font-size:25px") Cash, ATMs etc
    v-container(fluid)
      h1.display-2.mt-5.headings Affordable Prices
      v-layout.my-5.justify-center(row wrap)
        .cost-div
          v-layout(column)
            .bed-img
              v-layout(row style="margin-top:6.1rem")
                v-img.mx-3(src="/vectors/bed.svg" style="height:40px; width:40px;")
                v-img.mx-3(src="/vectors/bed.svg" style="height:40px; width:40px;")
            .d-flex
              span.cost-text Double Sharing
            .d-flex
              span.cost-text Rs. 7500/- per person
        .cost-div
          .bed-img
            v-layout(row style="margin-top:6.1rem")
                v-img.mx-2(src="/vectors/bed.svg" style="height:40px; width:40px;")
                v-img.mx-2(src="/vectors/bed.svg" style="height:40px; width:40px;")
                v-img.mx-2(src="/vectors/bed.svg" style="height:40px; width:40px;")
          .d-flex
              span.cost-text Triple Sharing
          .d-flex
            span.cost-text Rs. 7000/- per person
        .cost-div
          .bed-img
            v-layout(row style="margin-top:6.1rem")
                v-img.mx-1(src="/vectors/bed.svg" style="height:40px; width:40px;")
                v-img.mx-1(src="/vectors/bed.svg" style="height:40px; width:40px;")
                v-img.mx-1(src="/vectors/bed.svg" style="height:40px; width:40px;")
                v-img.mx-1(src="/vectors/bed.svg" style="height:40px; width:40px;")
          .d-flex
              span.cost-text Quad Sharing
          .d-flex
            span.cost-text Rs. 6500/- per person
    v-btn(href="https://wa.me/+919582421554?text=Hello" fab style="position: fixed; top: 85vh; right: 1vw;margin-bottom:5rem;")
      v-img(src="/vectors/whatsapp.svg")
  
        

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
.headings {
  font-weight: 600;
  display: inline-block;
  position: relative;
  padding: 20px 0;
  margin: 0 3rem;
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
.paragraphs {
  margin: 1.5rem 3rem;
  font-size: 25px;
  font-weight: 600;
  text-align: left;
  color: gray;
  @media screen and (max-width: 960px) {
    text-align: justify;
  }
}
.cost-text {
  font-size: 25px;
  font-weight: 600;
  text-align: center;
  color: gray;
  margin: 0.8rem 0;
}
.brief-flex {
  margin: 5rem 8rem;
  max-width: 100% !important;
}
.brief-img {
  height: 180px;
  width: 180px;
}
.v-stepper {
  box-shadow: none !important;
  background-color: rgba(255, 255, 255, 0);
}
.v-stepper__step__step .v-stepper__step .v-stepper {
  height: 110px !important;
  width: 110px !important;
  font-size: 25px;
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
  font-size: 50px !important;
  font-family: 'GlacialIndifferenceRegular', sans-serif !important;
  @media screen and (max-width: 960px) {
    font-size: 40px !important;
  }
}
.cost-div {
  border: 0.1px solid rgba(0, 0, 0, 0.2);
  width: 350px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1);
  margin: 2rem 3rem;
}
.bed-img {
  border: 2px solid;
  border-radius: 50%;
  width: 220px;
  height: 220px;
  margin: 2.5rem auto;
  text-align: center;
}
</style>
