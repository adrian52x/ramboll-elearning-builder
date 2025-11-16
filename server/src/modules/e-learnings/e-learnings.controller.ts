import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { ELearningsService } from './e-learnings.service';
import { CreateELearningDto } from './dto/create-e-learning.dto';

@Controller('api/e-learnings')
export class ELearningsController {
  constructor(private readonly eLearningsService: ELearningsService) {}

  @Post()
  create(@Body() dto: CreateELearningDto) {
    return this.eLearningsService.create(dto);
  }

  /**
   * Get all e-learnings (admin view or filtered by universe)
   * Query param: ?universeId=1 (optional, simulates logged-in user's universe)
   * 
   * Frontend usage:
   * - List view: GET /api/e-learnings?universeId=1 (returns light data)
   * - Returns only: id, title, description, assigned universes
   */
  @Get()
  findAll(@Query('universeId', new ParseIntPipe({ optional: true })) universeId?: number) {
    if (universeId) {
      return this.eLearningsService.findAllByUniverseId(universeId);
    }
    return this.eLearningsService.findAll();
  }

  /**
   * Get single e-learning with full details (detail view)
   * 
   * Frontend usage:
   * - Detail view: GET /api/e-learnings/1
   * - Returns: full e-learning with steps, blocks (in order), universes
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eLearningsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eLearningsService.remove(id);
  }
}