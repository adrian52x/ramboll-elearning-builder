import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';
import { Unit } from './entities/unit.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Unit])],
  controllers: [UnitsController],
  providers: [UnitsService],
  exports: [UnitsService]
})
export class UnitsModule {}
