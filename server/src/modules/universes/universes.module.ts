import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UniversesController } from './universes.controller';
import { UniversesService } from './universes.service';
import { Universe } from './entities/universe.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Universe])],
  controllers: [UniversesController],
  providers: [UniversesService],
  exports: [UniversesService],
})
export class UniversesModule {}
