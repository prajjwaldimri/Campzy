<template lang="pug">
  h1 hi
</template>
<script>
import { GraphQLClient } from 'graphql-request';

export default {
  data() {
    return {};
  },
  mounted() {
    this.getCampByPlaces();
  },

  methods: {
    getCampByPlaces() {
      const client = new GraphQLClient('/graphql');
      const getCampByPlace = `query($place: String!){
        getCampsInPlace(place: $place){
          luxuryCamps{
            name
          },
          premiumCamps{
            name
          },
          normalCamps {
            name
          },
          cheapCamps{
            name
          }
        }
      }`;
      const variables = {
        place: 'Delhi',
      };

      client
        .request(getCampByPlace, variables)
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
