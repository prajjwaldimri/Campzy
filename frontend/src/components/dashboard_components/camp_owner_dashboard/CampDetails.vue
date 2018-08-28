<template lang="pug">
  v-container.camp-display(fluid)
    .page-title
      h1 Camp Details
    v-layout(row wrap)
      v-flex(xs12 md5)
        v-card.details-card( flat)
          v-card-title.title(primary-title)
            h2.font-weight-light Basic Details
          v-form(ref='form' lazy-validation)
              v-layout.layout(column)
                v-flex(xs12)
                  span Name
                  v-text-field(solo label='Camp Name' v-model='camp.name' :disabled='nameDisable')
                v-flex(xs12)
                  span Email
                  v-text-field(solo label='Email' v-model='camp.email')
                v-flex(xs12)
                  span Phone
                  v-text-field(solo label='Phone Number' v-model='camp.phoneNumber')
                v-flex(xs12)
                  span Camp Url
                  v-text-field(solo label='Camp Url' v-model='camp.url')
      v-flex(xs12 md7)
        v-card.details-card(flat)
          v-card-title.title(primary-title)
            h2.font-weight-light Documnents
          v-form(ref='form' lazy-validation)
              v-layout.layout(column)
                v-flex(xs12)
                  span Amenities
                  v-text-field(solo label='Camp Name' v-model='camp.name' :disabled='nameDisable')
                v-flex(xs12)
                  v-text-field(solo label='Email' v-model='camp.email')
                v-flex(xs12)
                  v-text-field(solo label='Phone Number' v-model='camp.phoneNumber')
                v-flex(xs12)
                  v-text-field(solo label='Camp Url' v-model='camp.url')
      v-flex(xs12 md6)
        v-card.details-card(flat)
          v-card-title.title(primary-title)
            h2.font-weight-light Bank Details
          v-form(ref='form' lazy-validation)
              v-layout.layout(column)
                v-flex(xs12)
                  span Amenities
                  v-text-field(solo label='Camp Name' v-model='camp.name' :disabled='nameDisable')
                v-flex(xs12)
                  v-text-field(solo label='Email' v-model='camp.email')
                v-flex(xs12)
                  v-text-field(solo label='Phone Number' v-model='camp.phoneNumber')
                v-flex(xs12)
                  v-text-field(solo label='Camp Url' v-model='camp.url')
      v-flex(xs12 md6)
        v-card.details-card(flat)
          v-card-title.title(primary-title)
            h2.font-weight-light Camp Details
          v-form(ref='form' lazy-validation)
              v-layout.layout(column)
                v-flex(xs12)
                  span Amenities
                  v-text-field(solo label='Camp Name' v-model='camp.name' :disabled='nameDisable')
                v-flex(xs12)
                  v-text-field(solo label='Email' v-model='camp.email')
                v-flex(xs12)
                  v-text-field(solo label='Phone Number' v-model='camp.phoneNumber')
                v-flex(xs12)
                  v-text-field(solo label='Camp Url' v-model='camp.url')


      v-container.camp-display(fluid)
          v-card.details-card(width='95%' color='transparent')
            v-card-actions
              v-spacer
              v-btn(flat) Cancel
              v-btn.text--white(color='green' @click='saveCampDetails' :loading='isDataUpdating') Save
</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { getCamp } from '../../../queries/queries';
import { saveCampDetails } from '../../../queries/mutationQueries';
import { EventBus } from '../../../event-bus';

export default {
  data() {
    return {
      el: 0,
      camp: {},
      isDataUpdating: false,
      nameDisable: false,
    };
  },

  mounted() {
    this.getCampDetails();
  },

  methods: {
    // Get the camp ID related to current user
    getCampDetails() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      client.request(getCamp).then((data) => {
        this.camp = data.currentUserCamp;
        if (this.camp.name != null) { this.nameDisable = true; }
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      });
    },
    // Save updated vlaues of camp
    saveCampDetails() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const variables = {
        id: this.camp.id,
        name: this.camp.name,
        phoneNumber: this.camp.phoneNumber,
        url: this.camp.url,
        email: this.camp.email,
        ownerId: this.camp.ownerId,
      };
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      this.isDataUpdating = true;
      client.request(saveCampDetails, variables).then(() => {
        this.getCampDetails();
        EventBus.$emit('show-success-notification-short', 'Successfully Updated ');
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      }).finally(() => { this.isDataUpdating = false; });
    },
  },
};
</script>

<style lang="scss" scoped>
.camp-display {
  margin: 0px 0px 0px 0px;
  height: 100vh;

  .page-title {
    margin-left: 1.6rem;
  }
}

.tabs-details {
  width: 100%;
}

.details-card {
  margin: 0rem 0rem 0rem 2rem;
  padding: 2rem;
  box-shadow: none;
}
.layout {
  margin-top: 2rem;
}

.item-align {
  align-items: center;
}

.title {
  padding: 0px;
}
</style>
