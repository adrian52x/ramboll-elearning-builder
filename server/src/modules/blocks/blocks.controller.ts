import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';

@Controller('api/blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post()
  create(@Body() dto: CreateBlockDto) {
    return this.blocksService.create(dto);
  }

  @Get()
  findAll() {
    return this.blocksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blocksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateBlockDto>) {
    return this.blocksService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blocksService.remove(id);
  }
}
