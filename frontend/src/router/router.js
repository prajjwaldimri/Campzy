/* global NProgress */
import Vue from 'vue';
import Router from 'vue-router';

const NotFoundPage = () => import('../components/404.vue');
const Home = () => import('../components/Home.vue');
const Search = () => import('../components/search/Search.vue');
const Camp = () => import('../components/search/Camp.vue');
const Blog = () => import('../components/blog/Blog.vue');
const LoginRegister = () => import('../components/user/LoginRegister.vue');
const Profile = () => import('../components/user/Profile.vue');
const Settings = () => import('../components/user/Settings.vue');
const ActiveBooking = () => import('../components/user/ActiveBooking.vue');
const Billing = () => import('../components/user/Billing.vue');
const PasswordReset = () => import('../components/user/PasswordReset.vue');
const Dashboard = () => import('../components/Dashboard.vue');
const UserManagement = () => import('../components/dashboard_components/admin-dashboard/UserManagement.vue');
const Statistics = () => import('../components/dashboard_components/camp_owner_dashboard/Statistics.vue');
const CampDetails = () => import('../components/dashboard_components/camp_owner_dashboard/CampDetails.vue');
const CampInventory = () => import('../components/dashboard_components/camp_owner_dashboard/CampInventory.vue');
const ManageCamps = () => import('../components/dashboard_components/admin-dashboard/CampsManager.vue');
const ViewCamp = () => import('../components/dashboard_components/admin-dashboard/ViewCamp.vue');
const AllBlogs = () => import('../components/dashboard_components/blogger_dashboard/AllBlogs.vue');
const AddBlog = () => import('../components/dashboard_components/blogger_dashboard/AddBlogs.vue');
const EditBlog = () => import('../components/dashboard_components/blogger_dashboard/EditBlog.vue');

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
      path: '/camp/:campUrl',
      name: 'camp',
      component: Camp,
    },
    {
      path: '/blog/:blogUrl',
      name: 'blog',
      component: Blog,
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
      component: Profile,
      children: [
        {
          name: 'settings',
          path: '/',
          component: Settings,
        },
        {
          name: 'activeBookings',
          path: 'activeBookings',
          component: ActiveBooking,
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
      component: Dashboard,
      children: [
        {
          name: 'statistics',
          path: '/',
          component: Statistics,
        },
        {
          name: 'campDetails',
          path: 'campDetails',
          component: CampDetails,
        },
        {
          name: 'campInventory',
          path: 'campInventory',
          component: CampInventory,
        },
        {
          name: 'campManagement',
          path: 'campManagement',
          component: ManageCamps,
        },
        {
          name: 'userManagement',
          path: 'userManagement',
          component: UserManagement,
        },
        {
          name: 'viewCamp',
          path: 'viewCamp/:id',
          component: ViewCamp,
        },
        {
          name: 'addBlog',
          path: 'addBlog',
          component: AddBlog,
        },
        {
          name: 'allBlogs',
          path: 'allBlogs',
          component: AllBlogs,
        },
        {
          name: 'editBlog',
          path: 'editBlog/:id',
          component: EditBlog,
        },
      ],
    },
  ],
});

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
