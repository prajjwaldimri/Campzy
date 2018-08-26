import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home.vue';
import BookCampSite from '../components/user/BookCampSite.vue';
import LoginRegister from '../components/user/LoginRegister.vue';
import Settings from '../components/user/Settings.vue';
import PasswordReset from '../components/user/PasswordReset.vue';
import Dashboard from '../components/Dashboard.vue';
import UserManagement from '../components/dashboard_components/admin-dashboard/UserManagement.vue';
import Pricing from '../components/dashboard_components/camp_owner_dashboard/Pricing.vue';
import CampDetails from '../components/dashboard_components/camp_owner_dashboard/CampDetails.vue';
import CampInventory from '../components/dashboard_components/camp_owner_dashboard/CampInventory.vue';
import ManageCamps from '../components/dashboard_components/admin-dashboard/CampsManager.vue';

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
      path: '/resetPassword/:token',
      name: 'resetPassword',
      component: PasswordReset,
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
        {
          path: 'campDetails',
          component: CampDetails,
        },
        {
          path: 'campInventory',
          component: CampInventory,
        },
        {
          path: 'campManagement',
          component: ManageCamps,
        },
        {
          path: 'userManagement',
          component: UserManagement,
        },
      ],
    },
  ],
});

export default router;
