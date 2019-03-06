<template lang="pug">
  .page-div
    navbar
    v-container
      h1.display-1 Value for money Camps
      .camps-grid.mt-4
        v-card.wide-card
          .card-container
            v-card-title(primary-title)
              h1 Camp Name
            v-card-actions.justify-center
              v-spacer
              v-btn(light dark)
                span View Camp
                v-icon chevron_right
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
            url
            shortDescription
          },
          premiumCamps{
            name
            url
            shortDescription
          },
          normalCamps{
            name
            url
            shortDescription
          }
          cheapCamps{
            name
            url
            shortDescription
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
          console.log(this.allCamps);
        })
        .catch((err) => {
          console.log(err);
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
.camps-grid {
  display: grid;
  @media screen and (max-width: 960px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  grid-template-columns: repeat(8, 10%);
  grid-template-rows: repeat(4, 20%);
  grid-gap: 2rem;
}
.card-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}
.wide-card {
  @media screen and (max-width: 960px) {
    grid-column-end: span 2;
    grid-row-end: span 12;
  }
  grid-column-end: span 3;
  grid-row-end: span 10;
}
</style>
