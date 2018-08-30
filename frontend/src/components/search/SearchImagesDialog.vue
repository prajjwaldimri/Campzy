<template lang="pug">
  v-dialog(v-model="showDialog" fullscreen hide-overlay transition="dialog-bottom-transition")
    v-card(dark)
      v-toolbar(dark color="green darken-2")
        v-toolbar-title Images of {{campName}}
        v-spacer
        v-btn(dark large @click.native="showDialog=false")
          span Close
          v-icon close
      v-carousel(dark style="height: 90vh")
        v-carousel-item(v-for="(image,i) in images" :key="i" :src="image")

</template>

<script>
import { EventBus } from '../../event-bus';

export default {
  data() {
    return {
      showDialog: false,
      images: ['https://images.pexels.com/photos/757142/pexels-photo-757142.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260', 'https://images.pexels.com/photos/1183021/pexels-photo-1183021.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260', 'https://images.pexels.com/photos/1367188/pexels-photo-1367188.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
      campName: '',
    };
  },
  mounted() {
    EventBus.$on('open-image-dialog', (camp) => {
      this.showDialog = true;
      this.campName = camp.campName;
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.showDialog = false;
      }
    });
  },
};
</script>
