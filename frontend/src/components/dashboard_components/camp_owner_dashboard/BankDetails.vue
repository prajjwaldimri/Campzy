<template lang="pug">
  v-container(fluid style='height:100%')
    h2.font-weight-bold.headline.text-uppercase Bank Details
    v-flex.mt-2(xs12 md6 style='max-width:100%')
      v-card.body-card(flat)
        v-form(ref='form' lazy-validation)
            v-layout.layout(row wrap)
              v-flex(xs12)
                v-text-field(label='Bank Name' )
              v-flex.flex-spacing(xs12)
                v-text-field(label='Branch' )
              v-flex.flex-spacing(xs12)
                v-text-field(label='Account Number')
              v-flex.flex-spacing(xs12)
                v-text-field(label='IFSC Code')
              v-flex.flex-spacing(xs12)
                v-text-field(label='GST Number')
              v-flex.flex-spacing(xs12)
                v-text-field(label='PAN Number')
        v-card-actions
          v-spacer
          v-btn(color='green' dark) Save
</template>

<style lang="scss" scoped>
.body-card {
  padding: 2rem;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
  @media screen and (max-width: 960px) {
    padding-bottom: 17rem;
  }
}
</style>
