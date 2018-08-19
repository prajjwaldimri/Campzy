import Vue from 'vue';
import Vuetify from 'vuetify';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import VueApollo from 'vue-apollo';
import App from './App.vue';
import router from './router/router';
import 'vuetify/dist/vuetify.min.css';

const httpLink = new HttpLink({
  uri: 'http://localhost:4444/graphql',
});

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

// Install the vue plugin
Vue.use(VueApollo);
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

// Vuetify
Vue.use(Vuetify);
Vue.config.productionTip = false;
// eslint-disable-next-line
new Vue({
  el: '#app',
  router,
  provide: apolloProvider.provide(),
  render: h => h(App),
});
