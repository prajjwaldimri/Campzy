<template lang="pug">
  .bank-container
    h2.font-weight-bold.headline.text-uppercase Bank Details
    v-flex.mt-2(xs12 md6 style='max-width:100%')
      v-card.body-card(flat)
        v-form(ref='form' lazy-validation)
            v-layout.layout(row wrap)
              v-flex(xs12)
                v-text-field(label='Beneficiary Name' v-model='beneficiaryName')
              v-flex.flex-spacing(xs12)
                v-text-field(label='Account Type' v-model='accountType' )
              v-flex.flex-spacing(xs12)
                v-text-field(label='Account Number' v-model='accountNumber')
              v-layout(row wrap)
                v-flex.flex-spacing(xs12 md6)
                  v-text-field(label='IFSC Code' v-model='IFSCCode')
                v-flex.flex-spacing(xs12 md4)
                  v-btn(dark @click='validateIFSC') Validate IFSC
        v-card-actions
          v-spacer
          v-btn(dark) Clear
          v-btn(color='green' dark @click='saveBankDetails'  :loading='saveDetails') Save
</template>

<script>
import { GraphQLClient } from 'graphql-request';
// import { EventBus } from '../../../event-bus';
import {
  addBank,
} from '../../../queries/mutationQueries';
import { isIFSCValid } from '../../../queries/queries';

export default {
  data() {
    return {
      accountNumber: '',
      accountType: '',
      beneficiaryName: '',
      IFSCCode: '',
      saveDetails: false,

    };
  },

  methods: {
    saveBankDetails() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/login');
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      this.saveDetails = true;

      const variables = {
        beneficiaryName: this.beneficiaryName,
        accountType: this.accountType,
        accountNumber: this.accountNumber,
        IFSCCode: this.IFSCCode,
      };
      client.request(addBank, variables).then((data) => {
        console.log(data);
      }).catch((err) => {
        console.log(err);
      }).finally(() => { this.saveDetails = false; });
    },

    validateIFSC() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/login');
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      const variables = {
        IFSCCode: this.IFSCCode,
      };
      client.request(isIFSCValid, variables).then((data) => {
        console.log(data);
      }).catch((err) => {
        console.log(err);
      });
    },
  },
};
</script>


<style lang="scss" scoped>
.bank-container {
  padding: 2rem;
  @media screen and (max-width: 960px) {
    padding: 1rem;
    padding-bottom: 10rem;
  }
  height: 100%;
}
.body-card {
  padding: 2rem;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
}
</style>
