<template lang="pug">
  footer(color="dark")
    v-container(grid-list-sm dark)
      v-layout(row wrap)
        v-flex(sm12 md1).text-xs-center
          .d-flex.align-center.justify-center.fill-height
            v-btn(icon small)
              img(src="/vectors/facebook-white.svg" height="18")
            v-btn(icon small)
              img(src="/vectors/instagram.svg" height="18")
            v-btn(icon small)
              img(src="/vectors/twitter.svg" height="18")
          

        v-flex(sm12 md10).text-xs-center
          v-btn(flat dark) About
          v-btn(flat dark) Terms and Conditions
          v-btn(flat dark) Privacy Policy
          v-btn(flat dark) Add your camp

        v-flex(sm12 md1).text-xs-center
          .d-flex.align-center.justify-center.fill-height
            img(src="/vectors/Campzy-logo-white.svg" height="32").hidden-sm-and-down
            img(src="/vectors/Campzy-logo-white.svg" height="32").hidden-md-and-up.mt-2

</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss">
footer{
  background: #212121;
}
</style>
