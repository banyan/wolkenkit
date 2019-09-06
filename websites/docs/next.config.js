/* eslint-disable strict */
'use strict';
/* eslint-enable strict */

const path = require('path');

const processenv = require('processenv'),
      slug = require('remark-slug'),
      stripIndent = require('common-tags/lib/stripIndent');

const configuration = require('./configuration'),
      write = require('../shared/file/write');

const { baseUrl } = configuration,
      isProduction = processenv('NODE_ENV') === 'production';

const withMDX = require('@next/mdx')({
  extension: /\.mdx$/u,
  options: {
    remarkPlugins: [ slug ]
  }
});

const config = {
  exportTrailingSlash: isProduction,
  pageExtensions: [ 'js', 'jsx', 'mdx' ],
  async exportPathMap (defaultPathMap, { dev, outDir }) {
    if (!dev) {
      const robotsPath = path.join(outDir, 'robots.txt'),
            sitemapPath = path.join(outDir, 'sitemap.txt');

      const sitemapContent = Object.keys(defaultPathMap).
        reduce((content, relativeUrl) => `${content}${baseUrl}${relativeUrl}\n`, '');

      await write(sitemapPath, sitemapContent);

      const robotsTxtContent = stripIndent`
        User-agent: *
        Allow: /

        Sitemap: ${baseUrl}/sitemap.txt`;

      await write(robotsPath, robotsTxtContent);
    }

    return defaultPathMap;
  }
};

module.exports = withMDX(config);
