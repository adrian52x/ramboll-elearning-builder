import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { UniversesService } from './universes.service';
import { CreateUniverseDto } from './dto/create-universe.dto';
import { UpdateUniverseDto } from './dto/update-universe.dto';

@Controller('universes')
export class UniversesController {
  constructor(private readonly universesService: UniversesService) {}

  @Get()
  findAll() {
    return this.universesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.universesService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateUniverseDto) {
    return this.universesService.create(createDto.name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateUniverseDto) {
    return this.universesService.update(id, updateDto.name!);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.universesService.remove(id);
  }
}
