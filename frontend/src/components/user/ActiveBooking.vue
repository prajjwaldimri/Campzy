<template lang="pug">
  v-container
    v-layout(column)

      v-card(v-for="booking in bookings").py-4
        v-layout(row wrap)
          v-flex(md2).pl-5
            v-flex
              h5.headline Jonnathan Hammond
              h6.subheading.mt-1.text-green.text--darken-2 Ram Varma Camp
          v-divider(vertical).pr-5

          v-flex(md6).pl-5

          v-divider(vertical).pr-3
          v-flex(md3).pl-5
            .d-flex.justify-center.align-center(style="height: 100%")
              v-btn(color="error").white--text
                v-icon.pr-2 cancel
                span Cancel Booking


</template>

<script>
export default {
  data() {
    return {
      bookings: [1, 2, 3, 4],
    };
  },
};
</script>
