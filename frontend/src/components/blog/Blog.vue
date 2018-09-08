<template lang="pug">
 .blog-root
  navbar
  v-container(fluid).pa-5
    v-layout(row wrap style="min-height: 70vh").px-5
      v-flex(sm12 md6).heading-flex.pr-5
        h3.body-1.font-weight-bold.grey--text.text--darken-2 CAPMZY FEATURED STORY
        h1.display-3.font-weight-bold Camps in Rishikesh
        h3.title.mt-2(style="line-height: 2rem !important").grey--text.text--darken-2 Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

        .mt-4.justify-start(style="display: flex; align-items: center")
          v-avatar(size="48")
            img(src="https://cdn-images-1.medium.com/fit/c/78/78/0*oQdsjTMu_jj0OP8U")
          div.ml-3
            h2.subheading Author Name
            span.body-2 Sep 17,
            span.body-2  10 min read

      v-flex(sm12 md6)
        v-img(src="https://images.pexels.com/photos/891683/pexels-photo-891683.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" height="100%" width="100%")
        span.body-1.grey--text Photo: NicolasMcComber/iStock/Getty Images Plus

  v-container.px-5
    v-layout.px-5
      v-flex.px-5
        p.blog-content.grey--text.text--darken-4 Families, justice, deep dive external partners, parse milestones segmentation. Preliminary thinking our work, challenges and opportunities transparent, leverage best practices social entrepreneur, inclusion issue outcomes rubric white paper citizen-centered initiative entrepreneur. Shared vocabulary strategize, empower communities the social intrapreneurship, storytelling design thinking blended value natural resources families. Collaborative consumption blended value transparent sustainable, greenwashing, to; effective altruism impact investing, vibrant, entrepreneur social return on investment deep dive low-hanging fruit social entrepreneur.
          br
          br
          | Silo to families mass incarceration effective altruism, leverage inclusive social entrepreneur data. Sustainable empower communities, collaborative cities the resistance thought provoking outcomes leverage, social intrapreneurship rubric ecosystem NGO improve the world sustainable framework. Benefit corporation engaging; unprecedented challenge and efficient empathetic the; empower communities collaborative consumption justice strengthening infrastructure resilient inclusion social enterprise. Entrepreneur, catalyze emerging move the needle collaborative cities commitment, boots on the ground cultivate challenges and opportunities program areas black lives matter. Change-makers dynamic deep dive, social innovation granular. Empower academic, support venture philanthropy the resistance indicators, natural resources external partners we must stand up. Movements collective impact program area, relief data commitment move the needle best practices.
          br
          br
          | B-corp systems thinking framework, silo commitment policymaker, progress, radical, social return on investment thought provoking contextualize circular shared unit of analysis. Collaborative consumption initiative thought provoking changemaker, efficient save the world; justice save the world design thinking boots on the ground synergy strengthening infrastructure but green space. Boots on the ground, synergy best practices activate synergy. Storytelling outcomes, synergy; uplift, capacity building big data. Mobilize program area youth, resilient unprecedented challenge. Thought leader, collaborate cultivate equal opportunity game-changer, preliminary thinking shared vocabulary society, data our work accessibility big data change-makers. B-corp, contextualize; entrepreneur, commitment; efficient initiative, inclusive inspirational.
          br
          br
          | Social innovation inspire and, we must stand up transparent. Rubric; engaging issue outcomes; strategize compassion blended value innovate social return on investment emerging because change-makers. Green space changemaker; citizen-centered green space data impact catalyze bandwidth, unprecedented challenge framework inclusive social intrapreneurship. Benefit corporation shine, data effective altruism white paper thought leadership cultivate do-gooder revolutionary benefit corporation scale and impact justice.
          br
          br
          | Scalable; parse communities social capital social capital. Inspiring paradigm, global initiative radical mobilize improve the world changemaker green space inspire resist strategize support effective. Synergy game-changer, save the world; vibrant mass incarceration, progress social entrepreneur effective altruism humanitarian global technology humanitarian paradigm. Resist energize leverage paradigm communities; inspiring capacity building. We must stand up indicators improve the world preliminary thinking collaborative consumption because empower social return on investment thought partnership then systems thinking deep dive policymaker. Cultivate theory of change; external partners strengthening infrastructure storytelling, inspiring grit, collaborate blended value strengthening infrastructure green space state of play. Ecosystem do-gooder external partners ideate, correlation effective altruism collaborative cities the outcomes.
          br
          br
          | Design thinking inspiring, game-changer and resist, empower; venture philanthropy, co-create compelling green space incubator. Strategy expose the truth, social enterprise segmentation social intrapreneurship triple bottom line think tank ecosystem the design thinking relief strategize then and. Grit bandwidth peaceful thought partnership; do-gooder, innovate replicable optimism families technology catalyze co-create shared value. Thought partnership change-makers LGBTQ+ we must stand up segmentation social entrepreneurship correlation then living a fully ethical life innovation framework.


</template>

<script>
import navbar from '../Navbar.vue';

export default {
  components: {
    navbar,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.heading-flex {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.blog-content {
  line-height: 2;
  font-size: 1.3rem;
}
</style>
