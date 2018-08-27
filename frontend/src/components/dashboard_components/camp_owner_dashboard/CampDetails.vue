<template lang="pug">
  v-container.camp-display(fluid)
    v-tabs.tabs-details(color='transparent' grow)
      v-tabs-slider(color="green")
      v-tab(href='#basicDetails') Basic Details
      v-tab(href='#documents') Documents
      v-tab(href='#bankDetails') Bank Details
      v-tab(href='#campDetails') Camp Details
      v-tabs-items
        v-tab-item(id='basicDetails')
          v-container.basic-details(fluid)
            v-card.details-card(width='95%' color='transparent')
              v-form(ref='form' lazy-validation)
                  v-layout.layout(row)
                    v-flex(xs5)
                      v-text-field(solo label='Camp Name' v-model='camp.name')
                    v-spacer
                    v-flex(xs5)
                      v-text-field(solo label='Email' v-model='camp.email')
                  v-layout.layout(row)
                    v-flex(xs5)
                      v-text-field(solo label='Phone Number' v-model='camp.phoneNumber')
                    v-spacer
                    v-flex(xs5)
                      v-text-field(solo label='Camp Url' v-model='camp.url')
                  v-layout.layout(row)
                    v-flex(xs5)
                      v-text-field(solo label='Amenities')
                    v-spacer
                    v-flex(xs5)
                      v-text-field(solo label='Services')

    v-container.camp-display(fluid)
            v-card.details-card(width='95%' color='transparent')
              v-card-actions
                v-spacer
                v-btn(flat) Cancel
                v-btn(color='green' @click='saveCampDetails' :loading='isDataUpdating') Save
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
  padding: 0px;
  display: flex;
  height: 100vh;
  flex-direction: column;
}
.basic-details {
  padding: 4rem 2rem 1rem 2rem;
  padding: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tabs-details {
  width: 100%;
}

.details-card {
  margin-top: 4rem;
  padding: 2rem;
  box-shadow: none;
}
.layout {
  margin-top: 2rem;
}

.item-align {
  align-items: center;
}
</style>
