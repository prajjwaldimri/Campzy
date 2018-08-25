<template lang="pug">
  div
    EmailVerification
    navbar
    v-alert.alert-dailog(:value='isEmailVerified' color='error' icon='warning' outline) Your Email is not verified!
    .settings-page
      v-container(grid-list-lg)
        v-layout(row)
          v-flex(xs12 md6)
            v-card().settings-card
              v-card-title(primary-title)
                h2.font-weight-light EDIT PROFILE
              v-form
                v-text-field(label="Name" required v-model="user.name" clearable
                data-vv-name="Name" v-validate="'alpha_spaces|min:3|required'"
                :error-messages="errors.collect('Name')")
                v-text-field(label="Email" v-validate="'required|email'" required
                 v-model="user.email" clearable data-vv-name="email"
                 :error-messages="errors.collect('email')")
                v-text-field(label="Current Password" v-model="user.currentPassword" clearable
                type="password" counter data-vv-name="currentPassword" v-validate="'min:8|required'"
                 :error-messages="errors.collect('currentPassword')")
                v-text-field(label="New Password" v-model="user.newPassword" clearable
                type="password" counter data-vv-name="New Password" v-validate="'min:8'"
                 :error-messages="errors.collect('New Password')" ref="newPassword")
                v-text-field(label="Confirm New Password" type="password"
                v-model="user.confirmNewPassword" clearable counter
                v-validate="'confirmed:newPassword'"
                data-vv-name="Confirm New Password"
                :error-messages="errors.collect('Confirm New Password')")
              v-card-actions.mt-2
                v-spacer
                v-btn(color="green" @click="updateProfile" :loading="isProfileUpdating").white--text
                  | Update Profile
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
import EmailVerification from './EmailVerification.vue';
import { EventBus } from '../../event-bus';

export default {
  $_veeValidate: {
    validator: 'new',
  },
  components: {
    navbar,
    EmailVerification,
  },
  data() {
    return {
      user: {},
      isProfileUpdating: false,
      isEmailVerified: false,
    };
  },
  mounted() {
    if (!this.$cookie.get('sessionToken')) {
      this.$router.push({ name: 'login' });
    } else {
      this.getCurrentUser();
    }
  },
  methods: {
    updateProfile() {
      this.isProfileUpdating = true;
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          const query = `mutation updateUser($name: String!, $currentPassword: String!,   $newPassword: String) {
             updateUser (name: $name, currentPassword: $currentPassword, newPassword: $newPassword) {
            name,
            email,
            dateOfBirth
              }
            }`;
          const variables = {
            name: this.user.name,
            currentPassword: this.user.currentPassword,
            newPassword: this.user.newPassword,
          };
          const client = new GraphQLClient('/graphql', {
            headers: {
              Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
            },
          });

          client.request(query, variables)
            .then((data) => {
              this.user = data.updateUser;
              this.isProfileUpdating = false;
              EventBus.$emit('success', 'Profile updated! Refreshing....');
            })
            .catch(() => { this.$router.push({ name: 'login' }); this.isProfileUpdating = false; }).finally(() => {
              this.getCurrentUser();
            });
        } else {
          this.isProfileUpdating = false;
        }
      });
    },
    getCurrentUser() {
      const query = `{currentUser {
            name,
            email,
            dateOfBirth,
            isEmailVerified
          }}`;
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });

      client.request(query)
        .then((data) => {
          this.user = data.currentUser;
          if (this.user.isEmailVerified === false) {
            this.isEmailVerified = true;
          }
        })
        .catch(() => this.$router.push({ name: 'login' }));
    },
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

.alert-dailog {
  position: relative;
  top: 4.5rem;
}
</style>
