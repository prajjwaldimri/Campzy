<template lang="pug">
  v-dialog(v-model='isAgreementAccepted' width='1000' persistent)
    v-card(flat).privacy-container
      v-container
        v-layout(column)
          .content.pt-4
            .d-flex.justify-center
              img(src='/vectors/Campzy-logo-black.svg' height='60' width='60')
            v-flex.mt-5
              p.subheading.font-weight-bold.grey--text.text--darken-3 Please read these Terms & Conditions carefully as they contain important information about legal rights, remedies and obligations. By accessing or using the Campzy Platform, you agree to comply with and be bound by these Terms of Service.

            v-flex.mt-5
              h2.headline.font-weight-bold.grey--text.text--darken-3 Terms and Conditions

              p.mt-4.font-weight-medium.grey--text.text--darken-3 These Terms of Service ("Terms") constitute a legally binding agreement ("Agreement") between Channel Partner and Campzy governing access to and use of the Campzy website.


            v-flex.mt-5
              h2.headline.font-weight-bold.grey--text.text--darken-3 Services

              p.mt-4.font-weight-medium.grey--text.text--darken-3 Your Company offers travel-related services and accommodations.
                br
                | Campzy will offer the above-listed services and accommodations to business and consumer clients as part of travel packages pursuant to the terms of this Campzy agreement.
                br
                | In return, your Company agrees to pay the Campzy commissions based on actual sales.


            v-flex.mt-5
              h2.headline.font-weight-bold.grey--text.text--darken-3 Company Responsibilities

              p.mt-4.font-weight-medium.grey--text.text--darken-3 Your Company shall provide Campzy with a non-exclusive license to offer Your Company’s services and accommodations as part of vacation and travel packages.
                br
                | Additionally, Your company agrees to provide sales and marketing material to Campzy for the purpose of promoting the accommodations and services listed in this agreement.
            v-flex.mt-5
              h2.headline.font-weight-bold.grey--text.text--darken-3 Campzy Responsibilities

              p.mt-4.font-weight-medium.grey--text.text--darken-3 The Campzy will offer items listed in this agreement to businesses and consumers as part of travel packages.
                br
                | The Campzy agrees to offer such items at prices approved by your Company without exception.
                br
                | The Campzy agrees to report all sales to your Company.
                br
                | The Campzy shall provide your company with full contact information for each client purchasing your Company’s services or accommodations.

            v-flex.mt-5
              h2.headline.font-weight-bold.grey--text.text--darken-3 Payment

              p.mt-4.font-weight-medium.grey--text.text--darken-3 Campzy shall receive commissions equal to 12% of gross sales. Invoices for commissions shall be generated after each transaction, and shall be adjusted in the net payment to your Company.
                br
                | In case of a cancellation from user’s end, Campzy shall retain its 12% service charge and shall pay your company the remaining balance according to Campzy’s cancellation policy.

            v-flex.mt-5
              h2.headline.font-weight-bold.grey--text.text--darken-3 Disclosure

              p.mt-4.font-weight-medium.grey--text.text--darken-3 Campzy agrees to provide your company with an up-to-date ledger containing all reservations or tours conducted by Campzy.

                br
                | Any and all terminated bookings shall be provided to your company on a daily basis in a clear and concise ledger.
            v-flex.mt-5
              h2.headline.font-weight-bold.grey--text.text--darken-3 Confidentiality
              p.mt-4.font-weight-medium.grey--text.text--darken-3 Campzy hereby acknowledges they may become aware of information your company may deem as confidential including but not limited to:
              ul.ml-5
                li Sale Dates
                li Special Rate Changes
                li Availability
              p.mt-4.font-weight-medium.grey--text.text--darken-3 Any information listed as confidential by your company shall remain private and will not be made publicly available by campzy.
                br
                | In the event your company becomes aware of a breach of any of this agreement’s provisions it will have the right to terminate this Campzy agreement in its entirety.


            v-flex.mt-5
              h2.headline.font-weight-bold.grey--text.text--darken-3 Term
              p.mt-4.font-weight-medium.grey--text.text--darken-3 This Campzy Agreement shall remain in effect for a period of 1 year from the agreement date.
                br
                | Upon the completion of this agreement the Parties may agree to extend for 1 year from the completion date.
                br
                | In the Instance either party shall decline to extend this agreement the agreement shall conclude on the date of declining.

            v-flex.mt-5
              h2.headline.font-weight-bold.grey--text.text--darken-3 Acknowledgement
              p.mt-4.font-weight-medium.grey--text.text--darken-3 Campzy acknowledges that during the term of this Travel Agency Agreement the following shall remain in effect:
                br
                | your company shall remain the rightful owner of any and all titles, rights, and interests in the property as well as any materials provided for the completion of this agreement.
                br
                | Campzy will have no rights to sell or trade any material provided by your company during the term of this agreement.
                br
                | campzy will not copy or duplicate any material provided by your company unless previous approval has been granted.

            v-flex.mt-5
              h2.headline.font-weight-bold.grey--text.text--darken-3 Termination
              p.mt-4.font-weight-medium.grey--text.text--darken-3 Either party may terminate this agreement in its entirety with prior written notice within 30 days of the requested termination date.
                br
                | If any terms or conditions contained within this agreement are breached, the responding party shall have the opportunity to terminate this agreement.
                br
                | Upon termination, Campzy agrees to return any and all property(In any form) provided by your company in the condition it was received in.
                br
                | Upon the termination of this travel agency agreement all bookings in process will become void and any outstanding balances will become due.

            v-flex.mt-5
              h2.headline.font-weight-bold.grey--text.text--darken-3 Assignment
              p.mt-4.font-weight-medium.grey--text.text--darken-3 The Parties agree to refrain from transferring or selling any portion of this agreement without prior written agreement from the party requesting such actions.
                br
                | Any third parties involved in this agreement must be assigned and maintained by your company.

              v-flex.mt-5
              h2.headline.font-weight-bold.grey--text.text--darken-3 Acceptance
              p.mt-4.font-weight-medium.grey--text.text--darken-3 By clicking the “I accept” button you hereby acknowledge the receipt and understanding of all the terms and conditions as outlined in this Campzy agreement.
      v-card-actions
        v-spacer
        v-btn(color='blue' dark @click='acceptAgreement' :loading='acceptingAgreement') Accept

