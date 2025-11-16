import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Controller('api/units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  findAll() {
    return this.unitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.unitsService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateUnitDto) {
    return this.unitsService.create(createDto.name, createDto.universe_id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateUnitDto) {
    return this.unitsService.update(id, updateDto.name!);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.unitsService.remove(id);
  }
}
