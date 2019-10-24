import path from 'path';
import fs, { Dirent } from 'fs';

const getFiles = async function ({
  directory,
  recursive = true,
  predicate = (): boolean => true
}: {
  directory: string;
  recursive?: boolean;
  predicate?: (entry: fs.Dirent) => boolean;
}): Promise<string[]> {
  const result = [];
  const entries = await fs.promises.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const entryFullName = path.join(directory, entry.name);

    if (entry.isDirectory() && recursive) {
      result.push(...await getFiles({ directory: entryFullName, predicate, recursive }));
      continue;
    }

    if (!predicate(entry)) {
      continue;
    }

    result.push(entryFullName);
  }

  return result;
};

export { getFiles };
