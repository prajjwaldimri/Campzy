<template lang="pug">
  v-dialog(v-model="showDialog" fullscreen hide-overlay transition="dialog-bottom-transition")
    v-card(dark)
      v-toolbar(color="transparent" app flat)
        v-spacer
        v-btn(dark large @click.native="showDialog=false")
          v-icon close
      //- v-carousel(dark style="height: 100vh" v-if="imagesLoaded")
      //-   v-carousel-item(v-for="(image,i) in images" :key="i" :src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + image")
      //-     //- .d-flex
      //-     //-   v-responsive
      //-     //-     v-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + image"
      //-     //-     :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + image")
      div
        transition-group(name="fade" tag="div")
          div.img-container(v-for="i in [currentIndex]" :key="i")
            img(:src="currentImg")
        a(class="prev" @click="prev" href="#") &#10094;
        a(class="next" @click="next" href="#") &#10095;
          

</template>

<script>
import { request } from 'graphql-request'
import { getCampImages } from '../queries/queries'
import { EventBus } from '../layouts/event-bus'

export default {
  name: 'Images',
  data() {
    return {
      showDialog: false,
      images: [],
      campName: '',
      campUrl: '',
      imagesLoaded: false,
      timer: null,
      currentIndex: 0
    }
  },
  computed: {
    currentImg() {
      return this.images[Math.abs(this.currentIndex) % this.images.length]
    }
  },
  mounted() {
    EventBus.$on('open-image-dialog', campUrl => {
      this.campUrl = campUrl.campUrl
      this.getImages()
      this.showDialog = true
    })
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.showDialog = false
        this.imagesLoaded = false
      }
    })
    window.addEventListener('keydown', e => {
      if (e.keyCode === 39) {
        this.currentIndex += 1
      }
      if (e.keyCode === 37) {
        this.currentIndex -= 1
      }
    })
  },
  methods: {
    startSlide() {
      this.timer = setInterval(this.next, 8000)
    },

    next() {
      this.currentIndex += 1
    },
    prev() {
      this.currentIndex -= 1
    },
    getImages() {
      EventBus.$emit('show-progress-bar')

      const variables = {
        url: this.campUrl
      }
      request('https://api.campzy.in/graphql', getCampImages, variables)
        .then(data => {
          this.campName = data.getImagesOfCamp.name
          data.getImagesOfCamp.images.forEach(img => {
            this.images.push(
              `https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/${img}`
            )
          })
          this.startSlide()
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          EventBus.$emit(
            'show-error-notification-short',
            'Cannot get images at this time'
          )
        })
        .finally(() => {
          EventBus.$emit('hide-progress-bar')
          this.imagesLoaded = true
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.v-window-item {
  @media screen and (min-width: 960px) {
    height: 100vh !important;
  }
  @media screen and (max-width: 959px) {
    object-fit: contain !important;
    height: 100vh !important;
  }
}

.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.9s ease;
  overflow: hidden;
  visibility: visible;
  position: absolute;
  width: 100%;
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  visibility: hidden;
  width: 100%;
  opacity: 0;
}

img {
  height: 100vh;
  width: 90%;

  @media screen and (max-width: 960px) {
    height: 45vh;
    width: 100%;
  }
}

.prev,
.next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  width: auto;
  padding: 16px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: 0.7s ease;
  border-radius: 0 4px 4px 0;
  text-decoration: none;
  user-select: none;
}

.next {
  right: 0;
}

.prev {
  left: 0;
}

.prev:hover,
.next:hover {
  background-color: rgba(0, 0, 0, 0.9);
}
</style>
