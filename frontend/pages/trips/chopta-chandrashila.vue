<template lang="pug">
  v-container.pa-0(fluid)
    HomeNav(:dark="true")
    v-responsive(height="70vh")
      v-img(src="/vectors/chandrashila2.jpg" height="100%" position="center center")
        v-btn(@click="'https://wa.me/+919582421554'" color="success" outline) Contact Us on Whatsapp
        

</template>

<script>
import HomeNav from '../../components/HomePageNav.vue'
export default {
  components: {
    HomeNav
  }
}
</script>
