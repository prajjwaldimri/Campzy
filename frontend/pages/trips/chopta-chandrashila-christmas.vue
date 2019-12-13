<template lang="pug">
  v-container.pa-0(fluid)
    HomeNav(:dark="true")
    v-container.img-container(fluid)
      div
        v-layout.lightbox.white--text.pt-5.mt-5(column fill-height)
          .d-flex.text-flex
            v-layout.camp-container(column)
              h1.camp-name Chopta-Chandrashila Trek
              h1.camp-name-para Campzy is bringing you a trip of Chopta-Chandrashila Trek (3 days and 3 nights) for Chritmas Eve, to enjoy the festival eve with with your friends, family members and love ones on beautiful hills of Chopta Uttarakhand.
              v-dialog(v-model="isBookTrip" persistent max-width="500px")
                v-btn.camp-name-btn(slot="activator" color="green" dark round large) Book Now!
                BookTripChristmas
            .d-flex.camp-container.align-self-center
              v-img.chritmas-img(src="/vectors/xmas2.svg")
      
    v-container(fluid)
      h1.display-2.headings About Trek
      p.paragraphs Chopta is one of the prettiest spot on the Ukhimath-Chamoli road that connects kedarnath and Badrinath via a more picturesque, somewhat shorter route. This sleepy place, 35 kms form Ukimath, is really just a bend in a very narrow, thick forrest mountain road. It’s the quaintest place you are likely to see en route, along with the famed bugyals (meadows) of the state peeking through towering tress, framed by snowy mountains in the distance. Chopta is the springboard for a 5km trek to Chandrashilla Peak and Tungnath - one of the Panch Kedar (Sacred Shiva Temples).
    v-container(fluid)
      h1.display-2.headings Your Travel Kit
      .travel-kit-grid.justify-center.my-5
        v-flex.brief-flex(xs12 md1).text-xs-center
          v-layout(column)
            v-img.brief-img(src="/vectors/bag.svg")
            span.text--darken-3.font-weight-regular.mt-3(style="font-size:25px") Rucksack
        v-flex.brief-flex(xs12 md1).text-xs-center
          v-img.brief-img(src="/vectors/jacket.svg")
          span.text--darken-3.font-weight-regular.mt-3(style="font-size:25px") Adequate amount of warm clothes
        v-flex.brief-flex(xs12 md1).text-xs-center
          v-img.brief-img(src="/vectors/sun-cream.svg")
          span.text--darken-3.font-weight-regular.mt-3(style="font-size:25px") Sunscreen lotion, cold cream
        v-flex.brief-flex(xs12 md1).text-xs-center
          v-img.brief-img(src="/vectors/sun-glasses.svg")
          span.text--darken-3.font-weight-regular.mt-3(style="font-size:25px") Sunglasses
        v-flex.brief-flex(xs12 md1).text-xs-center
          v-img.brief-img(src="/vectors/shoes.svg")
          span.text--darken-3.font-weight-regular.mt-3(style="font-size:25px") Shoes with good ground grip
        v-flex.brief-flex(xs12 md1).text-xs-center
          v-img.brief-img(src="/vectors/meds.svg")
          span.text--darken-3.font-weight-regular.mt-3(style="font-size:25px") Essential Meds
        v-flex.brief-flex(xs12 md1).text-xs-center
          v-img.brief-img(src="/vectors/camera.svg")
          span.text--darken-3.font-weight-regular.mt-3(style="font-size:25px") Camera and other gadgets
        v-flex.brief-flex(xs12 md1).text-xs-center
          v-img.brief-img(src="/vectors/wallet.svg")
          span.text--darken-3.font-weight-regular.mt-3(style="font-size:25px") Cash, ATMs etc
    v-container(fluid)
      h1.display-2.headings Breif Itinerary
      .itinerary-grid.my-5.justify-center
        .breif-card.ma-4
          .breif-card-inner
            .breif-img
              v-layout.breif-layout(column)
                  span.itinerary-text Day 0
                  v-img.mx-2(src="/vectors/bus.svg" style="width:90px;height:90px;")
            .d-flex
              ul
                li.breif-text Depart from Delhi for Chopta in AC bus/Tempo Traveller
        .breif-card.ma-4
          .breif-card-inner
            .breif-img
              v-layout.breif-layout(column)
                  span.itinerary-text Day 1
                  v-img.mx-2(src="/vectors/tent2.svg" style="width:80px;height:80px;")
            .d-flex
              ul
                li.breif-text Reach Chopta, Check in at campsite, Lunch & Relax
                li.breif-text Self Explore the surroundings, Dinner and sleep
        .breif-card.ma-4
          .breif-card-inner
            .breif-img
              v-layout.breif-layout(column)
                  span.itinerary-text Day 2
                  v-img.mx-2(src="/vectors/trek.svg" style="width:80px;height:80px;")
            .d-flex
              ul
                li.breif-text Early morning Breakfast, Depart for the starting point of Trek
                li.breif-text Trek to Tungnath and Chandershilla, Enjoy the 360 Degree view (If weather permits)
                li.breif-text Return to Chopta by evening
        .breif-card.ma-4
          .breif-card-inner
            .breif-img
              v-layout.breif-layout(column)
                  span.itinerary-text Day 3
                  v-img.mx-2(src="/vectors/photo.svg" style="width:80px;height:80px;")
            .d-flex
              ul
                li.breif-text Wake Early Morning, Breakfast and Campsite
                li.breif-text Departure for Delhi with wonderful trip memories

      // Breif Mobile View
      .itinerary-grid-mobile.my-5.justify-center 
        .breif-card-mobile.ma-4
          .breif-card-inner-mobile
            .breif-img
              v-layout.breif-layout(column)
                  span.itinerary-text Day 0
                  v-img.mx-2(src="/vectors/bus.svg" style="width:90px;height:90px;")
            .d-flex.mt-4
              ul
                li.breif-text Depart from Delhi for Chopta in AC bus/Tempo Traveller
        .breif-card-mobile.ma-4
          .breif-card-inner-mobile
            .breif-img
              v-layout.breif-layout(column)
                  span.itinerary-text Day 1
                  v-img.mx-2(src="/vectors/tent2.svg" style="width:80px;height:80px;")
            .d-flex.mt-4
              ul
                li.breif-text Reach Chopta, Check in at campsite, Lunch & Relax
                li.breif-text Self Explore the surroundings, Dinner and sleep
        .breif-card-mobile.ma-4
          .breif-card-inner-mobile
            .breif-img
              v-layout.breif-layout(column)
                  span.itinerary-text Day 2
                  v-img.mx-2(src="/vectors/trek.svg" style="width:80px;height:80px;")
            .d-flex.mt-4
              ul
                li.breif-text Early morning Breakfast, Depart for the starting point of Trek
                li.breif-text Trek to Tungnath and Chandershilla, Enjoy the 360 Degree view (If weather permits)
                li.breif-text Return to Chopta by evening
        .breif-card-mobile.ma-4
          .breif-card-inner-mobile
            .breif-img
              v-layout.breif-layout(column)
                  span.itinerary-text Day 3
                  v-img.mx-2(src="/vectors/photo.svg" style="width:80px;height:80px;")
            .d-flex.mt-4
              ul
                li.breif-text Wake Early Morning, Breakfast and Campsite
                li.breif-text Departure for Delhi with wonderful trip memories
              
          
    v-container(fluid)
      h1.display-2.headings Affordable Prices
      div.cost-grid
        .cost-div
          v-layout(column)
            .bed-img
              v-layout(row style="margin-top:6.1rem")
                v-img.single-bed-img.mx-3(src="/vectors/bed.svg")
                v-img.single-bed-img.mx-3(src="/vectors/bed.svg")
            .d-flex
              span.cost-text Double Sharing
            .d-flex
              span.cost-text Rs. 11500/- per person
        .cost-div
          .bed-img
            v-layout(row style="margin-top:6.1rem")
                v-img.single-bed-img.mx-2(src="/vectors/bed.svg")
                v-img.single-bed-img.mx-2(src="/vectors/bed.svg")
                v-img.single-bed-img.mx-2(src="/vectors/bed.svg")
          .d-flex
              span.cost-text Triple Sharing
          .d-flex
            span.cost-text Rs. 11000/- per person
        .cost-div
          .bed-img
            v-layout(row style="margin-top:6.1rem")
                v-img.single-bed-img.mx-1(src="/vectors/bed.svg")
                v-img.single-bed-img.mx-1(src="/vectors/bed.svg")
                v-img.single-bed-img.mx-1(src="/vectors/bed.svg")
                v-img.single-bed-img.mx-1(src="/vectors/bed.svg")
          .d-flex
              span.cost-text Quad Sharing
          .d-flex
            span.cost-text Rs. 9500/- per person
    v-container.mt-5(fluid)
      h1.display-2.headings Package Details
      v-layout.package-container.mt-5(row)
        v-container(fluid style="margin:0")
          h1.package-headings Things included in Packages
          ul.my-5
            li.paragraphs Entire travel as per the itinerary by tempo traveller.
            li.paragraphs 6 meals will be provided throughout the trip. 2 meals (Day 1) + 3 Meals (Day 2) + 1 Meal (Day 3)
            li.paragraphs Accommodation for 2 nights in Camps at Chopta.
            li.paragraphs Trek guide charges for the trek.
            li.paragraphs GST 5 %
        v-divider(vertical)
        v-container(fluid style="margin:0")
          h1.package-headings Things not included in Packages
          ul.my-5
            li.paragraphs Any other food and beverages other than the the provided meals.
            li.paragraphs Any permit and entry tickets to the view points.
            li.paragraphs Anything not mention in included column.
    
    v-container(fluid)
      v-layout.align-center(column)
        h2 Ready for Trip?
        v-dialog(v-model="isBookTrip" persistent max-width="500px")
          v-btn.book_btn(slot="activator" color="green" large  dark)  Book Your Package Now!
          BookTripChristmas
      
    v-container(fluid)
      h2.display-1.mx-5 Important Notes*
      ul
        li.notes-li.mx-5 All Bookings are strictly subject to availability and confirmation by payment of Non-refundable Advance.
        li.notes-li.mx-5 AC will be switched off on hill and during waiting time, Also during trip it will be driver's discretion for putting off AC if the road and travel doesn't support.
        li.notes-li.mx-5 Departure time is given and is fixed. You have to report by that time, its on you to update your status to trip coordinator, Anyone missing the bus will not be entertained for refund etc and it will not be Campzy’s responsibility. We will try to call twice before departure, any phone not getting connected will not be Campzy’s responsibility.
        li.notes-li.mx-5 No Boarding without full payment.
        li.notes-li.mx-5 We do not allow drinking during the travel mode in the bus. Anyone found drunk at the time of boarding will be refused entry and no amount will be refunded. Campzy also reserves right to discontinue your trip at any point on the grounds of misconduct.
        li.notes-li.mx-5 We entertain only those persons at the campsite for whom the booking has been made. No additional persons will be entertained under any circumstances.
        li.notes-li.mx-5 We do not have any insurances policy covering the expenses for accident, sickness, loss due to theft or any other reason, Guests are advised to seek such insurance arrangements on their own.
        li.notes-li.mx-5 We shall not be responsible for any delays and alterations in the programme or expenses incurred-directly due to natural hazards, accident, breakdown of machinery equipments, transport, weather condition, sickness, landslides , political closures or any untoward incidents.
        li.notes-li.mx-5 We reserve the rights for cancel of particular person’s trip for not following the instructions of our guide during any activity. We reserve the rights of cancellation of the trip for any misconduct towards the staff.
        li.notes-li.mx-5 No refund for the booking amount shall be made on the cancellation of the trip by the customer. Reservation shall be confirmed on the payments of the advance amount by the customer.
        
    v-tooltip(top)
      template(v-slot:activator="{on}")
        v-btn.whatsapp-btn(href="https://wa.me/+919560653378?text=Hi%20Campzy!" fab v-on="on")
          v-img(src="/vectors/whatsapp.svg")
      span Contact us on Whatsapp
    Footer
    
  
        

