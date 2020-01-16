<template lang="pug">
  .newPage
    Navbar
    v-container.px-0(fluid)
      v-layout(row wrap)
        v-flex(sm12 md7)
          v-layout.hidden-sm-and-down.pl-4(row style="height:100%")
            hooper.small-slider.ml-2(group="group1" :vertical="true" :itemsToShow="4" :centerMode="true" :infiniteScroll="true")
              slide.pb-2
                img.slide-img(src="https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
              slide.pb-2
                img.slide-img(src="https://images.pexels.com/photos/1303094/pexels-photo-1303094.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
              slide.pb-2
                img.slide-img(src="https://images.pexels.com/photos/40541/christmas-snow-snowman-decoration-40541.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
              slide.pb-2
                img.slide-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
              hooper-navigation( slot="hooper-addons")

            hooper.large-slider.ml-3(group="group1" :itemsToShow="1" :infiniteScroll="true")
              slide
                img.slide-img(src="https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
              slide
                img.slide-img(src="https://images.pexels.com/photos/1303094/pexels-photo-1303094.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
              slide
                img.slide-img(src="https://images.pexels.com/photos/40541/christmas-snow-snowman-decoration-40541.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
              slide
                img.slide-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
          
          // Mobile Slider
          hooper.hidden-md-and-up.large-slider(:itemsToShow="1" :infiniteScroll="true")
            slide
              img.slide-img(src="https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
            slide
              img.slide-img(src="https://images.pexels.com/photos/1303094/pexels-photo-1303094.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
            slide
              img.slide-img(src="https://images.pexels.com/photos/40541/christmas-snow-snowman-decoration-40541.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
            slide
              img.slide-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260")
            hooper-pagination(slot="hooper-addons")
        v-flex(sm12 md5)
          v-layout.px-5.lightbox.justify-center(column fill-height)
            .d-flex.image-flex
              .d-flex.align-self-center
                h1.display-3.camp-name Camp Name
              .d-flex.align-self-center
                h2.camp-name
                  v-icon where_to_vote
                  span.ml-1 Camp Location
              .d-flex.align-self-center
                v-rating()
            .d-flex.mt-5
              v-layout(column)
                h2 Description
                p.pt-3(style="text-align: justify") Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                .d-flex.justify-center
                  v-flex.mx-1.mt-3(xs1 md1).text-xs-center
                    v-icon(color="red") whatshot
                  v-flex.mx-1.mt-3(xs1 md1).text-xs-center
                    v-icon(color="brown") pets
                  v-flex.mx-1.mt-3(xs1 md1).text-xs-center
                    v-icon(color="red") whatshot
                  v-flex.mx-1.mt-3(xs1 md1).text-xs-center
                    v-icon(color="brown") pets
                  v-flex.mx-1.mt-3(xs1 md1).text-xs-center
                    v-icon(color="red") whatshot
                  v-flex.mx-1.mt-3(xs1 md1).text-xs-center
                    v-icon(color="brown") pets
                  v-flex.mx-1.mt-3(xs1 md1).text-xs-center
                    v-icon(color="red") whatshot
                  v-flex.mx-1.mt-3(xs1 md1).text-xs-center
                    v-icon(color="brown") pets
      .iframe-container.mt-5
        iframe(:src="mapUri" allowfullscreen)
      v-divider.mt-4
      v-container.mt-4(fluid)
        h1.page-headings Camp's Activities
        hooper.hidden-sm-and-down.mt-5.activities-slider(:itemsToShow="4" :infiniteScroll="true" )
          slide.px-2
            v-card(max-width="400") 
              v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
              v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
          slide.px-2
            v-card(max-width="400") 
              v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
              v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.  
          slide.px-2
            v-card(max-width="400") 
              v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
              v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.  
          slide.px-2
            v-card(max-width="400") 
              v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
              v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.   
          hooper-navigation(slot="hooper-addons")
        // Mobile Activity Slider
        hooper.hidden-md-and-up.large-slider(:itemsToShow="1" :infiniteScroll="true")
          slide
            v-card(max-width="400") 
              v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
              v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. 
          slide
            v-card(max-width="400") 
              v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
              v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. 
          slide
            v-card(max-width="400") 
              v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
              v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
          hooper-pagination(slot="hooper-addons")   
      v-divider.mt-4
      v-container.mt-4(fluid)
        h1.page-headings Our Customers Reviews
        v-carousel(hide-delimiters hide-delimiter-background show-arrows-on-hover :show-arrows="false" style="box-shadow:none;")
          v-carousel-item(v-for="(slide,i) in slides" :key="i")
            v-layout(column style="align-items: center;width:65%; margin: 4rem auto auto auto;")
              v-avatar(color="orange" size="62")
                span AB
              h1 Ayush Bahuguna
              v-rating()
              p.text-xs-center.review-para Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      v-divider.mt-4
      v-container.mt-4(fluid)
        h1.page-headings Similar Camps
        hooper.mt-5.activities-slider(:itemsToShow="4" :infiniteScroll="true" )
          slide.px-2
            v-card(max-width="400") 
              v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
              v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
          slide.px-2
            v-card(max-width="400") 
              v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
              v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.  
          slide.px-2
            v-card(max-width="400") 
              v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
              v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.  
          slide.px-2
            v-card(max-width="400") 
              v-img(src="https://images.pexels.com/photos/1656564/pexels-photo-1656564.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260") 
              v-card-text.text-primary Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.   
          hooper-navigation(slot="hooper-addons")
             
    Footer
</template>

<script>
import {
  Hooper,
  Slide,
  Navigation as HooperNavigation,
  Pagination as HooperPagination
} from 'hooper'
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
    HooperNavigation,
    HooperPagination
  },
  data() {
    return {
      mapUri: '',
      slides: ['First', 'Second', 'Third', 'Fourth', 'Fifth']
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
  background-size: cover;
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
.small-slider {
  height: 100%;
  width: 18%;
}
.large-slider {
  height: 100%;
  width: 82%;
  @media screen and (max-width: 960px) {
    width: 100%;
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

.activities-slider {
  width: 100%;
  height: 100%;
}

.page-headings {
  font-size: 40px;
  text-align: center;
  @media screen and (max-width: 960px) {
    font-size: 30px;
  }
}

.review-para {
  font-size: 22px;
  color: gray;
  font-weight: 400;
  @media screen and (max-width: 960px) {
    font-size: 14px;
  }
}
</style>
