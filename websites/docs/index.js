/* eslint-disable strict */
'use strict';
/* eslint-enable strict */

const path = require('path');

const express = require('express'),
      next = require('next');

const api = require('./services/api');

class Documentation {
  async initialize ({ baseUrl, contentDirectory, nodeEnv }) {
    if (!baseUrl) {
      throw new Error('Base url is missing.');
    }
    if (!contentDirectory) {
      throw new Error('Content directory is missing.');
    }
    if (!nodeEnv) {
      throw new Error('Node env is missing.');
    }

    this.nodeEnv = nodeEnv;

    /* eslint-disable callback-return */
    const nextApp = next({
      dev: this.nodeEnv,
      dir: __dirname
    });
    /* eslint-enable callback-return */

    const handle = nextApp.getRequestHandler();

    await nextApp.prepare();

    this.api = express();

    this.api.use('/', express.static(path.join(__dirname, 'static')));
    this.api.use('/', express.static(contentDirectory));

    // TODO: move to static export
    this.api.get('/robots.txt', async (req, res) => {
      res.writeHead(200, {
        'content-type': 'text/plain'
      });

      res.write(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.txt`);

      res.end();
    });

    // TODO: move to static export
    this.api.get('/sitemap.txt', async (req, res) => {
      let urls;

      try {
        urls = await api.get({ path: 'urls' });
      } catch {
        return res.status(500).end();
      }

      res.writeHead(200, {
        'content-type': 'text/plain'
      });

      res.write(urls.join('\n'));

      res.end();
    });

    this.api.get('/:version?/:section?/:chapter?/:page?', (req, res) => {
      const { version, section, chapter, page } = req.params;

      if (!version) {
        res.redirect(301, 'latest');
        res.end();

        return;
      }

      if (!version && (!section || !chapter || !page)) {
        res.redirect(301, `${version}`);
        res.end();

        return;
      }

      return nextApp.render(req, res, '/index', { version, section, chapter, page });
    });

    this.api.get('*', (req, res) => handle(req, res));
  }
}

module.exports = Documentation;
