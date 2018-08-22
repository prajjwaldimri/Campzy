import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home.vue';
import BookCampSite from '../components/user/BookCampSite.vue';
import LoginRegister from '../components/user/LoginRegister.vue';
import Settings from '../components/user/Settings.vue';
import Dashboard from '../components/Dashboard.vue';
import Pricing from '../components/dashboard_components/camp-owner-dashboard/Pricing.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/bookCamp',
      name: 'book-camp',
      component: BookCampSite,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginRegister,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      children: [
        {
          path: 'pricing',
          component: Pricing,
        },
      ],
    },
  ],
});

export default router;
