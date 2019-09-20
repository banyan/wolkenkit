import { AggregateIdentifier } from './AggregateIdentifier';
import Application from '../application';
import CommandExternal from './CommandExternal';
import { ContextIdentifier } from './ContextIdentifier';
import { Dictionary } from '../../types/Dictionary';
import errors from '../errors';
import { User } from './User';
import uuid from 'uuidv4';
import Value from 'validate-value';

const uuidRegex = uuid.regex.v4.toString().slice(1, -1);

const value = new Value({
  type: 'object',
  properties: {
    contextIdentifier: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1, format: 'alphanumeric' }
      },
      required: [ 'name' ],
      additionalProperties: false
    },
    aggregateIdentifier: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1, format: 'alphanumeric' },
        id: { type: 'string', pattern: uuidRegex }
      },
      required: [ 'name', 'id' ],
      additionalProperties: false
    },
    name: { type: 'string', minLength: 1, format: 'alphanumeric' },
    id: { type: 'string', pattern: uuidRegex },
    data: {
      type: 'object',
      properties: {},
      required: [],
      additionalProperties: true
    },
    metadata: {
      type: 'object',
      properties: {
        timestamp: { type: 'number' },
        correlationId: { type: 'string', pattern: uuidRegex },
        causationId: { type: 'string', pattern: uuidRegex }
      },
      required: [ 'timestamp', 'correlationId', 'causationId' ],
      additionalProperties: false
    },
    annotations: {
      type: 'object',
      properties: {
        client: {
          type: 'object',
          properties: {
            token: { type: 'string', minLength: 1 },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', minLength: 1 },
                claims: {
                  type: 'object',
                  properties: {
                    sub: { type: 'string', minLength: 1 }
                  },
                  required: [ 'sub' ],
                  additionalProperties: true
                }
              },
              required: [ 'id', 'claims' ],
              additionalProperties: false
            },
            ip: { type: 'string', minLength: 1 }
          },
          required: [ 'token', 'user', 'ip' ],
          additionalProperties: false
        },
        initiator: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', minLength: 1 },
                claims: {
                  type: 'object',
                  properties: {
                    sub: { type: 'string', minLength: 1 }
                  },
                  required: [ 'sub' ],
                  additionalProperties: true
                }
              },
              required: [ 'id', 'claims' ],
              additionalProperties: false
            }
          },
          required: [ 'user' ],
          additionalProperties: false
        }
      },
      required: [ 'client', 'initiator' ],
      additionalProperties: false
    }
  },
  required: [ 'contextIdentifier', 'aggregateIdentifier', 'name', 'id', 'data', 'metadata', 'annotations' ],
  additionalProperties: false
});

class CommandInternal extends CommandExternal {
  public annotations: {
    client: {
      token: string;
      user: User;
      ip: string;
    };
    initiator: {
      user: User;
    };
  };

  protected constructor ({
    contextIdentifier,
    aggregateIdentifier,
    name,
    id,
    data,
    metadata,
    annotations
  }: {
    contextIdentifier: ContextIdentifier;
    aggregateIdentifier: AggregateIdentifier;
    name: string;
    id: string;
    data: Dictionary<any>;
    metadata: { timestamp: number; causationId: string; correlationId: string };
    annotations: {
      client: { token: string; user: User; ip: string };
      initiator: { user: User };
    };
  }) {
    super({ contextIdentifier, aggregateIdentifier, name, id, data, metadata });
    this.annotations = annotations;

    value.validate(this, { valueName: 'command' });
  }

  public static create ({
    contextIdentifier,
    aggregateIdentifier,
    name,
    data = {},
    metadata = {},
    annotations
  }: {
    contextIdentifier: ContextIdentifier;
    aggregateIdentifier: AggregateIdentifier;
    name: string;
    data?: Dictionary<any>;
    metadata?: { causationId?: string; correlationId?: string };
    annotations: {
      client: { token: string; user: User; ip: string };
      initiator: { user: User };
    };
  }): CommandInternal {
    if (
      (metadata.causationId && !metadata.correlationId) ||
      (!metadata.causationId && metadata.correlationId)
    ) {
      throw new Error('Causation id and correlation id must either be given both or none.');
    }

    const id = uuid();

    const command = new CommandInternal({
      contextIdentifier,
      aggregateIdentifier,
      name,
      id,
      data,
      metadata: {
        causationId: metadata.causationId || id,
        correlationId: metadata.correlationId || id,
        timestamp: Date.now()
      },
      annotations
    });

    return command;
  }

  public static deserialize (object: any): CommandInternal {
    const command = new CommandInternal(object);

    return command;
  }

  public static validate ({ command, application }: {
    command: any;
    application: Application;
  }): void {
    let deserializedCommand;

    try {
      deserializedCommand = CommandInternal.deserialize(command);
    } catch {
      throw new errors.CommandMalformed();
    }

    const context = application.commands.internal[deserializedCommand.contextIdentifier.name];

    if (!context) {
      throw new Error('Invalid context name.');
    }

    const aggregate = context[deserializedCommand.aggregateIdentifier.name];

    if (!aggregate) {
      throw new Error('Invalid aggregate name.');
    }

    const aggregateCommand = aggregate[deserializedCommand.name];

    if (!aggregateCommand) {
      throw new Error('Invalid command name.');
    }

    const { schema } = aggregateCommand;

    if (!schema) {
      return;
    }

    const dataValue = new Value(schema);

    dataValue.validate(deserializedCommand.data, { valueName: 'command.data' });
  }
}

export default CommandInternal;
