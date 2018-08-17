import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App.vue';

import 'vuetify/dist/vuetify.min.css';

// Vuetify
Vue.use(Vuetify);
Vue.config.productionTip = false;
// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => h(App),
});
