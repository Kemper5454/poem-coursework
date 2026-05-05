import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthorsController],
  providers: [AuthorsService],
})
export class AuthorsModule {}