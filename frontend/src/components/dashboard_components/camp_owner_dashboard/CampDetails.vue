<template lang="pug">
  v-container.camp-display(fluid)
    v-tabs.tabs-detail(height='60%' dark grow)
      v-tabs-slider(color='green')
      v-tab(href='#basic') Basic Details
      v-tab(href='#bankdetails') Bank Details
      v-tab(href='#documents') Documents
      v-tab(href='#campdetail') Camp Details
      v-tab(href='#images') Camp Images
      v-tabs-items
        v-tab-item(id='basic')
          v-flex(xs12 md6 style='max-width:100%')
            v-card.body-card(flat)
              v-card-title.title(primary-title)
                h2.font-weight-bold.healine BASIC DETAILS
              v-form(ref='form' lazy-validation)
                  v-layout.layout(row wrap)
                    v-flex(xs12)
                      v-text-field( label='Camp Name' v-model='camp.name' readonly)
                    v-flex.flex-spacing(xs12)
                      v-text-field(label='Email' v-model='camp.email' readonly)
                    v-flex.flex-spacing(xs12)
                      v-text-field(label='Phone Number' v-model='camp.phoneNumber' readonly)
                    v-flex.flex-spacing(xs12)
                      v-text-field(label='Camp Url' v-model='camp.url' readonly)
        v-tab-item(id='bankdetails')
          v-flex(xs12 md6 style='max-width:100%')
            v-card.body-card(flat)
              v-card-title.title(primary-title)
                h2.font-weight-bold.headline BANK DETAILS
              v-form(ref='form' lazy-validation)
                  v-layout.layout(row wrap)
                    v-flex(xs12)
                      v-text-field(label='Bank Name' )
                    v-flex.flex-spacing(xs12)
                      v-text-field(label='Branch' )
                    v-flex.flex-spacing(xs12)
                      v-text-field(label='Account Number')
                    v-flex.flex-spacing(xs12)
                      v-text-field(label='IFSC Code')
        v-tab-item(id='documents')
          v-layout(row wrap)
            v-flex(xs12 md6)
              v-card.body-card(flat)
                v-card-title.title(primary-title)
                  h2.font-weight-bold.headline Camp Documents
                v-form(ref='form' enctype='multipart/form-data' lazy-validation)
                    v-layout.layout(row wrap)
                      v-flex.mt-3(xs12)
                        v-layout(column)
                          span PAN DETAILS
                          input.mt-2(type='file' name='pan_card' ref='panCard'
                          v-on:change="showFile" accept='application/pdf'
                           required)
                      v-flex.mt-3(xs12)
                        v-layout(column)
                          span GST DETAILS
                          input.mt-2(type='file' name='gst_number'
                          v-on:change="showFile" accept='application/pdf' required)
                      v-flex.mt-3(xs12)
                        v-layout(column)
                          span TIN NUMBER
                          input.mt-2(type='file' name='tin' v-on:change="showFile"
                           accept='application/pdf' required )
                      v-flex.mt-3(xs12)
                        v-layout(column)
                          span * Only pdf files
                      v-flex.mt-4(xs12)
                        v-btn.white--text(@click='uploadDocuments' color='green'
                        :loading='uploadingDocuments') Upload Documents

            v-flex(xs12 md6)
              v-card.body-card(flat)
                v-card-title.title(primary-title)
                  h2.font-weight-bold.headline Upload Camp Photos
                v-form(ref='form' enctype='multipart/form-data' lazy-validation)
                    v-layout.layout(row wrap)
                      v-flex.mt-3(xs12)
                        v-layout(column)
                          span Main Image for Camp
                          input.mt-2(type='file' name='hero_image' ref='panCard'
                          v-on:change="storeImage"  accept='image/png, image/jpeg' disabled )
                      v-flex.mt-3(xs12)
                        v-layout(column)
                          span Other camp photos
                          input.mt-2(type='file' name='other_photos'
                          @change='storeImage' accept='image/png, image/jpeg'  multiple)
                      v-flex.mt-3(xs12)
                        v-layout(column)
                          span * Only png/jpeg files
                      v-flex.mt-4(xs12)
                        v-btn.white--text( @click='uploadImages' color='green'
                        :loading='uploadingImages') Upload Images

        v-tab-item(id='campdetail')
          v-flex(xs12 md6 style='max-width:100%')
            v-card.body-card(flat)
              v-card-title.title(primary-title)
                h2.font-weight-bold.headline CAMP DETAILS
              v-form(ref='form' lazy-validation)
                  v-layout.layout(row wrap)
                    v-layout(row)
                      v-flex(xs5)
                        v-select(:items="amenitiesItems" v-model="amenities"
                        multiple chips label="Amenities"  clearable)
                      v-spacer
                      v-flex(xs6)
                        v-combobox(v-model='placesOfInterest' attach chips
                        label='Places of Interest' multiple clearable)
                    v-flex(xs12)
                        v-combobox(v-model='tags' attach chips
                        label='Tags' multiple clearable)
                    v-flex.flex-spacing(xs12)
                      v-text-field(label='Short Description about Camp'
                      v-model='camp.shortDescription')
                    v-flex.flex-spacing(xs12)
                      v-textarea(outline label='Camp Description' v-model='camp.longDescription')
        v-tab-item(id='images')
          //- v-flex(xs12 md6 style='max-width:100%')
          //-   v-card.body-card(flat)
          //-     v-carousel
          //-       v-carousel-item(v-for="(image,i) in camp.images" :key="i"
          //-       :src=`'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/1536254024601__'+image`)


    v-container.camp-display(fluid)
        v-card.footer-card(width='95%' color='transparent')
          v-card-actions
            v-spacer
            v-btn(flat) Cancel
            v-btn.white--text(color='green' @click='saveCampDetails' :loading='isDataUpdating') Save
