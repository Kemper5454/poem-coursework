import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  findAll() {
    return this.authorsService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.authorsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorsService.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateAuthorDto) {
    return this.authorsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAuthorDto) {
    return this.authorsService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorsService.remove(Number(id));
  }
}