import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home.vue';
import BookCampSite from '../components/user/BookCampSite.vue';
import CampOwnerDashboard from '../components/camp_owner/CampOwnerDashboard.vue';
import RegisterCamp from '../components/camp_owner/RegisterCamp.vue';
import ManageCamps from '../components/admin/ManageCamps.vue';
import AdminDashboard from '../components/admin/AdminDashboard.vue';
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
