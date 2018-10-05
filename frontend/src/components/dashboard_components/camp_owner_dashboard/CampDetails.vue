<template lang="pug">
  v-container.camp-display(fluid)
    v-tabs.tabs-detail(height='60%' dark grow show-arrows)
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
              v-layout(row wrap)
                v-flex(xs9)
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
                    v-layout(row wrap)
                      v-flex(xs12 md5)
                        v-text-field(label='Location' v-model='location' readonly)
                      v-flex.flex-spacing(xs12 md6)
                        v-dialog(v-model='loc' height='500' width='500')
                          v-btn(dark slot="activator")
                            span My Location
                            v-icon.ml-2 location_searching
                          v-card#map(height='500' width='500')

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
            v-flex(xs12 md8)
              v-card.body-card(flat)
                v-card-title.title(primary-title)
                  h2.font-weight-bold.headline Camp Documents
                v-layout(row wrap)
                  v-flex(xs12 md4)
                    v-form(ref='form' enctype='multipart/form-data' lazy-validation )
                        v-layout.layout(row wrap)
                          v-flex.mt-3(xs12)
                            v-layout(column)
                              span PAN DETAILS
                              input.mt-2(type='file' name='pan_card' ref='panCard'
                              v-on:change="showFile" accept='application/pdf'
                              required :disabled='isDocument')
                          v-flex.mt-3(xs12)
                            v-layout(column)
                              span GST DETAILS
                              input.mt-2(type='file' name='gst_number'
                              v-on:change="showFile" accept='application/pdf' required :disabled='isDocument')
                          v-flex.mt-3(xs12)
                            v-layout(column)
                              span TIN NUMBER
                              input.mt-2(type='file' name='tin' v-on:change="showFile"
                              accept='application/pdf' required :disabled='isDocument' )
                          v-flex.mt-3(xs12)
                            v-layout(column)
                              span * Only pdf files
                          v-flex.mt-4(xs12)
                            v-btn.white--text(@click='uploadDocuments' color='green'
                            :loading='uploadingDocuments') Upload Documents
                  v-flex(xs12 md8)
                    v-layout(column)
                      v-card.body-card(v-for='(document, index) in camp.campDocuments' width='100%')
                        v-layout(row wrap)
                          v-flex(md8)
                            span {{document}}
                          v-flex.justify-center(md4)
                            span
                              a.document-link(:href="'https://s3.ap-south-1.amazonaws.com/campzy-documents/' + document" target='_blank') View Document
                            v-btn(small dark color='red' @click='deleteDocumentFromAws(document)') Delete


            v-flex(xs12 md4)
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
                    v-layout(row wrap)
                      v-flex(xs12 md6)
                        v-layout(column)
                          span.headline Amenities
                          v-layout(row wrap)
                            v-flex(xs6 md4)
                              v-checkbox(label='Washroom-Attached' color='success' v-model='amenities.washRoomAttached')
                            v-flex(xs6 md4)
                              v-checkbox(label='Bonfire' color='success' v-model='amenities.bonfire')
                            v-flex(xs6 md4)
                              v-checkbox(label='24 Hour Hot Water' color='success' v-model='amenities.hotWater')
                            v-flex(xs6 md4)
                              v-checkbox(label='Mobile Connectivity' color='success' v-model='amenities.mobileConnectivity')
                            v-flex(xs6 md4)
                              v-checkbox(label='Meals Included' color='success' v-model='amenities.mealsInclude')
                            v-flex(xs6 md4)
                              v-checkbox(label='Pets Allowed' color='success' v-model='amenities.petsAllowed')
                            v-flex(xs6 md4)
                              v-checkbox(label='Charging Points' color='success' v-model='amenities.chargingPoints')

                      v-spacer
                      v-flex(xs12 md6)
                        v-layout(column)
                          v-flex(xs12 md6)
                            //- v-combobox(v-model='placesOfInterest' attach chips
                            //-  label='Places of Interest' multiple clearable)
                          v-flex.mt-4(xs12 md6)
                            v-combobox(v-model='tags' attach chips
                              label='Tags' multiple clearable)
                    v-flex.flex-spacing(xs12)
                      v-text-field(label='Short Description about Camp'
                      v-model='camp.shortDescription')
                    v-flex.flex-spacing(xs12)
                      v-textarea(outline label='Camp Description' v-model='camp.longDescription')
        v-tab-item(id='images')
          v-flex(xs12)
            v-layout(row wrap)
              v-flex(xs12 md3 v-for='(image, index) in camp.images'
                  :key='index')
                v-hover
                  v-card.body-card(slot-scope='{ hover }' max-width='500' style='padding:0')
                    v-img(:src="'https://s3.ap-south-1.amazonaws.com/campzy-images/high-res/' + image"
                    :lazy-src="'https://s3.ap-south-1.amazonaws.com/campzy-images/thumbnails/' + image"
                    :aspect-ratio='16/9' )
                      v-expand-transition
                        div.d-flex.transition-fast-in-fast-out.red.darken-2.v-card--reveal.display-3.white--text(v-if='hover' style="height: 100%;" )
                          v-btn(flat dark icon small)
                            v-icon(color='white' @click='deleteImageFromAWS(image)') delete
                    v-card-actions.justify-center
                      span {{image}}


    v-fab-transition
      v-tooltip(top)
        v-btn(color='green' slot='activator' fab dark bottom right fixed @click='saveCampDetails'
        :loading='isDataUpdating' style='bottom:5.5rem')
          v-icon save
        span Save Details
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import { GraphQLClient } from 'graphql-request';
import axios from 'axios';
import { getCurrentUserCampDetails } from '../../../queries/queries';
import {
  saveCampDetails, updateCampImages, deleteCampImage, updateCampDocuments, deleteCampDocument, addAmenities, addPlacesOfInterest,
} from '../../../queries/mutationQueries';
import { EventBus } from '../../../event-bus';


