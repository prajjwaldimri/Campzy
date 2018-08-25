<template lang="pug">
  v-container.camp-display(fluid)
    v-tabs.tabs-details(color='transparent' grow)
      v-tabs-slider(color="green")
      v-tab(href='#details') Basic Details
      v-tab Documents
      v-tab(href='#bank') Bank Details
      v-tab Camp Details
      v-tabs-items
        v-tab-item(id='details')
          v-container.basic-details(fluid)
            v-card.details-card(width='95%' color='transparent')
              v-form(ref='form' lazy-validation)
                  v-layout.layout(row)
                    v-flex(xs2)
                      h3 Camp Name:
                    v-flex(xs8)
                      v-text-field(solo label='Camp Name')
                  v-layout.layout(row)
                    v-flex.item-align(xs2)
                      h3  Owner Name:
                    v-flex(xs8)
                      v-text-field(solo label='Owner Name')
                  v-layout.layout(row)
                    v-flex.item-align(xs2)
                      h3 Phone Number:
                    v-flex(xs8)
                      v-text-field(solo label='Phone Number')

              v-btn(flat) Cancle
              v-btn(color='green') Save
        v-tab-item(id='bank')
          v-container.basic-details(fluid)
            v-card.details-card(width='95%' color='transparent')
              v-form(ref='form' lazy-validation)
                  v-layout.layout(row)
                    v-flex(xs2)
                      h3 Bank Name:
                    v-flex(xs8)
                      v-text-field(solo label='Bank Name')
                  v-layout.layout(row)
                    v-flex.item-align(xs2)
                      h3  Account Number:
                    v-flex(xs8)
                      v-text-field(solo label='Account Number')
                  v-layout.layout(row)
                    v-flex.item-align(xs2)
                      h3 IFSC code:
                    v-flex(xs8)
                      v-text-field(solo label='IFSC code')

              v-btn(flat) Cancle
              v-btn(color='green') Save
</template>

<script>
export default {
  data() {
    return {
      el: 0,
    };
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
