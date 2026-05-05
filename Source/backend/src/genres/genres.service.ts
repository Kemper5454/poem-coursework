import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module';

@Injectable()
export class GenresService {
  constructor(@Inject(DATABASE_POOL) private readonly db: Pool) {}

  async findAll() {
    const result = await this.db.query('SELECT * FROM genres ORDER BY id');
    return result.rows;
  }
}