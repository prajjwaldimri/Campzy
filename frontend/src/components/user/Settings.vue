<template lang="pug">
  div
    navbar
    .settings-page
      v-container(grid-list-md)
        v-layout(row)
          v-flex(xs12 md6)
            v-card().settings-card
              v-card-title(primary-title)
                h2.font-weight-light EDIT PROFILE
              v-form(ref="form" v-model="editProfileValid")
                v-text-field(label="Name" required v-model="user.name" clearable
                data-vv-name="Name" v-validate="'alpha_spaces|min:3'"
                :error-messages="errors.collect('Name')")
                v-text-field(label="Email" v-validate="'required|email'" required
                 v-model="user.email" clearable data-vv-name="email"
                 :error-messages="errors.collect('email')")
                v-text-field(label="Current Password" v-model="user.currentPassword" clearable
                type="password" counter data-vv-name="currentPassword" v-validate="'min:8'"
                 :error-messages="errors.collect('currentPassword')")
                v-text-field(label="New Password" v-model="user.newPassword" clearable
                type="password" counter data-vv-name="New Password" v-validate="'min:8'"
                 :error-messages="errors.collect('New Password')" ref="newPassword")
                v-text-field(label="Confirm New Password" type="password"
                v-model="user.confirmNewPassword" clearable counter
                v-validate="'confirmed:newPassword'"
                data-vv-name="Confirm New Password"
                :error-messages="errors.collect('Confirm New Password')")
              v-card-actions
                v-spacer
                v-btn(:disabled="editProfileValid" color="green" text-color="white"
                @click="updateProfile") Update Profile
          v-flex(xs12 md6)
            v-card().settings-card
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

<script>
import { GraphQLClient } from 'graphql-request';
import navbar from '../Navbar.vue';

export default {
  components: {
    navbar,
  },
  data() {
    return {
      user: {},
      editProfileValid: false,
    };
  },
  mounted() {
    if (!this.$cookie.get('sessionToken')) {
      this.$router.push({ name: 'login' });
    } else {
      const query = `{currentUser {
        name,
        email,
        dateOfBirth
      }}`;
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(query)
        .then((data) => { this.user = data.currentUser; })
        .catch(() => this.$router.push({ name: 'login' }));
    }
  },
  methods: {
    updateProfile() { },
  },
};
</script>

<style lang="scss" scoped>
.settings-page {
  padding: 4rem 0;

  .settings-card {
    padding: 2rem;
  }

  .settings-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
