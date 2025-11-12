import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  findAll() {
    return this.unitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitsService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateUnitDto) {
    return this.unitsService.create(createDto.name, createDto.universe_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateUnitDto) {
    return this.unitsService.update(id, updateDto.name!);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitsService.remove(id);
  }
}
