<template lang="pug">
  .camp-display
    v-tabs(height='60%' dark grow show-arrows)
      v-tabs-slider(color='green')
      v-tab(href='#basic') Basic Details
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
                    h2.font-weight-bold.headline BASIC DETAILS
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
                        v-text-field#camp__location(label='Location' v-model='location')
                      v-flex.flex-spacing(xs12 md6)
                        v-dialog(v-model='loc' height='700' width='900' persistent)
                          v-btn(dark slot="activator" @click='setMapCoordinates')
                            span My Location
                            v-icon.ml-2 location_searching
                          v-card(height='600' width='900')
                            v-container(fluid style='padding:0px;height:90%;')
                              v-card-title
                                h2 Search your Place
                                v-flex(xs12 md9)
                                  v-layout(row wrap style='margin:0;')
                                    v-flex(xs12 md8)
                                      label
                                        gmap-autocomplete(@place_changed='searchPlace' style='width:100%;margin: 1rem;border-style:double;' )
                                    v-flex.ml-3(xs12 md2)
                                      v-btn(flat icon @click='geolocate')
                                        v-icon my_location
                              gmap-map(:center='center' :zoom='15' style='width:100%;  height: 100%;')
                                gmap-marker(:position='markerPosition' @click='center=markerPosition')
                              v-card-actions(dark)
                                v-spacer
                                v-btn(dark @click='loc=!loc') Cancel
                                v-btn(dark @click='closeMapDialog' color='success') Ok


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
                              v-on:change="showFile"
                              required :disabled='isDocument')
                          v-flex.mt-3(xs12)
                            v-layout(column)
                              span GST DETAILS
                              input.mt-2(type='file' name='gst_number'
                              v-on:change="showFile" required :disabled='isDocument')
                          v-flex.mt-3(xs12)
                            v-layout(column)
                              span * Only pdf files
                          v-flex.mt-4(xs12)
                            v-btn.white--text(@click='uploadDocuments' color='green'
                            :loading='uploadingDocuments') Upload Documents
                  v-flex(xs12 md8)
                    v-layout(column)
                      v-card.body-card(v-for='(document, index) in camp.campDocuments' width='100%' :key="index")
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
                          span Upload camp photos
                          input.mt-2(type='file' name='other_photos'
                          @change='storeImage' accept='image/png, image/jpeg'  multiple)
                      v-flex.mt-3(xs12)
                        v-layout(column)
                          span * Only png/jpeg files
                      v-flex.mt-4(xs12)
                        v-btn.white--text( @click='uploadImages' color='green'
                        :loading='uploadingImages') Upload Images

        v-tab-item(id='campdetail')
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
                            v-combobox(v-model='placesOfInterest' attach chips
                             label='Places of Interest' multiple clearable hint='Write distance in km, separated with a comma')
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
                        div.d-flex.transition-fast-in-fast-out.black.darken-2.v-card--reveal.display-3.white--text(v-if="hover" style="height: 100%;" )
                          v-flex(xs12 style="text-align: center;")
                            v-tooltip(bottom)
                              template(v-slot:activator="{ on }")
                                v-btn(flat dark icon v-on="on" large)
                                  v-icon(color='red' @click='deleteImageFromAWS(image)') delete
                              span Delete Image
                            v-tooltip(bottom)
                              template(v-slot:activator="{ on }" large)
                                v-btn(flat dark icon v-on="on")
                                  v-icon(color='red' @click='setImageAsHero(image)') wallpaper
                              span Set as Hero Image
                    v-card-actions.justify-center
                      span {{image}}


    v-fab-transition
      v-tooltip(top)
        v-btn(color='green' slot='activator' fab dark bottom right fixed @click='savePlacesOfInterests'
        :loading='isDataUpdating' style='bottom:5.5rem')
          v-icon save
        span Save Details
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import { GraphQLClient } from 'graphql-request'
import axios from 'axios'
import { getCurrentUserCampDetails } from '../../queries/queries'
import {
  saveCampDetails,
  updateCampImages,
  deleteCampImage,
  updateCampDocuments,
  deleteCampDocument,
  addAmenities,
  addPlacesOfInterest,
  setHeroImage
} from '../../queries/mutationQueries'
import { EventBus } from '../../layouts/event-bus'

