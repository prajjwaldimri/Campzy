<template lang="pug">
  .requests-view
    v-responsive(height='100vh')
      v-img(src='https://images.pexels.com/photos/112378/pexels-photo-112378.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')
        v-container(fluid)
          v-layout.lightbox.white--text(column fill-height).pt-5.mt-5
            .d-flex.image-flex
              .d-flex.align-self-center
                h1.display-3.camp-name.hidden-sm-and-down.text-uppercase Add Your Camp
            .d-flex.align-self-start.pb-4.px-4(style='width:100%;margin-top:5rem;')
              h1(style='width:100%').hidden-sm-and-down hi
              v-flex(xs12).d-flex.align-self-end
                v-card.connect-card
                  v-card-title( primary-title)
                    div
                      h3.headline.font-weight-normal.mb-0 Your Details
                  v-container
                    v-text-field(label='Name')
                    v-text-field(label='Email')
                    v-text-field(label='Phone Number')
                  v-card-actions(style='padding:24px')
                    v-spacer
                    v-btn(color="blue" dark) Send


</template>
<style lang="scss" scoped>
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
</style>