</template>

<script>
import { GraphQLClient } from 'graphql-request';
import axios from 'axios';
import { getCurrentUserCampDetails } from '../../../queries/queries';
import { saveCampDetails } from '../../../queries/mutationQueries';
import { EventBus } from '../../../event-bus';

export default {
  data() {
    return {
      el: 0,
      camp: {},
      isDataUpdating: false,
      amenitiesItems: ['Pool Table', 'Ping Pong', 'Carpet Ball', 'TV/Movies', 'Hockey Table', 'Shuffleboard', 'Fishing', 'Swimming', 'Zip Line'],
      amenities: [],
      placesOfInterest: [],
      tags: [],
      panNumber: null,
      tinNumber: null,
      gstNumber: null,
      files: [],
      storeDocuments: [],
      storeImages: [],
      uploadingDocuments: false,
      getOwnerDocuments: [],
      getImages: [],
      uploadingImages: false,
    };
  },

  mounted() {
    this.getCampDetails();
  },

  methods: {
    showFile(event) {
      this.storeDocuments.push(event.target.files[0]);
    },

    storeImage(event) {
      this.storeImages = event.target.files;
    },
    deleteFile() {
      axios.delete('/deleteDocuments', {
        data: { document: 'document1536082579486' },
      }).then((res) => {
        console.log(res);
      }).catch((err) => {
        EventBus.$emit('show-error-notification-long', err.response.errors[0].message);
      });
    },

    uploadImages() {
      this.uploadingImages = true;
      const updateImages = this.storeImages;
      for (let i = 0; i < updateImages.length; i += 1) {
        this.files.push(updateImages[i]);
      }
      const formData = new FormData();
      for (let i = 0; i < this.files.length; i += 1) {
        const file = this.files[i];
        formData.append('images', file);
      }
      axios.post('/uploadImages', formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then((res) => {
        res.data.forEach((item) => {
          this.getImages.push(item.originalname);
        });
        EventBus.$emit('show-success-notification-long', 'Successfully Uploaded');
        // this.saveCampDetails();
      }).catch(() => {
        EventBus.$emit('show-error-notification-long', 'Failed to Uploaded');
      }).finally(() => { this.uploadingImages = false; });
    },


    // Uploads CampOwner Documents
    uploadDocuments() {
      if (this.storeDocuments.length < 0) {
        EventBus.$emit('show-error-notification-short', 'Please select all files!');
      } else {
        this.uploadingDocuments = true;
        const updateFile = this.storeDocuments;
        for (let i = 0; i < updateFile.length; i += 1) {
          this.files.push(updateFile[i]);
        }
        const formData = new FormData();
        for (let i = 0; i < this.files.length; i += 1) {
          const file = this.files[i];
          formData.append('document', file);
        }
        axios.post('/uploadCampOwnerDocuments', formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }).then((res) => {
          res.data.forEach((item) => {
            this.getOwnerDocuments.push(item.key);
          });
          EventBus.$emit('show-success-notification-long', 'Successfully Uploaded');
          this.saveCampDetails();
        }).catch(() => {
          EventBus.$emit('show-error-notification-long', 'Failed to Uploaded');
        }).finally(() => { this.uploadingDocuments = false; });
      }
    },

    // Get the camp ID related to current user
    getCampDetails() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      client.request(getCurrentUserCampDetails).then((data) => {
        this.camp = data.currentUserCamp;
        this.placesOfInterest = this.camp.placesOfInterest;
        this.tags = this.camp.tags;
        this.amenities = this.camp.amenities;
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      });
    },
    // Save updated vlaues of camp
    saveCampDetails() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const variables = {
        id: this.camp.id,
        name: this.camp.name,
        phoneNumber: this.camp.phoneNumber,
        url: this.camp.url,
        email: this.camp.email,
        ownerId: this.camp.ownerId,
        amenities: this.amenities,
        placesOfInterest: this.placesOfInterest,
        shortDescription: this.camp.shortDescription,
        longDescription: this.camp.longDescription,
        tags: this.tags,
        campDocuments: this.getOwnerDocuments,
        images: this.getImages,
      };
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      this.isDataUpdating = true;
      client.request(saveCampDetails, variables).then(() => {
        this.getCampDetails();
        EventBus.$emit('show-success-notification-short', 'Successfully Updated ');
      }).catch((err) => {
        console.log(err);
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      }).finally(() => { this.isDataUpdating = false; });
    },
  },
};
</script>

<style lang="scss" scoped>
.camp-display {
  margin: 0px 0px 0px 0px;
  padding: 0px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.tabs-detail {
  width: 100%;
}

.body-card {
  margin: 2rem 2rem 0rem 2rem;
  min-height: 76vh !important;
  padding: 2rem;
  box-shadow: none;
}
.footer-card {
  margin: 2rem 2rem 0rem 2rem;
  box-shadow: none;
}
.layout {
  margin-top: 1rem;
}

.item-align {
  align-items: center;
}

.title {
  padding: 0px;
}

.v-tabs__slider {
  height: 5px;
}
.flex-spacing {
  margin-top: 2rem;
}
</style>
