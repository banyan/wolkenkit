'use strict';

const path = require('path');

const setupApplication = require('../../setupApplication');

const withDirectoriesWithoutIndex = async function () {
  const directory = await setupApplication({
    remove: [
      'server/writeModel/sampleContext/*',
      'server/readModel/lists/*',
      'server/flows/*'
    ],
    copy: [ path.join(__dirname, 'data', '*') ]
  });

  return directory;
};

module.exports = withDirectoriesWithoutIndex;
