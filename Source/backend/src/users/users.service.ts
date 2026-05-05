import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { createHash } from 'crypto';
import { DATABASE_POOL } from '../database/database.module';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@Inject(DATABASE_POOL) private readonly db: Pool) {}

  private sha256(text: string) {
    return createHash('sha256').update(text).digest('hex');
  }

  async findAll() {
    const result = await this.db.query(
      `
      SELECT id, login, role, name, email, age
      FROM users_app
      ORDER BY id
      `,
    );

    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(
      `
      SELECT id, login, role, name, email, age
      FROM users_app
      WHERE id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('User not found');
    }

    return result.rows[0];
  }

  async create(dto: CreateUserDto) {
    try {
      this.logger.log(`Создание пользователя: ${dto.login}`);

      if (dto.role !== 'admin' && dto.role !== 'user') {
        throw new BadRequestException('Role must be admin or user');
      }

      const passwordHash = this.sha256(dto.password);

      const result = await this.db.query(
        `
        INSERT INTO users_app(login, password_hash, role, name, email, age)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING id, login, role, name, email, age
        `,
        [
          dto.login,
          passwordHash,
          dto.role,
          dto.name || null,
          dto.email || null,
          dto.age || null,
        ],
      );

      this.logger.log(`Пользователь успешно создан: ${dto.login}`);

      return result.rows[0];
    } catch (error) {
      this.logger.error('Ошибка при создании пользователя', error.stack);
      throw error;
    }
  }
}