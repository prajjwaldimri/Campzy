<template lang="pug">
  .bank-container
    h2.font-weight-bold.headline.text-uppercase Link Bank Details
    v-layout(row wrap)
      v-flex.mt-2(xs12 md7 style='max-width:100%')
        v-card.body-card(flat)
          v-form(ref='form' lazy-validation)
              v-layout.layout(row wrap)
                v-flex(xs12)
                  v-text-field(label='Beneficiary Name' v-model='beneficiaryName' data-vv-name="beneficiaryName" v-validate="'required'"
                  :error-messages="errors.collect('beneficiaryName')")
                v-flex.flex-spacing(xs12)
                  v-select(label='Account Type'  :items='accountTypeItems' v-model='accountType' data-vv-name="accountType" v-validate="'required'"
                  :error-messages="errors.collect('accountType')")
                v-flex.flex-spacing(xs12)
                  v-text-field(label='Account Number' v-model='accountNumber' data-vv-name="accountNumber" v-validate="'required'"
                  :error-messages="errors.collect('accountNumber')")
                v-layout(row wrap)
                  v-flex.flex-spacing(xs12 md6)
                    v-text-field(label='IFSC Code' v-model='IFSCCode' data-vv-name="IFSCCode" v-validate="'required'"
                  :error-messages="errors.collect('IFSCCode')")
                  v-flex.flex-spacing(xs12 md4)
                    v-btn(dark icon v-show='!isIFSCVerified')
                      v-icon(color='red' ) error
                    v-btn(dark icon v-show='isIFSCVerified')
                      v-icon(color='green' ) check
          v-card-actions
            v-spacer
            v-btn(dark) Clear
            v-btn(color='green' dark @click='linkBankDetails'  :loading='saveDetails') Save
      v-flex.mt-2.ml-5(xs12 md4 style='max-width:100%' v-show='isIFSCVerified')
        v-card.body-card(flat)
          v-card-title.headline.font-weight-bold.pa-0 Bank Details
          v-form(ref='form' lazy-validation)
              v-layout.layout(row wrap)
                v-flex(xs12)
                  v-text-field(label='Bank Name' v-model='ifscDetails.BANK' readonly)
                v-flex.flex-spacing(xs12)
                  v-text-field(label='Branch' v-model='ifscDetails.BRANCH'  readonly)
                v-flex.flex-spacing(xs12)
                  v-text-field(label='Branch' v-model='ifscDetails.ADDRESS'  readonly)
                v-flex.flex-spacing(xs12)
                  v-text-field(label='City' v-model='ifscDetails.CITY' readonly)
                v-layout(row wrap)
                  v-flex.flex-spacing(xs12 md5)
                    v-text-field(label='District' v-model='ifscDetails.DISTRICT' readonly)
                  v-flex.flex-spacing.ml-5(xs12 md5)
                    v-text-field(label='State' v-model='ifscDetails.STATE' readonly)
</template>

<script>
import { GraphQLClient } from 'graphql-request';
import { EventBus } from '../../../event-bus';
import {
  addBank,
} from '../../../queries/mutationQueries';
import { isIFSCValid, getIFSCDetails, getBankDetails } from '../../../queries/queries';

export default {
  name: 'bankDetails',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      accountNumber: '',
      accountTypeItems: ['Savings', 'Current'],
      accountType: '',
      beneficiaryName: '',
      IFSCCode: '',
      saveDetails: false,
      isIFSCVerified: false,
      ifscDetails: {},

    };
  },

  mounted() {
    this.getBankDetails();
  },

  methods: {

    getBankDetails() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/login');
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(getBankDetails).then((data) => {
        console.log(data);
      }).catch((err) => {
        console.log(err);
        EventBus.$emit('show-error-notification-short', 'Failed to get Bank Details');
      });
    },

    linkBankDetails() {
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
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
          client.request(addBank, variables).then(() => {
            EventBus.$emit('show-success-notification-short', 'Successfully Updated');
          }).catch(() => {
            EventBus.$emit('show-error-notification-short', 'Failed to Update');
          }).finally(() => { this.saveDetails = false; });
        }
      });
    },

    getIFSCDetails() {
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

      client.request(getIFSCDetails, variables).then((data) => {
        this.ifscDetails = data.getIFSCDetails;
      }).catch(() => {
        EventBus.$emit('show-error-notification-short', 'Failed to get Bank Details');
      });
    },

  },
  watch: {
    IFSCCode(ifsc) {
      if (ifsc.length >= 5) {
        if (!this.$cookie.get('sessionToken')) {
          this.$router.push('/login');
        }
        const client = new GraphQLClient('/graphql', {
          headers: {
            Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
          },
        });
        this.validatingIFSC = true;
        const variables = {
          IFSCCode: ifsc,
        };
        client.request(isIFSCValid, variables).then((data) => {
          if (data.isIFSCValid === true) {
            this.isIFSCVerified = true;
            this.getIFSCDetails();
          } else {
            this.isIFSCVerified = false;
          }
        }).catch(() => {
          EventBus.$emit('show-error-notification-short', 'Failed to Check IFSC code');
        }).finally(() => { this.validatingIFSC = false; });
      }
    },
  },
};
</script>


<style lang="scss" scoped>
.bank-container {
  width: 100%;
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
