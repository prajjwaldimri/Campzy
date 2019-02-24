<template lang="pug">
  .page-div
    navbar
    Footer
</template>
<script>
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../event-bus';

import Navbar from './Navbar.vue';
import Footer from './Footer.vue';

export default {
  components: {
    navbar: Navbar,
    Footer,
  },
  data() {
    return {
      allCamps: [],
    };
  },
  mounted() {
    this.getCampByPlaces();
  },

  methods: {
    getCampByPlaces() {
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      const getCampByPlace = `query($place: String!){
        getCampsInPlace(place: $place){
          luxuryCamps{
            name
          },
          premiumCamps{
            name
          },
          normalCamps{
            name
          }
          cheapCamps{
            name
          }
        }
      }`;
      const variables = {
        place: this.$route.params.place,
      };

      client
        .request(getCampByPlace, variables)
        .then((data) => {
          this.allCamps = data.getCampsInPlace;
        })
        .catch(() => {
          EventBus.$emit(
            'show-error-notification-short',
            'Unable to get Camps rigth now!',
          );
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-div {
  min-height: 100vh;
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
}
</style>
