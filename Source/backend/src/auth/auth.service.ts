import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Pool } from 'pg';
import { createHash } from 'crypto';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class AuthService {
  constructor(@Inject(DATABASE_POOL) private readonly db: Pool) {}

  private sha256(text: string) {
    return createHash('sha256').update(text).digest('hex');
  }

  async login(login: string, password: string) {
    const passwordHash = this.sha256(password);

    const result = await this.db.query(
      `
      SELECT id, login, password_hash, role
      FROM users_app
      WHERE login = $1
      `,
      [login],
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const user = result.rows[0];

    if (user.password_hash !== passwordHash) {
      throw new UnauthorizedException('Invalid login or password');
    }

    return {
      id: user.id,
      login: user.login,
      role: user.role,
    };
  }
}