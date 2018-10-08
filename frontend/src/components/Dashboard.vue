<template lang="pug">
  v-container.display(fluid)
    v-navigation-drawer.side-drawer.hidden-sm-and-down(:mini-variant.sync="mini" dark
    v-model="drawer" hide-overlay sticky)
      .d-flex.content-justify(style='position:sticky;top:0;')
        v-container.side-container(fluid)
          v-list.pt-4
            v-list-tile
              v-list-tile-content.center-item
                v-layout(row style="width:100%;margin-left:3.5rem;")
                  router-link.link-text(to='/')
                    h1.font-weight-light
                      span Camp
                      span.green--text zy
                  v-btn.help-btn(flat icon small @click='startTour')
                    v-icon help
        v-container.side-container(fluid)
          v-list.pt-3
            v-list-tile(avatar)
              v-list-tile-avatar
                img(:src="userProfileImage")
              v-list-tile-content
                v-list-tile-title.increase-letter-spacing-2 {{user.name}}
        v-container.side-container(fluid)
          v-list.pt-5(dense)
            v-list-tile.pt-3(@click="$router.push('/dashboard/')" v-show='isAdmin || isCampOwner')
              v-list-tile-action
                v-icon data_usage
              v-list-tile-content.increase-letter-spacing-1(id='v-step-2') Statistics
            v-list-tile.pt-3(@click="$router.push('/dashboard/userManagement')"
              v-show='isAdmin')
              v-list-tile-action
                v-icon supervised_user_circle
              v-list-tile-content.increase-letter-spacing-1(id='v-step-0') User Management
            v-list-tile.pt-3(@click="$router.push('/dashboard/campManagement')"  v-show='isAdmin')
              v-list-tile-action
                img(src="/vectors/tent.svg" height="24" width="24")
              v-list-tile-content.increase-letter-spacing-1(id='v-step-1') Camp Management
            v-list-tile.pt-3(@click="$router.push('/dashboard/campDetails')" v-show='isCampOwner')
              v-list-tile-action
                img(src="/vectors/campfire.svg" height="24" width="24")
              v-list-tile-content.increase-letter-spacing-1(id='v-step-2') Camp Details
            v-list-tile.pt-3(@click="$router.push('/dashboard/bankDetails')" v-show='isCampOwner')
              v-list-tile-action
                v-icon account_balance
              v-list-tile-content.increase-letter-spacing-1 Bank Details
            v-list-tile.pt-3(@click="$router.push('/dashboard/addBlog')" v-show='isBlogger')
              v-list-tile-action
                v-icon note_add
              v-list-tile-content.increase-letter-spacing-1(id='v-step-2') New Blog
            v-list-tile.pt-3(@click="$router.push('/dashboard/allBlogs')" v-show='isBlogger')
              v-list-tile-action
                v-icon folder_open
              v-list-tile-content.increase-letter-spacing-1(id='v-step-2') My Blogs
            v-list-tile.pt-3(@click="$router.push('/dashboard/campInventory')" v-show='isCampOwner')
              v-list-tile-action
                v-icon local_grocery_store
              v-list-tile-content.increase-letter-spacing-1(id='v-step-3') Inventory
          v-tour(name='adminTour' :steps='adminSteps')
        v-container.side-container(fluid)
          v-list(dense)
            v-list-tile.pt-3(@click='signOut')
              v-list-tile-action
                v-icon(color='red') exit_to_app
              v-list-tile-content.increase-letter-spacing-1.red--text(id='v-step-4') Sign Out
            v-list-tile(v-show='isDrawerOpen' data-v-step="5")
              v-list-tile-action
                v-btn(icon @click.stop='mini=!mini; isDrawerOpen=false')
                  v-icon chevron_left
              v-list-tile-content.increase-letter-spacing-1 Close Drawer
            v-list-tile(v-show='!isDrawerOpen')
              v-list-tile-action
                v-btn(icon @click.stop='mini=!mini; isDrawerOpen=true')
                  v-icon chevron_right
          v-tour(name='adminTour' :steps='adminSteps')
    router-view
    v-bottom-nav(:value="true" :active.sync="bottomNav" color="grey darken-4"
   fixed shift).hidden-md-and-up
      v-btn(dark @click="$router.push('/dashboard/')"
      id='v-step-0' v-show='isAdmin || isCampOwner')
        span Statistics
        v-icon data_usage
      v-btn(dark @click="$router.push('/dashboard/addBlog')"
       v-show='isBlogger')
        span Add Blog
        v-icon note_add
      v-btn(dark @click="$router.push('/dashboard/allBlogs')"
       v-show='isBlogger')
        span All Blogs
        v-icon folder_open
      v-btn(dark @click="$router.push('/dashboard/userManagement')"
      v-show='isAdmin' id='v-step-0')
        span User Management
        v-icon supervised_user_circle
      v-btn(dark @click="$router.push('/dashboard/campDetails')"
      v-show='isCampOwner' id='v-step-1')
        span Camp Details
        v-icon details
      v-btn(dark @click="$router.push('/dashboard/bankDetails')"
      v-show='isCampOwner')
        span Bank Details
        v-icon account_balance
      v-btn(dark @click="$router.push('/dashboard/campManagement')"
      v-show='isAdmin' id='v-step-2')
        span Camp Management
        v-icon explore
      v-btn(dark @click="$router.push('/dashboard/campInventory')"
      v-show='isCampOwner' id='v-step-3')
        span Camp Inventory
        v-icon add_shopping_cart
      v-btn(dark @click="signOut")
        span Sign Out
        v-icon exit_to_app

