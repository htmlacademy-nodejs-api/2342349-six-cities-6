export interface CryptoProtocol {
  hashPassword(password: string): Promise<string>;
  verifyPasswordArgon2(hash: string, password: string): Promise<boolean>;
}
