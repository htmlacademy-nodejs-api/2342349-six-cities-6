import * as crypto from 'node:crypto';

function createSHA(text: string, salt: string): string {
  const shaHash = crypto.createHmac('sha512', salt);
  return shaHash.update(text).digest('hex');
}

export {createSHA};
