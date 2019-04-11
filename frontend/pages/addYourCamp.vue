<template lang="pug">
  .requests-view
    navbar(:app="true" :absolute="true" :dark="true")
    v-responsive.responsive-img
      v-img(src='https://images.pexels.com/photos/112378/pexels-photo-112378.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')
        v-container.img-container(fluid)
          v-layout.lightbox.white--text(column fill-height).pt-5.mt-5
            .d-flex.image-flex
              .d-flex.align-self-center
                h1.display-3.camp-name.hidden-sm-and-down Connect With Us
                h1.display-1.camp-name.hidden-md-and-up Connect With Us
    v-container(fluid)
      v-layout(column).mt-2
        v-flex(xs12)
          h1(style='width:100%') Your Details
        v-flex(xs12).mt-2
          v-layout(row wrap)
            v-flex(xs12 md4)
              v-text-field(label='Name' v-model='name' outline)
            v-flex(xs12 md4).flex-margin
              v-text-field(label='Phone Number' v-model='phoneNumber' outline)
            v-flex(xs12 md2).flex-margin
              v-btn(color="blue" dark @click='sendCampRequest' :loading='sendingRequest') Send

    Footer


</template>

<script>
import { GraphQLClient } from 'graphql-request'
import navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { sendRequest } from '../queries/mutationQueries'
import { EventBus } from '../layouts/event-bus'

export default {
  name: 'AddRequest',
  $_veeValidate: {
    validator: 'new'
  },
  components: {
    navbar,
    Footer
  },
  data() {
    return {
      name: '',
      phoneNumber: '',
      sendingRequest: false
    }
  },

  methods: {
    sendCampRequest() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/login')
      }
      EventBus.$emit('show-progress-bar')
      this.sendingRequest = true
      const client = new GraphQLClient('https://api.campzy.in/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      const variables = {
        name: this.name,
        phoneNumber: this.phoneNumber
      }

      client
        .request(sendRequest, variables)
        .then(() => {
          EventBus.$emit(
            'show-success-notification-short',
            'Scuccessfully Send Your Request'
          )
        })
        .catch(() => {
          EventBus.$emit(
            'show-error-notification-long',
            'Please Try again or Login First'
          )
        })
        .finally(() => {
          this.sendingRequest = false
          EventBus.$emit('hide-progress-bar')
          this.clearFields()
        })
    },
    clearFields() {
      this.name = ''
      this.phoneNumber = ''
    }
  }
}
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

.campzy-logo {
  min-width: 40vw;
  @media screen and (max-width: 960px) {
    min-width: 90vw;
  }
  text-align: center;
  user-select: none;

  .display-3 {
    font-family: 'GlacialIndifferenceRegular', sans-serif !important;
    font-size: 5rem !important;
  }

  img {
    height: 4.2rem;
  }
}
.camp-name {
  font-family: 'Permanent Marker', cursive !important;
  text-shadow: 0px 0px 20px black;
  text-align: center;
}
.flex-margin {
  margin-left: 24px;
  @media screen and (max-width: 956px) {
    margin-left: 0px;
  }
}

.responsive-img {
  height: 90vh;
  @media screen and (max-width: 959px) {
    height: 70vh;
  }
}
.img-container {
  margin-top: 15rem;
  @media screen and (max-width: 959px) {
    margin-top: 7rem;
  }
}

.v-responsive.v-image {
  height: 100% !important;
}
</style>
