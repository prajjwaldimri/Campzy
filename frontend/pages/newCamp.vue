<template lang="pug">
  .newPage
    Navbar
    v-container.px-0(fluid)
      v-layout.pr-4(row wrap)
        v-flex(sm12 md8)
          v-layout.pl-4(row wrap)
            hooper.ml-2(group="group1" :vertical="true" style="height: 600px; width:200px;" :itemsToShow="4" :centerMode="true" :infiniteScroll="true")
              slide.sliderr.pb-2
                img.slide-img(src="https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
              slide.sliderr.pb-2
                img.slide-img(src="https://images.pexels.com/photos/1303094/pexels-photo-1303094.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
              slide.sliderr.pb-2
                img.slide-img(src="https://images.pexels.com/photos/40541/christmas-snow-snowman-decoration-40541.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
              slide.sliderr.pb-2
                img.slide-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
              hooper-navigation( slot="hooper-addons")

            hooper.ml-3(group="group1" style="height: 600px; width:950px;" :itemsToShow="1" :infiniteScroll="true")
              slide
                img.slide-img(src="https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
              slide
                img.slide-img(src="https://images.pexels.com/photos/1303094/pexels-photo-1303094.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
              slide
                img.slide-img(src="https://images.pexels.com/photos/40541/christmas-snow-snowman-decoration-40541.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
              slide
                img.slide-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
        v-flex(sm12 md4)
          v-layout.lightbox.justify-center(column fill-height)
            .d-flex.image-flex
              .d-flex.align-self-center
                h1.display-3.camp-name.hidden-sm-and-down Camp Name
              .d-flex.align-self-center
                h2.camp-name.hidden-sm-and-down
                  v-icon where_to_vote
                  span.ml-1 Camp Location
              .d-flex.align-self-center
                v-rating()
            .d-flex.mt-5
              v-layout(column)
                h2 Description
                p.pt-3(style="text-align: justify") Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                .d-flex.align-self-center.justify-center
                  v-flex.mx-3.mt-3(xs6 md12).text-xs-center
                    v-icon(color="red") whatshot
                  v-flex.mx-3.mt-3(xs6 md12).text-xs-center
                    v-icon(color="brown") pets
                  v-flex.mx-3.mt-3(xs6 md12).text-xs-center
                    v-icon(color="red") whatshot
                  v-flex.mx-3.mt-3(xs6 md12).text-xs-center
                    v-icon(color="brown") pets
                  v-flex.mx-3.mt-3(xs6 md12).text-xs-center
                    v-icon(color="red") whatshot
                  v-flex.mx-3.mt-3(xs6 md12).text-xs-center
                    v-icon(color="brown") pets
                  v-flex.mx-3.mt-3(xs6 md12).text-xs-center
                    v-icon(color="red") whatshot
                  v-flex.mx-3.mt-3(xs6 md12).text-xs-center
                    v-icon(color="brown") pets
      .iframe-container.mt-5
        iframe(:src="mapUri" allowfullscreen)
      v-container(fluid)
        h1 Activities
      
    Footer
</template>

<script>
import { Hooper, Slide, Navigation as HooperNavigation } from 'hooper'
import 'hooper/dist/hooper.css'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
export default {
  name: 'NewCamp',
  components: {
    Navbar,
    Footer,
    Hooper,
    Slide,
    HooperNavigation
  },
  data() {
    return {
      mapUri: ''
    }
  },
  mounted() {
    this.mapUri = `https://www.google.com/maps/embed/v1/view?key=AIzaSyDUX5To9kCG343O7JosaLR3YwTjA3_jX6g&center=${28.58829},${77.216747}&zoom=18&maptype=satellite`
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.slide-img {
  height: 100%;
  width: 100%;
  background-size: contain;
}

.image-flex {
  flex-direction: column;
  align-items: center;
  // height: 90%;
  justify-content: center;
  & > * {
    flex-grow: 0 !important;
    margin-top: auto;
  }
}
.camp-name {
  font-family: 'Permanent Marker', cursive !important;
  text-align: center;
}
.iframe-container {
  overflow: hidden;
  padding-top: 21.25%;
  position: relative;
  border-style: solid;
  border-color: rgba($color: gray, $alpha: 0.4);
  border-width: 1px;
  iframe {
    border: 0;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
}
</style>
