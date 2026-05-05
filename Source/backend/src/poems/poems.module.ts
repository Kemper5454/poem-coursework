import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PoemsController } from './poems.controller';
import { PoemsService } from './poems.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PoemsController],
  providers: [PoemsService],
})
export class PoemsModule {}