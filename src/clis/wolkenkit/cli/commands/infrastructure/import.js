'use strict';

const buntstift = require('buntstift'),
      getUsage = require('command-line-usage'),
      processenv = require('processenv'),
      stripIndent = require('common-tags/lib/stripIndent');

const commands = require('../../../commands'),
      defaults = require('../../defaults.json'),
      globalOptionDefinitions = require('../../globalOptionDefinitions'),
      showProgress = require('../../showProgress');

const importCommand = {
  description: 'Import application data.',

  async getOptionDefinitions () {
    return [
      {
        name: 'env',
        alias: 'e',
        type: String,
        defaultValue: processenv('WOLKENKIT_ENV') || defaults.env,
        description: 'select environment',
        typeLabel: '<env>'
      },
      {
        name: 'from',
        alias: 'f',
        type: String,
        description: 'set the directory to export to',
        typeLabel: '<directory>'
      },
      {
        name: 'to-event-store',
        type: Boolean,
        defaultValue: defaults.commands.infrastructure.import.toEventStore,
        description: 'import the event store'
      }
    ];
  },

  async run (options) {
    if (!options) {
      throw new Error('Options are missing.');
    }
    if (!options.env) {
      throw new Error('Environment is missing.');
    }
    if (options['to-event-store'] === undefined) {
      throw new Error('To event store is missing.');
    }

    const directory = process.cwd(),
          { env, from, help, verbose } = options;

    const toEventStore = options['to-event-store'];

    if (help) {
      return buntstift.info(getUsage([
        { header: 'wolkenkit infrastructure import', content: this.description },
        { header: 'Synopsis', content: stripIndent`
          wolkenkit infrastructure import [--env <env>] --from=<directory> [--to-event-store]` },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]));
    }

    if (!from) {
      buntstift.error('The --from option is missing.');

      throw new Error('The --from option is missing.');
    }

    buntstift.info('Importing application data...');

    const stopWaiting = buntstift.wait();

    try {
      await commands.infrastructure.import({
        directory,
        env,
        from,
        toEventStore
      }, showProgress(verbose, stopWaiting));
    } catch (ex) {
      stopWaiting();

      switch (ex.code) {
        case 'EINFRASTRUCTURENOTRUNNING':
          buntstift.error('The infrastructure is not running.');
          break;
        case 'EINFRASTRUCTUREPARTIALLYRUNNING':
          buntstift.error('The infrastructure is partially running.');
          break;
        default:
          buntstift.error('Failed to import application data.');
          break;
      }

      throw ex;
    }

    stopWaiting();
    buntstift.success('Imported application data.');
  }
};

module.exports = importCommand;
