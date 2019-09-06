/* eslint-disable strict */
'use strict';
/* eslint-enable strict */

const path = require('path');

const buntstift = require('buntstift'),
      HCCrawler = require('headless-chrome-crawler');

const read = require('../../shared/file/read');

(async () => {
  const sitemapPath = path.join(__dirname, '..', 'out', 'sitemap.txt');

  try {
    const sitemap = await read(sitemapPath);
    const pageUrls = sitemap.split('\n');

    buntstift.info('Starting to crawl...');
    buntstift.line();

    const crawler = await HCCrawler.launch({
      headless: true,
      slowMo: 0,
      defaultViewport: {
        width: 1280,
        height: 768,
        isMobile: false
      },
      evaluatePage: () => ({
        title: document.title
      }),
      onSuccess ({ result, previousUrl, response }) {
        const { status, url } = response;

        if (status !== 200 || result.title === '404') {
          buntstift.line();
          buntstift.error(`${url} status:${status} title:${result.title}.`);
          buntstift.error(`Previous page was ${previousUrl}. `);
          buntstift.line();
        }
      },
      onError (error) {
        buntstift.error(`Got error for page ${error}. `);
      }
    });

    crawler.on('requestfinished', options => {
      buntstift.info(`Finished ${options.url}`);
    });

    // Queue a request
    for (const pageUrl of pageUrls) {
      await crawler.queue({
        url: `http://localhost:3000${pageUrl}`,
        jQuery: false,
        skipDuplicates: true,
        maxDepth: 2,
        allowedDomains: [
          'localhost'
        ],
        deniedDomains: [
          'github.com'
        ]
      });
    }

    buntstift.info('Queuing urls...');
    buntstift.line();

    // Resolved when no queue is left
    await crawler.onIdle();

    buntstift.info('Finished crawling...');
    buntstift.line();

    await crawler.close();
  } catch (ex) {
    buntstift.error(ex);
  }
})();
