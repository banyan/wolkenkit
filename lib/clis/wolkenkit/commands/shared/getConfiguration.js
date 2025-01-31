'use strict';

const get = require('lodash/get'),
      noop = require('lodash/noop'),
      processenv = require('processenv');

const application = require('../../application'),
      errors = require('../../errors'),
      runtimes = require('../../runtimes');

const getFallbackConfiguration = async function () {
  const latestStableVersion = await runtimes.getLatestStableVersion();

  const configuration = new application.Configuration({
    type: 'cli',
    environment: 'default',
    applicationName: 'fallback',
    runtimeVersion: latestStableVersion,
    apiHostname: 'local.wolkenkit.io',
    apiPort: 3000,
    packageJson: {}
  });

  return configuration;
};

const getConfiguration = async function ({
  directory,
  env,
  isPackageJsonRequired,
  port = undefined
}, progress = noop) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!env) {
    throw new Error('Environment is missing.');
  }
  if (isPackageJsonRequired === undefined) {
    throw new Error('Is package.json required is missing.');
  }

  let packageJson;

  try {
    packageJson = await application.getConfiguration({ directory });
  } catch (ex) {
    switch (ex.code) {
      case 'EFILENOTFOUND':
        if (!isPackageJsonRequired) {
          progress({ message: 'package.json is missing, using fallback configuration.' });

          return await getFallbackConfiguration();
        }

        progress({ message: 'package.json is missing.', type: 'info' });
        break;
      case 'EFILENOTACCESSIBLE':
        progress({ message: 'package.json is not accessible.', type: 'info' });
        break;
      case 'EJSONMALFORMED':
        progress({ message: 'package.json contains malformed JSON.', type: 'info' });
        break;
      case 'ECONFIGURATIONNOTFOUND':
        progress({ message: 'package.json does not contain wolkenkit configuration.', type: 'info' });
        break;
      case 'ECONFIGURATIONMALFORMED':
        progress({ message: `package.json contains malformed configuration (${ex.message.slice(0, -1)}).`, type: 'info' });
        break;
      case 'EVERSIONNOTFOUND':
        progress({ message: 'package.json contains an unknown runtime version.', type: 'info' });
        break;
      default:
        progress({ message: ex.message, type: 'info' });
    }

    throw ex;
  }

  const runtimeVersion = packageJson.runtime.version;

  const selectedEnvironment = packageJson.environments[env];

  if (!selectedEnvironment) {
    progress({ message: `package.json does not contain environment ${env}.`, type: 'info' });
    throw new errors.EnvironmentNotFound();
  }

  const type = selectedEnvironment.type || 'cli';

  const configuration = new application.Configuration({
    type,
    environment: env,
    applicationName: packageJson.application,
    runtimeVersion,
    packageJson,
    apiHostname: get(selectedEnvironment, 'api.host.name'),
    apiCertificate: get(selectedEnvironment, 'api.host.certificate'),
    apiPort: port || processenv('WOLKENKIT_PORT') || get(selectedEnvironment, 'api.port'),
    dockerMachine: get(selectedEnvironment, 'docker.machine')
  });

  if (!configuration) {
    throw new Error('Configuration is missing.');
  }

  return configuration;
};

module.exports = getConfiguration;
