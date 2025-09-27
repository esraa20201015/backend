import { Injectable } from '@nestjs/common';

@Injectable()
export class SignOutProvider {
  private readonly tokenBlacklist = new Set<string>();

  public signOut(token: string): { message: string } {
    this.tokenBlacklist.add(token);
    return { message: 'Successfully signed out' };
  }

  public isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }
}
