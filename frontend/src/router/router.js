import Vue from 'vue';
import Router from 'vue-router';

const NotFoundPage = () => import('../components/404.vue');
const Home = () => import('../components/Home.vue');
const Search = () => import('../components/Search.vue');
const BookCampSite = () => import('../components/user/BookCampSite.vue');
const LoginRegister = () => import('../components/user/LoginRegister.vue');
const Profile = () => import('../components/user/Profile.vue');
const Settings = () => import('../components/user/Settings.vue');
const Billing = () => import('../components/user/Billing.vue');
const PasswordReset = () => import('../components/user/PasswordReset.vue');
const Dashboard = () => import('../components/Dashboard.vue');
const UserManagement = () => import('../components/dashboard_components/admin-dashboard/UserManagement.vue');
const Pricing = () => import('../components/dashboard_components/camp_owner_dashboard/Pricing.vue');
const CampDetails = () => import('../components/dashboard_components/camp_owner_dashboard/CampDetails.vue');
const CampInventory = () => import('../components/dashboard_components/camp_owner_dashboard/CampInventory.vue');
const ManageCamps = () => import('../components/dashboard_components/admin-dashboard/CampsManager.vue');

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      component: NotFoundPage,
    },
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/search/:searchterm',
      name: 'search',
      component: Search,
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
      path: '/profile',
      name: 'profile',
      component: Profile,
      children: [
        {
          name: 'settings',
          path: '/',
          component: Settings,
        },
        {
          name: 'billing',
          path: 'billing',
          component: Billing,
        },
      ],
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
