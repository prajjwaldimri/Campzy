<template lang="pug">
  v-container(grid-list-lg)
    v-layout(row wrap)
      v-flex(xs12 md6)

      v-flex(xs12 md6)
        v-card.settings-card
          v-card-title(primary-title)
            h2.font-weight-light BILLING ACCOUNTS
          .settings-flex
            img(src="https://www.phonepe.com/images/generic/PhonePe-Logo.svg" height="64" width="80").ml-2
            v-btn(flat) LINK ACCOUNT
          v-divider
          .settings-flex
            img(src="/vectors/paytm.svg" height="64" width="80")
            v-btn(flat) LINK ACCOUNT
</template>
