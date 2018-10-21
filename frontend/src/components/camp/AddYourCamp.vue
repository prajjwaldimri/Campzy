<template lang="pug">
  .requests-view
    navbar(:app="true" :absolute="true" :dark="true")
    v-responsive(height='100vh')
      v-img(src='https://images.pexels.com/photos/112378/pexels-photo-112378.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')
        v-container(fluid)
          v-layout.lightbox.white--text(column fill-height).pt-5.mt-5
            .d-flex.image-flex
              .d-flex.align-self-center
                h1.display-3.camp-name.hidden-sm-and-down.text-uppercase Add Your Camp
    v-container(fluid)
      v-layout(row).mt-5
        v-flex(xs12)
          h1(style='width:100%').hidden-sm-and-down hi
        v-flex(xs12 md6).d-flex.align-self-end
          v-card.connect-card
            v-card-title(primary-title)
              div
                h3.headline.font-weight-normal.mb-0 Your Details
            v-container
              v-text-field(label='Name' v-model='name')
              v-text-field(label='Phone Number' v-model='phoneNumber')
            v-card-actions(style='padding:24px')
              v-spacer
                v-btn(color="blue" dark @click='sendCampRequest') Send

    Footer


</template>

<script>
import { GraphQLClient } from 'graphql-request';
import navbar from '../Navbar.vue';
import Footer from '../Footer.vue';
import { sendRequest } from '../../queries/mutationQueries';

export default {
  components: {
    navbar,
    Footer,
  },
  data() {
    return ({
      name: '',
      phoneNumber: '',
    });
  },
  methods: {
    sendCampRequest() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      const variables = {
        name: this.name,
        phoneNumber: this.phoneNumber,
      };

      client.request(sendRequest, variables).then((data) => {
        console.log(data);
      }).catch((err) => {
        console.log(err);
      });
    },
  },

};
</script>

<style lang="scss" scoped>
.requests-view {
  height: 100%;
}
.image-flex {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > * {
    flex-grow: 0 !important;
    margin-top: auto;
  }
}

.connect-card {
  border-radius: 10px;
  width: 400px !important;
  height: 400px;
}

.campzy-logo {
  min-width: 40vw;
  @media screen and (max-width: 960px) {
    min-width: 90vw;
  }
  text-align: center;
  user-select: none;

  .display-3 {
    font-family: "GlacialIndifferenceRegular", sans-serif !important;
    font-size: 5rem !important;
  }

  img {
    height: 4.2rem;
  }
}
.camp-name {
  font-family: "Permanent Marker", cursive !important;
  text-shadow: 0px 0px 20px black;
  text-align: center;
}
</style>
