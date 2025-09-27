/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class BcryptProvider implements HashingProvider {
  /**
   * Hash a plain password
   * @param data string or Buffer
   * @returns hashed string
   */
  public async hashPassword(data: string | Buffer): Promise<string> {
    try {
      const salt = await bcrypt.genSalt();
      return await bcrypt.hash(data.toString(), salt);
    } catch (error) {
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Compare a plain password with an encrypted hash
   * @param data string or Buffer
   * @param encrypted hashed string
   * @returns true if match, false otherwise
   */
  public async comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(data.toString(), encrypted);
    } catch (error) {
      throw new Error('Failed to compare password');
    }
  }
}
