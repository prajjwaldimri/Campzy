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
          v-btn(flat dark ) About
          v-btn(flat dark @click="$router.push('/termsAndConditions')") Terms and Conditions
          v-btn(flat dark @click="$router.push('/privacyPolicy')") Privacy Policy
          v-btn(flat dark @click="$router.push({name: 'addYourCamp'})") Add your camp


        v-flex(sm12 md1).text-xs-center
          .d-flex.align-center.justify-center.fill-height
            .campzy-logo(@click="$router.push('/')")
              span.white--text Camp
              span.green--text zy

</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss">
footer {
  background: #212121;
}

.campzy-logo {
  font-family: "GlacialIndifferenceRegular" !important;
  font-size: 2rem;
  cursor: pointer;
}
</style>