</template>

<script>
import { GraphQLClient } from 'graphql-request'
import { EventBus } from '../layouts/event-bus'
import { acceptAgreement } from '../queries/mutationQueries'

export default {
  data() {
    return {
      isAgreementAccepted: false,
      agreementAccepted: false,
      acceptingAgreement: false
    }
  },
  mounted() {
    EventBus.$on('agreement-not-accepted', () => {
      this.isAgreementAccepted = true
    })
  },
  methods: {
    closeDialog() {
      this.isAgreementAccepted = false
    },

    acceptAgreement() {
      this.agreementAccepted = true
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/')
      }
      this.acceptingAgreement = true
      const client = new GraphQLClient('https://api.campzy.in/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })

      const variables = {
        agreementAccepted: this.agreementAccepted
      }
      client
        .request(acceptAgreement, variables)
        .then(() => {
          this.closeDialog()
        })
        .catch(() => {
          EventBus.$emit(
            'show-error-notification-short',
            'Please try again later!'
          )
        })
        .finally(() => {
          this.acceptingAgreement = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.privacy-container {
  padding: 0px;
}
.privacy-container p {
  font-size: 1.2rem !important;
  line-height: 2.3rem;
  justify-content: center;
}

.privacy-container ul {
  @media screen and (max-width: 960px) {
    margin-left: 0.5rem !important;
  }
}

.privacy-container ul li {
  font-size: 1.2rem !important;
  line-height: 2.3rem;
  justify-content: center;
  font-weight: 500;
  margin-top: 0.8rem;
  color: #424242;
  caret-color: #424242;
}
</style>
