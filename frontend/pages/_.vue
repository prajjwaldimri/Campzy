<template lang="pug">
  v-app(dark).notFound
    v-container.d-flex(align-center fluid)
      span.display-2.pl-1 Looks like you got lost
      span.title.pl-2.pt-2.grey--text.text--lighten-1 We can't find what you are looking for!
      v-btn(large color="white" @click="$router.go(-1)").black--text.mt-4 Go Back
        v-icon.pl-2 history
</template>

<style lang="scss" scoped>
.notFound {
  background: url('/lost.jpg');
  background-size: cover;
  .container {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    & > * {
      flex-grow: 0 !important;
    }
  }
}
</style>
