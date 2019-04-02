import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDjRF58Tf3QFRdzhfG7tAxeUXNdarGS8Kg',
    libraries: 'places'
  }
})
