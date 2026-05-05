import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PoemsService } from './poems.service';
import { CreatePoemDto, UpdatePoemDto } from './dto';

@Controller('poems')
export class PoemsController {
  constructor(private readonly poemsService: PoemsService) {}

  @Get()
  findAll() {
    return this.poemsService.findAll();
  }

  @Get('rating')
  getRating() {
    return this.poemsService.getRating();
  }

  @Get('search')
  search(@Query('title') title: string) {
    return this.poemsService.search(title || '');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poemsService.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreatePoemDto) {
    return this.poemsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePoemDto) {
    return this.poemsService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poemsService.remove(Number(id));
  }
}