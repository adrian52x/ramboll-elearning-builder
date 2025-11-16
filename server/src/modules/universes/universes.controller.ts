import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { UniversesService } from './universes.service';
import { CreateUniverseDto } from './dto/create-universe.dto';
import { UpdateUniverseDto } from './dto/update-universe.dto';

@Controller('api/universes')
export class UniversesController {
  constructor(private readonly universesService: UniversesService) {}

  @Get()
  findAll() {
    return this.universesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.universesService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateUniverseDto) {
    return this.universesService.create(createDto.name);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateUniverseDto) {
    return this.universesService.update(id, updateDto.name!);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.universesService.remove(id);
  }
}
