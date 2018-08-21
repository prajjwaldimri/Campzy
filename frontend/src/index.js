import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App.vue';
import router from './router/router';
import 'vuetify/dist/vuetify.min.css';

// Vuetify
Vue.use(Vuetify);
Vue.config.productionTip = false;
// eslint-disable-next-line
new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
