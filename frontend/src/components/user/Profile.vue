<template lang="pug">
  div
    navbar
    .d-flex.full-height.hidden-sm-and-down
      v-navigation-drawer(hide-overlay v-model="drawer" app clipped mini-variant
      permanent stateless).side-nav.grey.darken-4
        v-toolbar(flat).transparent
          v-list.pa-0
            v-divider(inset)
            v-list-tile(avatar)
              v-list-tile-avatar
                img(src="https://randomuser.me/api/portraits/men/85.jpg")
              v-list-tile-content
                v-list-tile-title.increase-letter-spacing-2 UserName
        v-list.pt-0
          v-divider
            v-list-tile
              v-list-tile-action
                v-icon home
        v-list.pt-0
          v-divider
            v-list-tile
              v-list-tile-action
                v-icon home


      router-view
</template>

<script>
import navbar from '../Navbar.vue';

export default {
  name: 'Profile',
  data() {
    return {
      drawer: true,
    };
  },

  components: {
    navbar,
  },
};
</script>

<style lang="scss" scoped>
.full-height {
  height: 100vh;
}

.side-nav {
}
</style>
