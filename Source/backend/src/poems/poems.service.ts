import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.module';
import { CreatePoemDto, UpdatePoemDto } from './dto';

@Injectable()
export class PoemsService {
  private readonly logger = new Logger(PoemsService.name);

  constructor(@Inject(DATABASE_POOL) private readonly db: Pool) {}

  async findAll() {
    const result = await this.db.query(`
      SELECT *
      FROM poems_full_view
      ORDER BY id
    `);

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(
      `
      SELECT *
      FROM poems_full_view
      WHERE id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Poem not found');
    }

    return result.rows[0];
  }

  async create(dto: CreatePoemDto) {
    try {
      this.logger.log(`Добавление стихотворения: ${dto.title}`);

      const result = await this.db.query(
        `
        INSERT INTO poems(title, text, author_id, genre_id, rating)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [dto.title, dto.text, dto.author_id, dto.genre_id, dto.rating || null],
      );

      this.logger.log(`Стихотворение успешно добавлено: ${dto.title}`);

      return result.rows[0];
    } catch (error) {
      this.logger.error('Ошибка при добавлении стихотворения', error.stack);
      throw error;
    }
  }

  async update(id: number, dto: UpdatePoemDto) {
    await this.findOne(id);

    const result = await this.db.query(
      `
      UPDATE poems
      SET title = $1,
          text = $2,
          author_id = $3,
          genre_id = $4,
          rating = $5
      WHERE id = $6
      RETURNING *
      `,
      [dto.title, dto.text, dto.author_id, dto.genre_id, dto.rating || null, id],
    );

    return result.rows[0];
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.query('DELETE FROM poems WHERE id = $1', [id]);
    return { message: 'Poem deleted' };
  }

  async getRating() {
    const result = await this.db.query('SELECT * FROM poems_rating_view ORDER BY id');
    return result.rows;
  }

  async search(title: string) {
    const result = await this.db.query('SELECT * FROM search_poems_by_title($1)', [title]);
    return result.rows;
  }
}