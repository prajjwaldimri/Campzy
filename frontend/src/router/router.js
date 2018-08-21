import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home.vue';
import BookCampSite from '../components/user/BookCampSite.vue';
import CampOwnerDashboard from '../components/camp_owner/CampOwnerDashboard.vue';
import RegisterCamp from '../components/camp_owner/RegisterCamp.vue';
import ManageCamps from '../components/admin/ManageCamps.vue';
import AdminDashboard from '../components/admin/AdminDashboard.vue';
import LoginRegister from '../components/user/LoginRegister.vue';

// const auth = require('@websanova/vue-auth/drivers/auth/bearer.js');
// const http = require('@websanova/vue-auth/drivers/http/axios.1.x.js');

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: Home,
    },
    {
      path: '/bookCamp',
      name: 'book-camp',
      component: BookCampSite,
    },
    {
      path: '/registerCamp',
      name: 'register-camp',
      component: RegisterCamp,
    },
    {
      path: '/campownerDashboard',
      name: 'camp-owner-dashboard',
      component: CampOwnerDashboard,
    },
    {
      path: '/manageCamps',
      name: '/manage-camp',
      component: ManageCamps,
    },
    {
      path: '/adminDashboard',
      name: '/admin-dashboard',
      component: AdminDashboard,
    },
    {
      path: '/signIn',
      name: 'sign-in',
      component: LoginRegister,
    },
  ],
});

// Vue.use(require('@websanova/vue-auth'), auth, http);

// Vue.http.options.root = 'http://localhost:4444/graphql';

export default router;