</template>
<script>
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../event-bus';

export default {
  name: 'Dashboard',
  data() {
    return {
      drawer: true,
      mini: false,
      right: null,
      load: false,
      user: {},
      isCampOwner: false,
      isAdmin: false,
      isBlogger: false,
      isDrawerOpen: true,
      bottomNav: 0,
      userProfileImage: '',
      adminSteps: [
        {
          target: '#v-step-0',
          content: 'Use this for User Management',
        },
        {
          target: '#v-step-1',
          content: 'Use this for Camp Management',
        },
        {
          target: '#v-step-4',
          content: 'Use this for Sign Out',
        },
        {
          target: '[data-v-step="5"]',
          content: 'Use this to close the Drawer',
        },
      ],
      campOwnerSteps: [
        {
          target: '#v-step-2',
          content: 'To see your owned camp details',
        },
        {
          target: '#v-step-3',
          content: 'To see your camp Inventory',
        },
        {
          target: '#v-step-4',
          content: 'Use this for Sign Out',
        },
        {
          target: '[data-v-step="5"]',
          content: 'Use this to close the Drawer',
          params: {
            placement: 'top',
          },
        },


      ],
    };
  },
  mounted() {
    this.getCurrentUser();
  },
  methods: {
    startTour() {
      // eslint-disable-next-line
      this.$tours['adminTour'].start();
    },
    signOut() {
      this.$cookie.delete('sessionToken');
      this.$router.push('/login');
    },

    getCurrentUser() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/login');
      }
      const query = `{currentUser {
        name,
        type,
        email
      }}`;
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(query)
        .then((data) => {
          this.user = data.currentUser;
          this.userProfileImage = `https://ui-avatars.com/api/?size=256&name=${this.user.name}`;

          this.isLoggedIn = true;
          if (this.user.type !== 'Admin' && this.user.type !== 'CampOwner' && this.user.type !== 'Blogger') {
            this.$router.push('/');
            EventBus.$emit('show-error-notification-short', 'Your account does not have the capability to perfomr this action');
          }
          if (this.user.type === 'CampOwner') {
            this.isCampOwner = true;
          }
          if (this.user.type === 'Admin') {
            this.isAdmin = true;
          }
          if (this.user.type === 'Blogger') {
            this.isBlogger = true;
          }
          if (this.user.name === null) {
            this.user.name = 'Unnamed User';
          }
        })
        .catch(() => { this.user = {}; this.isLoggedIn = false; });
    },
  },


};
</script>
<style lang="scss" scoped>
.display {
  margin: 0px 0px 0px 0px;
  padding: 0px;
  display: flex;
  min-height: 100%;
}
.router-display {
  width: 100%;
  padding: 2rem;
  margin: 0px;
  height: 100% !important;
}
.side-drawer {
  border-right: 1px sloid;
  box-shadow: none !important;
  height: 100%;
}
.center-item {
  align-items: center;
}
.link-text {
  font-size: 1.5rem;
  text-decoration: none;
  color: #fff;
}
.content-justify {
  flex-direction: column;
  justify-content: space-around;
  padding: 0;
}

.side-container {
  padding: 0;
}
.help-btn {
  margin: 0.8rem 0rem 0rem 3rem;
}
</style>
