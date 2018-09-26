<template lang="pug">
  div
    v-alert.alert-dialog(:value='!isEmailVerified' type='warning')
      span Your Email is not verified! If you do not recieve any mail,
      v-btn(flat small @click='resendVerificationEmail') &nbsp; Please click here to resend it.
    .settings-page
      v-container(grid-list-lg)
        v-layout(row wrap)
          v-flex(xs12 md6)
            v-card.settings-card
              v-card-title(primary-title).pl-0
                h2.headline.font-weight-bold EDIT PROFILE
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
            v-card.settings-card
              v-card-title(primary-title).pl-0
                h2.headline.font-weight-bold SOCIAL ACCOUNTS
              .settings-flex
                img(src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Facebook.svg/1024px-Facebook.svg.png" height="36" width="100").ml-1
                v-btn(flat) LINK ACCOUNT
              v-divider
              .settings-flex
                img(src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1000px-Google_2015_logo.svg.png" height="30" width="90").ml-2
                v-btn(flat) LINK ACCOUNT

</template>

<script>
import { GraphQLClient } from 'graphql-request';

import { setTimeout } from 'timers';
import { sendVerificationEmail } from '../../queries/mutationQueries';
import { EventBus } from '../../event-bus';

export default {
  $_veeValidate: {
    validator: 'new',
  },

  data() {
    return {
      user: {},
      isProfileUpdating: false,
      isEmailVerified: true,
      isEmailVerifying: false,
    };
  },
  mounted() {
    this.isWatchList = true;
    if (!this.$cookie.get('sessionToken')) {
      this.$router.push({ name: 'login' });
    } else {
      this.getCurrentUser();
    }

    EventBus.$on('email-verification-successful', () => {
      this.isEmailVerified = true;
    });
  },
  methods: {
    openEmailVerificationDialog() {
      EventBus.$emit('open-email-verification-dialog');
    },
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
              EventBus.$emit('show-success-notification-long', 'Profile updated! Refreshing....');
            })
            .catch((err) => {
              EventBus.$emit('show-error-notification-long', err.response.errors[0].message);
              this.isProfileUpdating = false;
            }).finally(() => {
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
            this.isEmailVerified = false;
          }
        })
        .catch((err) => {
          EventBus.$emit('show-error-notification-long', err.response.errors[0].message);
          this.$cookie.delete('sessionToken');
          this.$router.push({ name: 'login' });
        });
    },
    resendVerificationEmail() {
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      client.request(sendVerificationEmail).then(() => {
        EventBus.$emit('show-success-notification-long', 'Sent Verification Email');
      }).catch((err) => {
        if (err) {
          EventBus.$emit('show-error-notification-long', err.response.errors[0].message);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.settings-page {
  .settings-card {
    padding: 2rem;
  }

  .settings-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
  }
}
</style>
