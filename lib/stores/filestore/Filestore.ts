import { Metadata } from './Metadata';
import { OwnedAuthorizationOptions } from '../../apis/file/Http/V2/isAuthorized/AuthorizationOptions';
import { Readable } from 'stream';

export interface Filestore {
  addFile (args: {
    id: string;
    fileName: string;
    contentType: string;
    isAuthorized: OwnedAuthorizationOptions;
    stream: Readable;
  }): Promise<void>;

  getMetadata (args: { id: string }): Promise<Metadata>;

  getFile (args: { id: string }): Promise<Readable>;

  removeFile (args: { id: string }): Promise<void>;

  transferOwnership (args: { id: string; to: string }): Promise<void>;

  authorize (args: { id: string; isAuthorized: OwnedAuthorizationOptions }): Promise<void>;
}
