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
                      v-layout(column)
                        h4 Camp Name
                        v-text-field(solo label='Camp Name')
                    v-spacer
                    v-flex(xs5)
                      v-layout(column)
                        h4 Email
                        v-text-field(solo label='Email')
                  v-layout.layout(row)
                    v-flex(xs5)
                      v-layout(column)
                        h4 Phone Number
                        v-text-field(solo label='Phone Number')
                    v-spacer
                    v-flex(xs5)
                      v-layout(column)
                        h4 Camp Url
                        v-text-field(solo label='Camp Url')
                  v-layout.layout(row)
                    v-flex(xs5)
                      v-layout(column)
                        h4 Amenities
                        v-text-field(solo label='Amenities')
                    v-spacer
                    v-flex(xs5)
                      v-layout(column)
                        h4 Services
                        v-text-field(solo label='Services')
        v-tab-item(id='documents')
          v-container.basic-details(fluid)
            v-card.details-card(width='95%' color='transparent')
              v-form(ref='form' lazy-validation)
                  v-layout.layout(row)
                    v-flex(xs5)
                      v-layout(column)
                        h4 Amenities
                        v-text-field(solo label='Amenities')
                    v-spacer
                    v-flex(xs5)
                      v-layout(column)
                        h4 Services
                        v-text-field(solo label='Services')
                  v-layout.layout(row)
                    v-flex(xs5)
                      v-layout(column)
                        h4 Amenities
                        v-text-field(solo label='Amenities')
                    v-spacer
                    v-flex(xs5)
                      v-layout(column)
                        h4 Services
                        v-text-field(solo label='Services')
                  v-layout.layout(row)
                    v-flex(xs5)
                      v-layout(column)
                        h4 Amenities
                        v-text-field(solo label='Amenities')
                    v-spacer
                    v-flex(xs5)
                      v-layout(column)
                        h4 Services
                        v-text-field(solo label='Services')
        v-tab-item(id='bankDetails')
          v-container.basic-details(fluid)
            v-card.details-card(width='95%' color='transparent')
              v-form(ref='form' lazy-validation)
                  v-layout.layout(row)
                    v-flex(xs5)
                      v-layout(column)
                        h4 Amenities
                        v-text-field(solo label='Amenities')
                    v-spacer
                    v-flex(xs5)
                      v-layout(column)
                        h4 Services
                        v-text-field(solo label='Services')
                  v-layout.layout(row)
                    v-flex(xs5)
                      v-layout(column)
                        h4 Amenities
                        v-text-field(solo label='Amenities')
                    v-spacer
                    v-flex(xs5)
                      v-layout(column)
                        h4 Services
                        v-text-field(solo label='Services')
                  v-layout.layout(row)
                    v-flex(xs5)
                      v-layout(column)
                        h4 Amenities
                        v-text-field(solo label='Amenities')
                    v-spacer
                    v-flex(xs5)
                      v-layout(column)
                        h4 Services
                        v-text-field(solo label='Services')
        v-tab-item(id='campDetails')
          v-container.basic-details(fluid)
            v-card.details-card(width='95%' color='transparent')
              v-form(ref='form' lazy-validation)
                  v-layout.layout(row)
                    v-flex(xs5)
                      v-layout(column)
                        h4 Amenities
                        v-text-field(solo label='Amenities')
                    v-spacer
                    v-flex(xs5)
                      v-layout(column)
                        h4 Services
                        v-text-field(solo label='Services')
                  v-layout.layout(row)
                    v-flex(xs5)
                      v-layout(column)
                        h4 Amenities
                        v-text-field(solo label='Amenities')
                    v-spacer
                    v-flex(xs5)
                      v-layout(column)
                        h4 Services
                        v-text-field(solo label='Services')
                  v-layout.layout(row)
                    v-flex(xs5)
                      v-layout(column)
                        h4 Amenities
                        v-text-field(solo label='Amenities')
                    v-spacer
                    v-flex(xs5)
                      v-layout(column)
                        h4 Services
                        v-text-field(solo label='Services')
    v-container.camp-display(fluid)
            v-card.details-card(width='95%' color='transparent')
              v-card-actions
                v-spacer
                v-btn(flat) Cancel
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
