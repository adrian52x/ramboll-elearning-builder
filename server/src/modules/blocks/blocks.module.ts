import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';
import { Block } from './entities/block.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Block])],
  controllers: [BlocksController],
  providers: [BlocksService],
  exports: [BlocksService],
})
export class BlocksModule {}
