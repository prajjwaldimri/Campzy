<template lang="pug">
  v-container(fluid)
    v-card
      v-card-title.title(primary-title)
        h2.font-weight-bold.headline Write Blog
      v-card-text
        v-flex(xs12)
          v-form(ref='form' lazy-validation)
            v-layout(row wrap)
              v-layout(row)
                v-flex(xs7)
                  v-text-field( label='Title')
                v-spacer
                v-flex(xs4)
                  span Choose Hero Image
                  input.mt-2(type='file' name='hero_image' ref='panCard'
                  v-on:change="storeImage"  accept='image/png, image/jpeg' disabled )
              v-flex(xs12)
                v-textarea(label='Content' height='55vh' outline)
      v-card-actions
        v-spacer
        v-btn(flat) Clear
        v-btn(color='green' dark) save

</template>

<script>
export default {

  data() {
    return {

    };
  },

  mounted() {

  },

  methods: {

  },
};
</script>
