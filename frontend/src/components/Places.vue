<template lang="pug">
  .place
    Navbar
    v-container
      h1.display-1 Value for Money Camps

      .camps.mt-4
        v-layout(row wrap)
          v-flex(xs12 md4 v-for="(premiumCamp, index) in allCamps.premiumCamps")
            v-card.ma-4(height="400" raised :img="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + premiumCamp.heroImage")
              .card-container
                v-card-title(primary-title)
                  h1.main-card-title(style="line-height: 1.5 !important") {{premiumCamp.name}}
                v-card-actions.justify-center
                  v-spacer
                  v-btn(@click="$router.push('/camp/' + premiumCamp.url)")
                    span View Camp
                    v-icon chevron_right
        h1.display-1.mt-4(v-if="allCamps.luxuryCamps") Luxury Camps
        v-layout(row wrap)
          v-flex(xs12 md4 v-for="(luxuryCamp, index) in allCamps.luxuryCamps")
            v-card.ma-4(height="400" raised :img="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + luxuryCamp.heroImage")
              .card-container
                v-card-title(primary-title)
                  h1.main-card-title(style="line-height: 1.5 !important") {{luxuryCamp.name}}
                v-card-actions.justify-center
                  v-spacer
                  v-btn(@click="$router.push('/camp/' + luxuryCamp.url)")
                    span View Camp
                    v-icon chevron_right
        h1.display-1.mt-4(v-if="allCamps.normalCamps") Mid-Range Camps
        v-layout(row wrap)
          v-flex(xs12 md4 v-for="(normalCamp, index) in allCamps.normalCamps")
            v-card.ma-4(height="400" raised :img="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + normalCamp.heroImage")
              .card-container
                v-card-title(primary-title)
                  h1.main-card-title(style="line-height: 1.5 !important") {{normalCamp.name}}
                v-card-actions.justify-center
                  v-spacer
                  v-btn(@click="$router.push('/camp/' + normalCamp.url)")
                    span View Camp
                    v-icon chevron_right
        h1.display-1.mt-4(v-if="allCamps.cheapCamps") Low-Price Camps
        v-layout(row wrap)
          v-flex(xs12 md4 v-for="(cheapCamp, index) in allCamps.cheapCamps")
            v-card.ma-4(height="400" raised :img="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + cheapCamp.heroImage")
              .card-container
                v-card-title(primary-title)
                  h1.main-card-title(style="line-height: 1.5 !important") {{cheapCamp.name}}
                v-card-actions.justify-center
                  v-spacer
                  v-btn(@click="$router.push('/camp/' + cheapCamp.url)")
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
    Navbar,
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
            heroImage
          },
          premiumCamps{
            name
            url
            shortDescription
            heroImage
          },
          normalCamps{
            name
            url
            shortDescription
            heroImage
          }
          cheapCamps{
            name
            url
            shortDescription
            heroImage
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
.camps-grid {
  display: grid;
  @media screen and (max-width: 960px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  grid-template-columns: repeat(10, 10%);
  grid-template-rows: repeat(4, 20%);
  grid-gap: 1rem;
}

.wide-card {
  @media screen and (max-width: 960px) {
    grid-column-end: span 2;
    grid-row-end: span 12;
  }
  grid-column-end: span 3;
  grid-row-end: span 8;
}

.tall-card {
  grid-column-end: span 2;
  grid-row-end: span 16;
}

.card-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

.main-card-title {
  text-shadow: 0px 0px 20px grey;
}
</style>
