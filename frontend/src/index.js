import Vue from 'vue';
import '@babel/polyfill';
import Vuetify from 'vuetify';
import Meta from 'vue-meta';
import VeeValidate from 'vee-validate';
import VueTour from 'vue-tour';
import GSignInButton from 'vue-google-signin-button';
import FBSignInButton from 'vue-facebook-signin-button';
import 'vue-loaders/dist/vue-loaders.css';
import * as VueLoaders from 'vue-loaders';
import VueTelInput from 'vue-tel-input';
import VueI18n from 'vue-i18n';
import * as VueGoogleMaps from 'vue2-google-maps';
import App from './App.vue';
import router from './router/router';
import './stylus/main.styl';

// Vue Telephone input
import 'vue-tel-input/dist/vue-tel-input.css';

require('vue-tour/dist/vue-tour.css');

const VueCookie = require('vue-cookie');

Vue.use(require('vue-moment'));

Vue.use(VueI18n);

Vue.use(Meta);

Vue.use(VueLoaders);

Vue.use(Vuetify);
Vue.use(VeeValidate);

// Use google map in Vue
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDUX5To9kCG343O7JosaLR3YwTjA3_jX6g',
    libraries: 'places',
  },
});
// Tell Vue to use the plugin
Vue.use(VueCookie);
Vue.use(VueTour);

// Social Login Buttons
Vue.use(GSignInButton);
Vue.use(FBSignInButton);

Vue.use(VueTelInput);

Vue.config.productionTip = false;

// Vue i18n Configuration
const numberFormats = {
  'en-IN': {
    currency: {
      style: 'currency',
      currency: 'INR',
      currencyDisplay: 'symbol',
      maximumSignificantDigits: 5,
    },
  },
};
const i18n = new VueI18n({
  numberFormats,
});

// eslint-disable-next-line
new Vue({
  i18n,
  el: '#app',
  router,
  render: h => h(App),
});
