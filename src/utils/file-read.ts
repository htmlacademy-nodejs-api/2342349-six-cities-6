import {readFile} from 'node:fs/promises';
import path from 'node:path';

async function fileRead(filePath: string): Promise<string> {
  try {
    const resolvedFilePath = path.resolve(filePath);
    return readFile(resolvedFilePath, 'utf8');
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
