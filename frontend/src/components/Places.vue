<template lang="pug">
  h1 hi
</template>
<script>
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../event-bus';

export default {
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
