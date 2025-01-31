import assert from 'assertthat';
import { createReadStream } from 'fs-extra';
import { CustomError } from 'defekt';
import { Filestore } from '../../../../lib/stores/filestore/Filestore';
import { OwnedAuthorizationOptions } from '../../../../lib/apis/file/Http/V2/isAuthorized/AuthorizationOptions';
import path from 'path';
import { ReadStream } from 'fs';
import streamToString from 'stream-to-string';
import uuid from 'uuidv4';

/* eslint-disable mocha/max-top-level-suites */
const getTestsFor = function ({ createFilestore }: {
  createFilestore (): Promise<Filestore>;
}): void {
  const isAuthorized: OwnedAuthorizationOptions = {
    commands: {
      removeFile: { forAuthenticated: true, forPublic: true },
      transferOwnership: { forAuthenticated: true, forPublic: true },
      authorize: { forAuthenticated: true, forPublic: true }
    },
    queries: {
      getFile: { forAuthenticated: true, forPublic: true }
    },
    owner: 'Jane.Doe'
  };
  const contentType = 'application/json',
        fileName = 'someFile.json';

  let content: string,
      contentLength: number,
      filestore: Filestore,
      id: string,
      stream: ReadStream;

  setup(async (): Promise<void> => {
    id = uuid();

    const filePath = path.join(__dirname, '..', '..', '..', 'shared', 'files', 'someFile.json');

    content = await streamToString(createReadStream(filePath));
    contentLength = content.length;
    stream = createReadStream(filePath);
  });

  suite('addFile', (): void => {
    setup(async (): Promise<void> => {
      filestore = await createFilestore();
    });

    test('does not throw an error.', async (): Promise<void> => {
      await assert.that(async (): Promise<void> => {
        await filestore.addFile({ id, fileName, contentType, isAuthorized, stream });
      }).is.not.throwingAsync();
    });

    test('throws an error if the id is already being used.', async (): Promise<void> => {
      await filestore.addFile({ id, fileName, contentType, isAuthorized, stream });

      await assert.that(async (): Promise<void> => {
        await filestore.addFile({ id, fileName, contentType, isAuthorized, stream });
      }).is.throwingAsync((ex: Error): boolean => (ex as CustomError).code === 'EFILEALREADYEXISTS');
    });
  });

  suite('getMetadata', (): void => {
    setup(async (): Promise<void> => {
      filestore = await createFilestore();
    });

    test('throws an error if the id does not exist.', async (): Promise<void> => {
      await assert.that(async (): Promise<void> => {
        await filestore.getMetadata({ id });
      }).is.throwingAsync((ex: Error): boolean => (ex as CustomError).code === 'EFILENOTFOUND');
    });

    test('return the metadata.', async (): Promise<void> => {
      await filestore.addFile({ id, fileName, contentType, isAuthorized, stream });

      const metadata = await filestore.getMetadata({ id });

      assert.that(metadata).is.equalTo({ id, fileName, contentType, contentLength, isAuthorized });
    });
  });

  suite('getFile', (): void => {
    setup(async (): Promise<void> => {
      filestore = await createFilestore();
    });

    test('throws an error if the id does not exist.', async (): Promise<void> => {
      await assert.that(async (): Promise<void> => {
        await filestore.getFile({ id });
      }).is.throwingAsync((ex: Error): boolean => (ex as CustomError).code === 'EFILENOTFOUND');
    });

    test('return the file stream.', async (): Promise<void> => {
      await filestore.addFile({ id, fileName, contentType, isAuthorized, stream });

      const fileStream = await filestore.getFile({ id });
      const fileData = await streamToString(fileStream);

      assert.that(fileData).is.equalTo(content);
    });
  });

  suite('removeFile', (): void => {
    setup(async (): Promise<void> => {
      filestore = await createFilestore();
    });

    test('throws an error if the id does not exist.', async (): Promise<void> => {
      await assert.that(async (): Promise<void> => {
        await filestore.removeFile({ id });
      }).is.throwingAsync((ex: Error): boolean => (ex as CustomError).code === 'EFILENOTFOUND');
    });

    test('does not throw an error.', async (): Promise<void> => {
      await filestore.addFile({ id, fileName, contentType, isAuthorized, stream });

      await assert.that(async (): Promise<void> => {
        await filestore.removeFile({ id });
      }).is.not.throwingAsync();
    });
  });
};
/* eslint-enable mocha/max-top-level-suites */

export default getTestsFor;
