import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ELearningsService } from './e-learnings.service';
import { CreateELearningDto } from './dto/create-e-learning.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AuthUser } from 'src/common/interfaces/auth.interface';

@Controller('api/e-learnings')
export class ELearningsController {
  constructor(private readonly eLearningsService: ELearningsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() dto: CreateELearningDto) {
    return this.eLearningsService.create(dto);
  }

  /**
   * Get all e-learnings (admin view - no filtering)
   * 
   * Frontend usage:
   * - Admin panel: GET /api/e-learnings
   * - Returns all e-learnings: id, title, description, assigned universes
   */
  @Get()
  findAll() {
    return this.eLearningsService.findAll();
  }

  /**
   * Get e-learnings for current logged-in user's universe
   * 
   * Frontend usage:
   * - User dashboard: GET /api/e-learnings/my
   * - Automatically filters by user's universe
   * - Returns only: id, title, description
   */
  
  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyELearnings(@CurrentUser() user: AuthUser) {
    return this.eLearningsService.findAllByUniverseId(user.universe.id);
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