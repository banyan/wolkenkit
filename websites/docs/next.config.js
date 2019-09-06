/* eslint-disable strict */
'use strict';
/* eslint-enable strict */

const path = require('path');

const processenv = require('processenv'),
      slug = require('remark-slug');

const write = require('../shared/file/write');

const isProduction = processenv('NODE_ENV') === 'production';

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
    const sitemapFileName = path.join(outDir, 'sitemap.txt');

    if (!dev) {
      const allPageUrls = Object.keys(defaultPathMap).
        reduce((urls, relativeUrl) => `${urls}${relativeUrl}\n`, '');

      await write(sitemapFileName, allPageUrls);
    }

    return defaultPathMap;
  }
};

module.exports = withMDX(config);
