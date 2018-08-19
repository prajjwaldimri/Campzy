<template lang="pug">
  .home-flex
    transition(appear name="slide-y-reverse-transition")
      .search-flex
        .campzy-logo
          span Camp
          span.light-green--text.text--accent-4 zy
        v-text-field(label="Try Nature, Leh, Mountains....." append-icon="fas fa-search"
        autofocus="true" color="green" full-width="true" outline single-line)

</template>

<script>
export default {
  name: 'Home',
};
</script>

<style lang="scss">
.home-flex {
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url("https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?cs=srgb&dl=camp-camping-dark-45241.jpg&fm=jpg");
  background-size: cover;

  .search-flex {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .v-input {
      min-width: 50vw;
    }
  }

  .campzy-logo > * {
    font-size: 3.5rem;
  }

  .green-text {
    color: #2ecc71;
  }
}
</style>
