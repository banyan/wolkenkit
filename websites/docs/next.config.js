/* eslint-disable strict */
'use strict';
/* eslint-enable strict */

const processenv = require('processenv'),
      slug = require('remark-slug');

const isProduction = processenv('NODE_ENV') === 'production';

const withMDX = require('@next/mdx')({
  extension: /\.mdx$/u,
  options: {
    remarkPlugins: [ slug ]
  }
});

const config = {
  exportTrailingSlash: isProduction,
  pageExtensions: [ 'js', 'jsx', 'mdx' ]
};

module.exports = withMDX(config);
