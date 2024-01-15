import {readFileSync} from 'node:fs';
import path from 'node:path';

function fileRead(filePath: string): string {
  try {
    const resolvedFilePath = path.resolve(filePath);
    return readFileSync(resolvedFilePath, 'utf8');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error reading file at ${filePath}: ${error.message}`);
    } else {
      console.error(`An unknown error occurred while reading file at '${filePath}'.`);
    }
    return '';
  }
}

export {fileRead};
