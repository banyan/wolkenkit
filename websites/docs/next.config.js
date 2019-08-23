/* eslint-disable strict */
'use strict';
/* eslint-enable strict */

const slug = require('remark-slug');

const withMDX = require('@next/mdx')({
  extension: /\.mdx$/u,
  options: {
    remarkPlugins: [ slug ]
  }
});

const config = {
  exportTrailingSlash: true,
  pageExtensions: [ 'js', 'jsx', 'mdx' ]
};

module.exports = withMDX(config);
