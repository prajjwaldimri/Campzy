<template lang="pug">
  v-dialog(v-model="showDialog" fullscreen hide-overlay transition="dialog-bottom-transition")
    v-card(dark)
      v-toolbar(color="transparent" app flat)
        v-spacer
        v-btn(dark large @click.native="showDialog=false")
          span Close
          v-icon close
      v-carousel(dark style="height: 100vh" v-if="imagesLoaded")
        v-carousel-item(v-for="(image,i) in images" :key="i" :src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + image")
          //- .d-flex
          //-   v-responsive
          //-     v-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + image"
          //-     :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + image")

</template>

<script>
import { request } from 'graphql-request';
import { getCampImages } from '../../queries/queries';
import { EventBus } from '../../event-bus';

export default {
  data() {
    return {
      showDialog: false,
      images: [],
      campName: '',
      campUrl: '',
      imagesLoaded: false,
    };
  },
  mounted() {
    EventBus.$on('open-image-dialog', (campUrl) => {
      this.campUrl = campUrl.campUrl;
      this.getImages();
      this.showDialog = true;
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.showDialog = false;
        this.imagesLoaded = false;
      }
    });
  },
  methods: {
    getImages() {
      EventBus.$emit('show-progress-bar');

      const variables = {
        url: this.campUrl,
      };
      request('/graphql', getCampImages, variables).then((data) => {
        console.log(data);
        this.campName = data.getImagesOfCamp.name;
        this.images = data.getImagesOfCamp.images;
      }).catch((err) => {
        console.log(err);
        EventBus.$emit('show-error-notification-short', 'Cannot get images at this time');
      }).finally(() => {
        EventBus.$emit('hide-progress-bar');
        this.imagesLoaded = true;
      });
    },
  },
};
</script>
