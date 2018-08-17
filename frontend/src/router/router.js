import Vue from 'vue';
import Router from 'vue-router';
import Test from '../components/Test.vue';
import BookCampSite from '../components/user/BookCampSite.vue';
import CampOwnerDashboard from '../components/camp_owner/CampOwnerDashboard.vue';
import RegisterCamp from '../components/camp_owner/RegisterCamp.vue';
import ManageCamps from '../components/admin/ManageCamps.vue';
import AdminDashboard from '../components/admin/AdminDashboard.vue';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: Test,
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
  ],
});

export default router;
