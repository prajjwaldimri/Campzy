import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App.vue';
import router from './router/router';
import 'vuetify/dist/vuetify.min.css';

const VueCookie = require('vue-cookie');

// Vuetify
Vue.use(Vuetify);
Vue.use(VueCookie);
Vue.config.productionTip = false;
// eslint-disable-next-line
new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
