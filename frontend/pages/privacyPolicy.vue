<template lang="pug">
  .privacy-container
    Navbar
    v-container
      v-layout(column)
        .content.pt-4
          .d-flex.justify-center
            img(src='/vectors/Campzy-logo-black.svg' height='60' width='60')
          v-flex.mt-5
            h2.headline.font-weight-bold.grey--text.text--darken-3 Privacy Policy
            p.mt-4.subheading.font-weight-bold.grey--text.text--darken-2 Effective Date of Privacy Policy: 25 Oct 2018

            p.font-weight-medium.grey--text.text--darken-3 Campzy values the information that you share with us and information that we collect about you. We strive to secure that information and ensure that the information is used for proper purposes, including enhancing your use and enjoyment of our services and properties.
              br
              | This Privacy Policy applies to all personal data in any format or medium, relating to all users, employees, suppliers and others who do business with Campzy.
              br
              | By visiting or using the Campzy.in website, you agree to the terms of this Privacy Policy. Please review this Privacy Policy carefully before visiting or using our website, or otherwise providing us with any of your personal data.
          v-flex.mt-5
            h2.headline.font-weight-bold.grey--text.text--darken-3 Personal Data We Collect and Use

            p.mt-4.subheading.font-weight-bold.grey--text.text--darken-2 General Information

            p.font-weight-medium.grey--text.text--darken-3 When you use the Internet, your computer may transmit certain information to the servers that host the websites you visit.  The information may include the type of Internet browser you are using, the type of computer operating system you are using, your Internet Portal (IP) address, the pages you visited on our websites, and how you arrived at our websites.  When you visit our websites, we collect this information, and we use this information to create a better user experience, to identify areas for improvement on our websites, to enhance the security of our systems, and to provide information on our special offers and promotions.
              br
              | When you visit our website, we may assign your computer one or more “cookies”. By accessing our website, you agree that we can place cookies on your device.

              br
              | In addition to cookies, we may also use other internet technologies such as web beacons, pixel tags and other similar technologies to deliver or communicate with cookies and track your use of our website.
              br
              | Our website may allow third parties to download cookies onto your device.  Third parties, such as analytics firms and business partners (including Google) may use cookies and other technologies (including Google Analytics) to collect information about your online activities while you are on our website.

            p.mt-4.subheading.font-weight-bold.grey--text.text--darken-2 Personal Data
            p.font-weight-medium.grey--text.text--darken-3 We may collect certain types of personal data. As used in this Policy, “personal data” means data, whether true or not, about an individual who can be identified: (a) from that data; or (b) from that data and other information to which the organisation has or is likely to have access.  Personal data includes, among other things, your: name; street or mailing address; telephone number(s); email addresses; date of birth; gender; nationality; passport number etc.

              br
              | We may also collect information that is not personally identifiable by themselves, but can be linked to personal data you provide to us. Such information includes the type of Internet browser you are using, your device MAC address, the pages you visited on our websites, how you arrived at our websites (i.e., through a search engine or a referring website), etc.

            p.mt-4.subheading.font-weight-bold.grey--text.text--darken-2 Other Sources of Data
            p.font-weight-medium.grey--text.text--darken-3 Other parties may provide your information to us so that we can provide products and services and use your information for different purposes.
              br
              | Vendors, Suppliers, and Others Doing Business with Us:  We have strict rules in place to comply with the laws that apply to us.  Before we do business with a third party, we take reasonable steps to make sure that they will prudently protect the information we share with each other, including your personal data they may collect or receive.
              br
              | Third Parties Authorised By You:  When someone else arranges for you to interact with our properties, they may provide us information so that we can provide you with products and/or services during your visit.  For example, when your employer or a travel agent arranges for you to stay at one of our properties, they may provide us with the information listed above so that we can provide you with products and services.

          v-flex.mt-5
            h2.headline.font-weight-bold.grey--text.text--darken-3 How We May Use Your Information

            p.mt-4.subheading.font-weight-bold.grey--text.text--darken-4 Your privacy is important to us.  We collect and use or disclose information we believe is necessary to our business, and to provide you with the products, services, and experiences you expect when you interact with us.  When we collect and use your information, we take your privacy and security very seriously.

            p.font-weight-medium.grey--text.text--darken-3 We collect personal data to deliver superior quality of service.  We will use the information you provide to us for the purpose you provided it to us (e.g., to make a reservation, pay for a service etc.), which is stated when information is collected.  We may also use your information in other ways for our business purposes and to provide you with the products, services, and experiences you request and expect from us, including but not limited to the following purposes:
            ul.ml-5
              li To fully respond to your questions, requests, or communications;
              li To verify your identity;
              li To process guest reservations and/or requests for information or services;
              li To provide you with any Campzys’ products and services;
              li To provide you with personalised content on our website and to improve the content and the navigability of our website;
              li To develop new Campzy products and services;
              li To audit, research and conduct analysis in order to maintain and improve our services and protect our users;
              li To conduct statistical or demographic analysis, marketing and promotions planning and execution, market research and analysis, customer satisfaction and quality assurance surveys;
              li To ensure the technical functioning and security of our network;
              li To take steps to ensure and monitor safety and security and protection of your personal data, including working with third parties to help protect your information;
              li To comply with applicable laws and regulations, court orders or other legal processes or other legal requirements of any governmental authorities, and to assist our contracting parties’ to comply with the same;
              li To defend and protect the rights or property of campzy, its employees, and its users;
              li To respond to exceptional circumstances, such as a national emergency, security concern, or other situation in which campzy deems disclosure of your information as prudent.
            p.mt-4.font-weight-medium.grey--text.text--darken-3 If you have ceased to be our customer or client and have cancelled your account, we will not send you marketing materials or share your personal data with unrelated third parties.  However, we may still retain your records and use your information for legal and/or business purposes, including for compliance with any applicable laws.

          v-flex.mt-5
            h2.headline.font-weight-bold.grey--text.text--darken-3 Changes to this Privacy Policy

            p.mt-4.font-weight-medium.grey--text.text--darken-3 We reserve the right to modify or change this Privacy Policy at any time. The Effective Date, as stated above, indicates the last time this policy was materially revised. When we make a material change to this Privacy Policy, we will inform you by posting a prominent notice on the home page of our website or changing the date on this page noting when the Privacy Policy was last updated. We encourage you to review this page periodically to understand our policy regarding the collection and use of your personal data.

              br
              | Your continued use of our website and acceptance of our services at campzy after any changes to this Privacy Policy constitutes your consent to any such changes, to the extent such consent is not otherwise provided.
    Footer


</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

export default {
  components: {
    Navbar,
    Footer
  }
}
</script>

<style lang="scss" scoped>
.privacy-container {
  padding: 0px;
}
.privacy-container p {
  font-size: 1.2rem !important;
  line-height: 2.3rem;
  justify-content: center;
}

.privacy-container ul {
  @media screen and (max-width: 960px) {
    margin-left: 0.5rem !important;
  }
}

.privacy-container ul li {
  font-size: 1.2rem !important;
  line-height: 2.3rem;
  justify-content: center;
  font-weight: 500;
  margin-top: 0.8rem;
  color: #424242;
  caret-color: #424242;
}
</style>
