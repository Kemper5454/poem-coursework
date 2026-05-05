import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';

@Injectable()
export class AuthorsService {
  constructor(@Inject(DATABASE_POOL) private readonly db: Pool) {}

  async findAll() {
    const result = await this.db.query('SELECT * FROM authors ORDER BY id');
    return result.rows;
  }

  async getStats() {
    const result = await this.db.query('SELECT * FROM authors_stats_view ORDER BY id');
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query('SELECT * FROM authors WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException('Author not found');
    }

    return result.rows[0];
  }

  async create(dto: CreateAuthorDto) {
    const result = await this.db.query(
      `INSERT INTO authors(full_name, birth_year, country)
       VALUES($1, $2, $3)
       RETURNING *`,
      [dto.full_name, dto.birth_year || null, dto.country || null],
    );

    return result.rows[0];
  }

  async update(id: number, dto: UpdateAuthorDto) {
    const current = await this.findOne(id);

    const result = await this.db.query(
      `UPDATE authors
       SET full_name = $1, birth_year = $2, country = $3
       WHERE id = $4
       RETURNING *`,
      [
        dto.full_name ?? current.full_name,
        dto.birth_year ?? current.birth_year,
        dto.country ?? current.country,
        id,
      ],
    );

    return result.rows[0];
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.query('DELETE FROM authors WHERE id = $1', [id]);
    return { message: 'Author deleted' };
  }
}