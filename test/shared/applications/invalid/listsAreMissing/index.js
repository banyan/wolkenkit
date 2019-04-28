'use strict';

const setupApplication = require('../../setupApplication');

const listsAreMissing = async function () {
  const directory = await setupApplication({
    remove: [ 'server/readModel/lists' ]
  });

  return directory;
};

module.exports = listsAreMissing;
