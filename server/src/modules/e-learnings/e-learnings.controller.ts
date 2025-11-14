import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ELearningsService } from './e-learnings.service';
import { CreateELearningDto } from './dto/create-e-learning.dto';

@Controller('api/e-learnings')
export class ELearningsController {
  constructor(private readonly eLearningsService: ELearningsService) {}

  @Post()
  create(@Body() dto: CreateELearningDto) {
    return this.eLearningsService.create(dto);
  }

  @Get()
  findAll() {
    return this.eLearningsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eLearningsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eLearningsService.remove(id);
  }
}