import Vue from 'vue';
import Vuetify from 'vuetify';
import VeeValidate from 'vee-validate';
import VueTour from 'vue-tour';
import VueI18n from 'vue-i18n';
import App from './App.vue';
import router from './router/router';
import './stylus/main.styl';

require('vue-tour/dist/vue-tour.css');

const VueCookie = require('vue-cookie');

Vue.use(require('vue-moment'));

Vue.use(VueI18n);

Vue.use(Vuetify);
Vue.use(VeeValidate);
// Tell Vue to use the plugin
Vue.use(VueCookie);
Vue.use(VueTour);

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