</template>

<script>
import { EventBus } from '../../layouts/event-bus'
import HomeNav from '../../components/HomePageNav.vue'
import Footer from '../../components/Footer.vue'
import BookTripChristmas from '../../components/BookTripChristmas.vue'
export default {
  name: 'Trips',
  metaInfo: {
    title: 'Chopta-Chandrashila Trips',
    meta: [
      {
        name: 'description',
        content: 'Chopta-Chandrashila Trips Provided by campzy'
      },
      {
        name: 'keywords',
        content:
          'chopta, chandrashila, uttarakhand trips,Chopta Chandrashila Trips, chopta trips,camping, tungnath, campzy trips, campzy in chopta'
      }
    ]
  },
  components: {
    HomeNav,
    Footer,
    BookTripChristmas
  },
  data() {
    return {
      isBookTrip: false,
      dates: ['23 Dec, 2019']
    }
  },
  mounted() {
    EventBus.$on('close-book-trip-dialog', () => {
      this.isBookTrip = false
    })
  }
}
</script>

<style lang="scss" scoped>
.text-flex {
  flex-direction: row;

  align-items: center;
  height: 55%;
  justify-content: center;
  @media screen and (max-width: 960px) {
    flex-wrap: wrap;
  }
  & > * {
    flex-grow: 0 !important;
    // margin-top: auto;
  }
}
.img-container {
  height: 95vh;
  background: black;
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9),
    rgba(0, 0, 0, 0.9)
  );
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
}
.chritmas-img {
  width: 1000px;
  margin-top: 1rem;
  @media screen and (max-width: 360px) {
    width: 350px;
    margin-top: 1.8rem;
  }
  @media screen and (min-width: 361px) and (max-width: 960px) {
    width: 400px;
    margin-top: 0rem;
  }
  @media screen and (min-width: 961px) and (max-width: 1200px) {
    width: 650px;
    margin-top: 13.5rem;
  }
  @media screen and (min-width: 1201px) and (max-width: 1299px) {
    width: 750px;
    margin-top: 8.1rem;
  }
  @media screen and (min-width: 1300px) and (max-width: 1440px) {
    width: 800px;
    margin-top: 5.5rem;
  }
  @media screen and (min-width: 1441px) and (max-width: 1800px) {
    width: 889px;
  }
}
.camp-container {
  margin-left: 3rem;
  @media screen and (max-width: 960px) {
    margin-left: 0;
  }
}
.package-container {
  @media screen and (max-width: 960px) {
    flex-wrap: wrap !important;
  }
}
.package-headings {
  margin-left: 3rem;
  @media screen and (max-width: 960px) {
    margin-left: 0rem;
  }
}
.cost-cont {
  background: white;
  width: 80vw;
  margin: 0 auto;
  border: 0.1px solid rgba(128, 128, 128, 0.2);
  box-shadow: 0 4px 8px 0 rgba(128, 128, 128, 0.4),
    0 6px 20px 0 rgba(128, 128, 128, 0.4);
}
.camp-name {
  font-family: 'Permanent Marker', cursive !important;
  text-shadow: 0px 0px 20px black;
  text-align: left;
  font-size: 50px;
  @media screen and (max-width: 360px) {
    font-size: 25px;
    text-align: center;
  }
  @media screen and (min-width: 361px) and (max-width: 960px) {
    font-size: 35px;
    text-align: center;
  }
  @media screen and (min-width: 961px) and (max-width: 1299px) {
    font-size: 30px;
    text-align: left;
  }
  @media screen and (min-width: 1300px) and (max-width: 1440px) {
    font-size: 34px;
    text-align: left;
  }
  @media screen and (min-width: 1441px) and (max-width: 1800px) {
    font-size: 36px;
    text-align: left;
  }
}
.camp-name-para {
  text-shadow: 0px 0px 20px black;
  font-size: 25px;
  text-align: justify;
  font-weight: 200;
  @media screen and (max-width: 360px) {
    font-size: 13px;
    text-align: center;
  }
  @media screen and (min-width: 361px) and (max-width: 960px) {
    font-size: 15px;
    text-align: center;
  }
  @media screen and (min-width: 961px) and (max-width: 1299px) {
    font-size: 18px;
    text-align: left;
  }
  @media screen and (min-width: 1300px) and (max-width: 1440px) {
    font-size: 20px;
    text-align: justify;
  }
  @media screen and (min-width: 1441px) and (max-width: 1800px) {
    font-size: 22px;
    text-align: justify;
  }
}
.camp-name-btn {
  width: 200px;
  margin-top: 2rem;
  @media screen and (max-width: 960px) {
    width: 100%;
    margin: 2rem auto;
  }
}
.headings {
  font-weight: 600;
  display: inline-block;
  position: relative;
  padding: 20px 0;
  margin: 0 3rem;
  @media screen and (max-width: 960px) {
    margin: 0 0.5rem;
  }
}
.headings::after {
  content: '';
  width: 50%;
  height: 6px;
  left: 0;
  bottom: 0;
  position: absolute;
  z-index: 9;
  background: linear-gradient(to right, green 100%, white 0%);
}
.paragraphs {
  margin: 1.5rem 3rem;
  font-size: 20px;
  font-weight: 600;
  text-align: left;
  line-height: 2.9rem;
  color: gray;
  @media screen and (max-width: 960px) {
    font-size: 18px;
    line-height: 2.4rem;
    margin: 1.5rem 0.5rem;
    text-align: justify;
    font-weight: 400;
  }
}