export default {
  components: {
    InfiniteLoading,
  },
  metaInfo: {
    title: 'Dashboard | Camp Details',
    script: [
      {
        innerHTML: `function getCurrentLocation() {
      var map; 
      var infoWindow;
       map = new google.maps.Map(document.getElementById('map'),{
         zoom: 20
       });
       marker = new google.maps.Marker({
         draggable: true
       });
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          marker.setPosition(pos);
          map.setCenter(pos);
          marker.setMap(map);
        }, () => {
          handleLocationError(true, marker, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, marker, map.getCenter());
      }
    };
    function handleLocationError(browserHasGeolocation, marker, pos) {
      marker.setPosition(pos);
      marker.setContent(browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : 'Error: Your browser does not support geolocation.');
    };`,
        type: 'text/javascript',
        body: true,
      },
      { src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDUX5To9kCG343O7JosaLR3YwTjA3_jX6g&callback=getCurrentLocation', body: true },
    ],
  },

  data() {
    return {
      el: 0,
      camp: {},
      isDataUpdating: false,
      amenitiesItems: [
        { name: 'Washroom-Attached', value: true },
        { name: 'Bonfire', value: true },
        { name: '24 hour hot water', value: true },
        { name: 'Mobile connectivity', value: true },
        { name: 'Meals included', value: true },
        { name: 'Pets allowed', value: true },
        { name: 'Charging points', value: true },
      ],
      amenities: {},
      placesOfInterest: {},
      tags: [],
      panNumber: null,
      tinNumber: null,
      gstNumber: null,
      files: [],
      storeDocuments: [],
      storeImages: [],
      uploadingDocuments: false,
      getOwnerDocuments: [],
      getImages: '',
      uploadingImages: false,
      viewDocument: false,
      isDocument: false,
      location: '',
      loc: false,
      campLocation: '',
      coordinates: {},


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
    deleteDocumentFromAws(documentName) {
      axios.delete('/deleteDocuments', {
        data: { documentName },
      }).then((res) => {
        this.deleteDocumentFromCamp(res.data);
      }).catch((err) => {
        EventBus.$emit('show-error-notification-long', err.response.errors[0].message);
      });
    },
    deleteDocumentFromCamp(docName) {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const variables = {
        id: this.camp.id,
        documentName: docName,
      };
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      client.request(deleteCampDocument, variables).then(() => {
        this.getCampDetails();
        EventBus.$emit('show-success-notification-short', 'Successfully Deleted ');
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      }).finally(() => { });
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
        this.getImages = res.data;
        EventBus.$emit('show-success-notification-long', 'Successfully Uploaded to AWS');
        this.updateImagesToCamp();
      }).catch(() => {
        EventBus.$emit('show-error-notification-long', 'Failed to Uploaded');
      }).finally(() => { this.uploadingImages = false; });
    },

    updateImagesToCamp() {
      this.getImages.forEach((image) => {
        if (!this.$cookie.get('sessionToken')) {
          this.$router.push('/');
        }
        const variables = {
          id: this.camp.id,
          images: image,
        };
        const client = new GraphQLClient('/graphql', {
          headers: {
            Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
          },
        });
        client.request(updateCampImages, variables).then(() => {
          this.getCampDetails();
          EventBus.$emit('show-success-notification-short', 'Successfully Updated ');
        }).catch((err) => {
          EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
        }).finally(() => { });
      });
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
          this.saveDocumentsToCamp();
        }).catch(() => {
          EventBus.$emit('show-error-notification-long', 'Failed to Uploaded');
        }).finally(() => { this.uploadingDocuments = false; });
      }
    },

    saveDocumentsToCamp() {
      this.getOwnerDocuments.forEach((campdoc) => {
        if (!this.$cookie.get('sessionToken')) {
          this.$router.push('/');
        }
        const variables = {
          id: this.camp.id,
          campDocuments: campdoc,
        };
        const client = new GraphQLClient('/graphql', {
          headers: {
            Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
          },
        });
        client.request(updateCampDocuments, variables).then(() => {
          this.getCampDetails();
          EventBus.$emit('show-success-notification-short', 'Successfully Updated ');
        }).catch((err) => {
          EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
        }).finally(() => { });
      });
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
        if (this.camp.campDocuments.length === 3) {
          this.isDocument = true;
        } else {
          this.isDocument = false;
        }
        if (this.camp.campDocuments.length === 0 || this.camp.campDocuments.length > 3) {
          this.viewDocument = false;
        } else {
          this.viewDocument = true;
        }
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
        shortDescription: this.camp.shortDescription,
        longDescription: this.camp.longDescription,
        tags: this.tags,
        campDocuments: this.getOwnerDocuments,
      };
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      this.isDataUpdating = true;
      this.saveAmenity();
      this.savePlacesOfInterests();
      client.request(saveCampDetails, variables).then(() => {
        EventBus.$emit('show-success-notification-short', 'Successfully Updated ');
        this.getCampDetails();
      }).catch(() => {
        EventBus.$emit('show-error-notification-short', 'Failed to update');
      }).finally(() => { this.isDataUpdating = false; });
    },

    saveAmenity() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const variables = {
        id: this.camp.id,
        washRoomAttached: this.amenities.washRoomAttached,
        bonfire: this.amenities.bonfire,
        hotWater: this.amenities.hotWater,
        mobileConnectivity: this.amenities.mobileConnectivity,
        mealsInclude: this.amenities.mealsInclude,
        petsAllowed: this.amenities.petsAllowed,
        chargingPoints: this.amenities.chargingPoints,

      };
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      client.request(addAmenities, variables).then(() => {
      }).catch(() => {
        EventBus.$emit('show-info-notification-short', 'Failed to Update Amenities');
      });
    },
    savePlacesOfInterests() {
      this.placesOfInterest.forEach((place) => {
        if (!this.$cookie.get('sessionToken')) {
          this.$router.push('/');
        }
        const variables = {
          id: this.camp.id,
          name: place.name,
          distance: place.distance,

        };
        const client = new GraphQLClient('/graphql', {
          headers: {
            Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
          },
        });
        client.request(addPlacesOfInterest, variables).then(() => {
        }).catch((err) => {
          console.log(err);
          EventBus.$emit('show-info-notification-short', 'Failed to update Places of Interests');
        });
      });
    },

    deleteImageFromAWS(imageName) {
      axios.delete('/deleteImages', { data: { imageName } }).then((res) => {
        EventBus.$emit('show-success-notification-short', 'Successfully Deleted');
        this.deleteImage(res.data);
      }).catch(() => {
        EventBus.$emit('show-error-notification-short', 'Failed to delete');
      });
    },


    deleteImage(imgName) {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/');
      }
      const variables = {
        id: this.camp.id,
        imageName: imgName,
      };
      const client = new GraphQLClient('/graphql', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`,
        },
      });
      client.request(deleteCampImage, variables).then(() => {
        this.getCampDetails();
        EventBus.$emit('show-success-notification-short', 'Successfully Deleted ');
      }).catch((err) => {
        EventBus.$emit('show-error-notification-short', err.response.errors[0].message);
      }).finally(() => { });
    },

    // getLocation() {
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition((position) => {
    //       const latlon = `${position.coords.latitude},${position.coords.longitude}`;
    //       this.campLocation = `https://www.google.com/maps/embed/v1/place?q=${latlon}&key=AIzaSyDUX5To9kCG343O7JosaLR3YwTjA3_jX6g&center=${latlon}&zoom=16`;
    //       this.coordinates = {
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //       };
    //       this.location = latlon;
    //     }, msg => new Error(`Please enable your GPS position future.${msg}`), { maximumAge: 600000, timeout: 5000, enableHighAccuracy: true });
    //   } else {
    //     return new Error('Geolocation is not supported by this browser.');
    //   }
    //   return true;
    // },

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
  margin: 0.6rem;
  padding: 2rem;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
}
.footer-card {
  margin: 2rem 2rem 0rem 2rem;
  box-shadow: none;
}
.layout {
  margin-top: 0.5rem;
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
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.9;
  position: absolute;
  width: 100%;
}
.document-link {
  color: black;
  font-size: 1rem;
}

.iframe-container {
  overflow: hidden;
  padding-top: 56.25%;
  position: relative;

  iframe {
    border: 0;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
}
</style>