export default {
  components: {
    InfiniteLoading
  },
  metaInfo: {
    title: 'Dashboard | Camp Details'
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
        { name: 'Charging points', value: true }
      ],
      amenities: {},
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
      getImages: '',
      uploadingImages: false,
      viewDocument: false,
      isDocument: false,
      location: '',
      loc: false,
      center: {},
      markerPosition: {},
      coordinates: {}
    }
  },

  mounted() {
    this.getCampDetails()
  },

  methods: {
    setMapCoordinates() {
      if (this.coordinates) {
        this.center = {
          lat: parseFloat(this.coordinates.lat),
          lng: parseFloat(this.coordinates.lng)
        }
        this.markerPosition = {
          lat: this.center.lat,
          lng: this.center.lng
        }
        this.center = this.markerPosition
      } else {
        this.geolocate()
      }
    },
    searchPlace(place) {
      this.center = place
      if (this.center) {
        this.markerPosition = {
          lat: this.center.geometry.location.lat(),
          lng: this.center.geometry.location.lng()
        }
        this.center = this.markerPosition
        this.coordinates = {
          lat: this.center.lat.toString(),
          lng: this.center.lng.toString()
        }
      }
    },

    geolocate() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        if (this.center) {
          this.markerPosition = {
            lat: this.center.lat,
            lng: this.center.lng
          }
          this.center = this.markerPosition
        }

        this.coordinates = {
          lat: this.center.lat.toString(),
          lng: this.center.lng.toString()
        }

        this.addMarker()
      })
    },

    closeMapDialog() {
      this.location = `${this.coordinates.lat},${this.coordinates.lng}`
      this.loc = !this.loc
    },
    setImageAsHero(img) {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/')
      }
      const variables = {
        id: this.camp.id,
        heroImage: img
      }
      const client = new GraphQLClient('https://api.campzy.in', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      client
        .request(setHeroImage, variables)
        .then(() => {
          EventBus.$emit(
            'show-success-notification-short',
            'Successfully Added as Hero Image'
          )
        })
        .catch(() => {
          EventBus.$emit(
            'show-error-notification-short',
            'Cannot Add right now, Please try later!'
          )
        })
    },
    showFile(event) {
      this.storeDocuments.push(event.target.files[0])
    },

    storeImage(event) {
      this.storeImages = event.target.files
    },
    deleteDocumentFromAws(documentName) {
      axios
        .delete('/deleteDocuments', {
          data: { documentName }
        })
        .then(res => {
          this.deleteDocumentFromCamp(res.data)
        })
        .catch(err => {
          EventBus.$emit(
            'show-error-notification-long',
            err.response.errors[0].message
          )
        })
    },
    deleteDocumentFromCamp(docName) {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/')
      }
      const variables = {
        id: this.camp.id,
        documentName: docName
      }
      const client = new GraphQLClient('https://api.campzy.in', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      client
        .request(deleteCampDocument, variables)
        .then(() => {
          this.getCampDetails()
          EventBus.$emit(
            'show-success-notification-short',
            'Successfully Deleted '
          )
        })
        .catch(err => {
          EventBus.$emit(
            'show-error-notification-short',
            err.response.errors[0].message
          )
        })
        .finally(() => {})
    },

    uploadImages() {
      this.uploadingImages = true
      const updateImages = this.storeImages
      for (let i = 0; i < updateImages.length; i += 1) {
        this.files.push(updateImages[i])
      }
      const formData = new FormData()
      for (let i = 0; i < this.files.length; i += 1) {
        const file = this.files[i]
        formData.append('images', file)
      }
      axios
        .post('/uploadImages', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          this.getImages = res.data
          EventBus.$emit(
            'show-success-notification-long',
            'Successfully Uploaded to AWS'
          )
          this.storeImages = []
          this.updateImagesToCamp()
        })
        .catch(() => {
          EventBus.$emit('show-error-notification-long', 'Failed to Upload')
        })
        .finally(() => {
          this.uploadingImages = false
        })
    },

    updateImagesToCamp() {
      this.getImages.forEach(image => {
        if (!this.$cookie.get('sessionToken')) {
          this.$router.push('/')
        }
        const variables = {
          id: this.camp.id,
          images: image
        }
        const client = new GraphQLClient('https://api.campzy.in', {
          headers: {
            Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
          }
        })
        client
          .request(updateCampImages, variables)
          .then(() => {
            this.getCampDetails()
            EventBus.$emit(
              'show-success-notification-short',
              'Successfully Updated '
            )
          })
          .catch(err => {
            EventBus.$emit(
              'show-error-notification-short',
              err.response.errors[0].message
            )
          })
          .finally(() => {})
      })
    },

    // Uploads CampOwner Documents
    uploadDocuments() {
      if (this.storeDocuments.length < 0) {
        EventBus.$emit(
          'show-error-notification-short',
          'Please select all files!'
        )
      } else {
        this.uploadingDocuments = true
        const updateFile = this.storeDocuments
        for (let i = 0; i < updateFile.length; i += 1) {
          this.files.push(updateFile[i])
        }
        const formData = new FormData()
        for (let i = 0; i < this.files.length; i += 1) {
          const file = this.files[i]
          formData.append('document', file)
        }
        axios
          .post('/uploadCampOwnerDocuments', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(res => {
            res.data.forEach(item => {
              this.getOwnerDocuments.push(item.key)
            })
            EventBus.$emit(
              'show-success-notification-long',
              'Successfully Uploaded'
            )
            this.saveDocumentsToCamp()
          })
          .catch(() => {
            EventBus.$emit('show-error-notification-long', 'Failed to Uploaded')
          })
          .finally(() => {
            this.uploadingDocuments = false
          })
      }
    },

    saveDocumentsToCamp() {
      this.getOwnerDocuments.forEach(campdoc => {
        if (!this.$cookie.get('sessionToken')) {
          this.$router.push('/')
        }
        const variables = {
          id: this.camp.id,
          campDocuments: campdoc
        }
        const client = new GraphQLClient('https://api.campzy.in', {
          headers: {
            Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
          }
        })
        client
          .request(updateCampDocuments, variables)
          .then(() => {
            this.getCampDetails()
            EventBus.$emit(
              'show-success-notification-short',
              'Successfully Updated '
            )
          })
          .catch(err => {
            EventBus.$emit(
              'show-error-notification-short',
              err.response.errors[0].message
            )
          })
          .finally(() => {})
      })
    },

    // Get the camp ID related to current user
    getCampDetails() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/')
      }
      const client = new GraphQLClient('https://api.campzy.in', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      client
        .request(getCurrentUserCampDetails)
        .then(data => {
          if (data.currentUserCamp.agreementAccepted === false) {
            EventBus.$emit('agreement-not-accepted')
          }
          this.camp = data.currentUserCamp
          this.coordinates = this.camp.coordinates

          this.location = `${this.coordinates.lat},${this.coordinates.lng}`
          this.tags = this.camp.tags
          this.amenities = this.camp.amenities
          if (this.camp.campDocuments.length === 3) {
            this.isDocument = true
          } else {
            this.isDocument = false
          }
          if (
            this.camp.campDocuments.length === 0 ||
            this.camp.campDocuments.length > 3
          ) {
            this.viewDocument = false
          } else {
            this.viewDocument = true
          }
          // this.createPlacesOfInterest();
        })
        .catch(err => {
          EventBus.$emit(
            'show-error-notification-short',
            err.response.errors[0].message
          )
        })
    },
    // Save updated vlaues of camp
    saveCampDetails() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/')
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
        latitude: this.coordinates.lat,
        longitude: this.coordinates.lng
      }
      const client = new GraphQLClient('https://api.campzy.in', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      this.isDataUpdating = true
      this.saveAmenity()
      // this.savePlacesOfInterests();
      client
        .request(saveCampDetails, variables)
        .then(() => {
          EventBus.$emit(
            'show-success-notification-short',
            'Successfully Updated '
          )
          this.getCampDetails()
        })
        .catch(() => {
          EventBus.$emit('show-error-notification-short', 'Failed to update')
        })
        .finally(() => {
          this.isDataUpdating = false
        })
    },

    createPlacesOfInterest() {
      this.camp.placesOfInterest.forEach(places => {
        const tempPlace = Object.values(places).join()
        this.placesOfInterest.push(tempPlace)
      })
    },

    saveAmenity() {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/')
      }
      const variables = {
        id: this.camp.id,
        washRoomAttached: this.amenities.washRoomAttached,
        bonfire: this.amenities.bonfire,
        hotWater: this.amenities.hotWater,
        mobileConnectivity: this.amenities.mobileConnectivity,
        mealsInclude: this.amenities.mealsInclude,
        petsAllowed: this.amenities.petsAllowed,
        chargingPoints: this.amenities.chargingPoints
      }
      const client = new GraphQLClient('https://api.campzy.in', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      client
        .request(addAmenities, variables)
        .then(() => {})
        .catch(() => {
          EventBus.$emit(
            'show-info-notification-short',
            'Failed to Update Amenities'
          )
        })
    },
    savePlacesOfInterests() {
      this.placesOfInterest.forEach(places => {
        if (!this.$cookie.get('sessionToken')) {
          this.$router.push('/')
        }
        const temp = {}
        ;[temp.name, temp.distance] = places.split(',')

        const variables = {
          id: this.camp.id,
          name: temp.name,
          distance: temp.distance
        }
        const client = new GraphQLClient('https://api.campzy.in', {
          headers: {
            Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
          }
        })
        client
          .request(addPlacesOfInterest, variables)
          .then(() => {})
          .catch(err => {
            // eslint-disable-next-line no-console
            console.log(err)
            EventBus.$emit(
              'show-info-notification-short',
              'Failed to update Places of Interests'
            )
          })
      })
    },

    deleteImageFromAWS(imageName) {
      axios
        .delete('/deleteImages', { data: { imageName } })
        .then(res => {
          EventBus.$emit(
            'show-success-notification-short',
            'Successfully Deleted'
          )
          this.deleteImage(res.data)
        })
        .catch(() => {
          EventBus.$emit('show-error-notification-short', 'Failed to delete')
        })
    },

    deleteImage(imgName) {
      if (!this.$cookie.get('sessionToken')) {
        this.$router.push('/')
      }
      const variables = {
        id: this.camp.id,
        imageName: imgName
      }
      const client = new GraphQLClient('https://api.campzy.in', {
        headers: {
          Authorization: `Bearer ${this.$cookie.get('sessionToken')}`
        }
      })
      client
        .request(deleteCampImage, variables)
        .then(() => {
          this.getCampDetails()
          EventBus.$emit(
            'show-success-notification-short',
            'Successfully Deleted '
          )
        })
        .catch(err => {
          EventBus.$emit(
            'show-error-notification-short',
            err.response.errors[0].message
          )
        })
        .finally(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.camp-display {
  width: 100%;
  padding: 0rem;
  margin: 0px;
  height: 100% !important;
  @media screen and (max-width: 960px) {
    padding-bottom: 10rem;
  }
}

.tabs-detail {
  width: 100%;
  padding: 0px;
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
</style>