.travel-kit-grid {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(4, 20%);
  grid-gap: 1rem;
  @media screen and (max-width: 959px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}
.itinerary-grid {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(4, 20%);
  grid-gap: 1rem;
  @media screen and (max-width: 959px) {
    display: none;
  }
  @media screen and (min-width: 960px) and (max-width: 1249px) {
    grid-template-columns: repeat(2, 40%);
  }
  @media screen and (min-width: 1250px) and (max-width: 1600px) {
    grid-template-columns: repeat(4, 25%);
  }
}
.itinerary-grid-mobile {
  display: grid;
  justify-content: center;
  grid-template-rows: repeat(4, 25%);
  grid-gap: 1rem;
  @media screen and (min-width: 960px) {
    display: none;
  }
}
.itinerary-text {
  margin: 1.5rem 1rem;
  font-size: 28px;
  font-weight: 600;
  text-align: left;
  line-height: 1.9rem;
  @media screen and (max-width: 960px) {
    font-size: 24px;
    line-height: 2.4rem;
    margin: 1.5rem 0.5rem;
    text-align: justify;
  }
}

.cost-text {
  font-size: 25px;
  font-weight: 600;
  text-align: center;
  color: gray;
  margin: 0.8rem 0;
}
.brief-flex {
  margin: 5rem;
  max-width: 100% !important;
  animation: fadeInFadeOut 2s;
  @media screen and (max-width: 960px) {
    margin: 2rem 5rem;
  }
  @media screen and (max-width: 1440px) and (min-width: 961px) {
    margin: 2rem;
  }
}
.brief-img {
  height: 120px;
  width: 120px;
  margin: auto;
  animation: fadeInFadeOut 2s;
  @media screen and (max-width: 1440px) {
    height: 110px;
    width: 110px;
    margin: auto;
  }
}

.display-1 {
  font-size: 22px !important;
  font-weight: 300 !important;
  line-height: 100px !important;
  font-family: 'GlacialIndifferenceRegular', sans-serif !important;
  @media screen and (max-width: 960px) {
    font-size: 18px !important;
  }
}
.display-2 {
  font-size: 40px !important;
  font-family: 'GlacialIndifferenceRegular', sans-serif !important;
  @media screen and (max-width: 960px) {
    font-size: 30px !important;
  }
}
.cost-grid {
  justify-content: center;
  display: grid;
  grid-template-columns: repeat(3, 20%);
  grid-gap: 2rem 3rem;
  margin-top: 5rem;
  @media screen and (max-width: 960px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    margin-top: 2.5rem;
    grid-gap: 2rem 1rem;
  }
  @media screen and (min-width: 961px) and (max-width: 1420px) {
    grid-template-columns: repeat(3, 30%);
    margin-top: 2.5rem;
    grid-gap: 2rem 1.5rem;
  }
}
.cost-div {
  border-right: 2px solid rgba(128, 128, 128, 0.2);
  box-shadow: 0 4px 8px 0 rgba(128, 128, 128, 0.4),
    0 6px 20px 0 rgba(128, 128, 128, 0.4);
  animation: fadeInFadeOut 4s;
  background: white;
  &:hover {
    transform: translateY(-15px);
    cursor: pointer;
  }
}
.bed-img {
  border: 2px solid rgba(0, 128, 0, 0.6);
  border-radius: 50%;
  width: 260px;
  height: 260px;
  margin: 2.5rem auto;
  text-align: center;
}
.single-bed-img {
  height: 50px;
  width: 50px;
  margin: 0.2rem;
}
.book_btn {
  background-color: #4caf50;
  color: white;
  border-radius: 40px;
  height: 60px;
  width: 390px;
  font-size: 25px;
  margin-top: 1rem;
  @media screen and (max-width: 960px) {
    height: 45px;
    width: 290px;
    font-size: 20px;
  }
}

.book_btn:hover {
  transform: scale(1.1);
}

.mx-5 {
  @media screen and (max-width: 960px) {
    margin: 0.2rem 0.5rem !important;
  }
}

.notes-li {
  text-align: justify;
  line-height: 2rem;
}

.whatsapp-btn {
  position: fixed;
  top: 82vh;
  right: 1vw;
  margin-bottom: 5rem;
}
.breif-card {
  width: 300px;
  height: 380px;
  position: relative;
  background: rgba(0, 128, 0, 0.9);
  clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);
  box-shadow: 0 4px 8px 0 rgba(0, 128, 0, 0.9),
    0 6px 20px 0 rgba(0, 128, 0, 0.9);
  animation: fadeInFadeOut 2s;
}
.breif-card-inner {
  position: absolute;
  top: 1px;
  left: 1px;
  right: 1px;
  bottom: 1px;
  background: #fff;
  clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);
}
.breif-layout {
  margin-left: 5rem;
  @media screen and (max-width: 960px) {
    margin: 0 !important;
    align-items: center !important;
  }
}
.breif-text {
  font-size: 14px;
  font-weight: 600;
  color: gray;
  margin: 1.5rem 2.5rem 1.5rem 0.5rem;
  text-align: left;
  @media screen and (max-width: 960px) {
    margin: 1rem 2.5rem 0.5rem 0.5rem;
  }
}

.breif-card-mobile {
  width: 300px;
  height: 450px;
  position: relative;
  background: rgba(0, 128, 0, 0.9);
  clip-path: polygon(54% 0, 100% 0, 100% 75%, 50% 100%, 0% 75%, 0 0);
  box-shadow: 0 4px 8px 0 rgba(0, 128, 0, 0.9),
    0 6px 20px 0 rgba(0, 128, 0, 0.9);
}
.breif-card-inner-mobile {
  position: absolute;
  top: 1px;
  left: 1px;
  right: 1px;
  bottom: 1px;
  background: #fff;
  clip-path: polygon(54% 0, 100% 0, 100% 75%, 50% 100%, 0% 75%, 0 0);
}

@keyframes fadeInFadeOut {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
