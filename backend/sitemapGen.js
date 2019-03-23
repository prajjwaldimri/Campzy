const sm = require('sitemap');

const sitemap = sm.createSitemap({
  hostname: 'https://campzy.in',
  cacheTime: 600000,
  urls: [
    { url: '/', changefreq: 'daily', priority: 0.3 },
    { url: '/search', changefreq: 'daily', priority: 0.3 },
    { url: '/blogs', changefreq: 'daily', priority: 0.3 },
    { url: '/termsAndConditions', changefreq: 'monthly', priority: 0.3 },
    { url: '/addYourCamp', changefreq: 'daily', priority: 0.3 },
  ],
});

module.exports = { sitemap };
