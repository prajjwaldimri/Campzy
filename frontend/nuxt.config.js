// import path from 'path'
// import fs from 'fs'
import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
import pkg from './package'

// let https = {}
// if (process.env.NODE_ENV !== 'production') {
//   https = {
//     key: fs.readFileSync(path.resolve(__dirname, 'certs/server.key')),
//     cert: fs.readFileSync(path.resolve(__dirname, 'certs/server.crt'))
//   }
// }

export default {
  // mode: 'universal',
  // server: {
  //   https: https
  // },

  /*
   ** Headers of the page
   */
  head: {
    title: 'Campzy: The complete camping solution',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'theme-color',
        content: '#2ecc71'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },

      {
        rel: 'stylesheet',
        media: 'screen',
        href: 'https://fontlibrary.org/face/glacial-indifference',
        type: 'text/css'
      },

      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }


    ],
    script: [{
        src: 'https://unpkg.com/nprogress@0.2.0/nprogress.js'
      },
      {
        src: 'https://apis.google.com/js/api:client.js',
        defer: true
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: ['~/assets/style/app.styl'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/i18n',
    '@/plugins/vuetify',
    '@/plugins/vue-meta',
    '@/plugins/vee-validate',
    '@/plugins/vue-tour',
    '@/plugins/googleSignin',
    '@/plugins/facebookSignin',
    '@/plugins/vue-loaders',
    '@/plugins/vue-tel-input',
    {
      src: '@/plugins/vue-google-maps',
      ssr: true
    },
    '@/plugins/vue-cookie',
    '@/plugins/vue-moment',
    {
      src: '@/plugins/vue-tiny-slider',
      ssr: false
    }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/proxy', '@nuxtjs/pwa', '@nuxtjs/sitemap'],

  // router: {
  //   middleware: 'i18n'
  // },

  sitemap: {
    path: '/sitemap.xml',
    hostname: 'https://campzy.in',
    cacheTime: 1000 * 60 * 15,
    gzip: true,
    generate: false, // Enable me when using nuxt generate
    exclude: ['/dashboard/**', '/profile/**']
  },

  // PWA Config
  manifest: {
    name: 'Campzy',
    short_name: 'Campzy',
    description: 'The complete camping solution',
    lang: 'en',
    theme_color: '#2ecc71',
    icons: [{
      src: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png'
    }]
  },
  icon: {
    iconSrc: '/android-chrome-512x512.png'
  },

  /*
   ** Build configuration
   */
  build: {
    transpile: ['vuetify/lib', /^vue2-google-maps($|\/)/],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })

      }
    }
  }
}
