import Vue from 'vue';
import Vuetify from 'vuetify';
import VeeValidate from 'vee-validate';
import VueTour from 'vue-tour';
import App from './App.vue';
import router from './router/router';
import './stylus/main.styl';

require('vue-tour/dist/vue-tour.css');

const VueCookie = require('vue-cookie');

Vue.use(Vuetify);
Vue.use(VeeValidate);
// Tell Vue to use the plugin
Vue.use(VueCookie);
Vue.use(VueTour);
Vue.config.productionTip = false;
// eslint-disable-next-line
new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
