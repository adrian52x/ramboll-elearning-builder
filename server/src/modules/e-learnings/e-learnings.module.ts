import { Module } from '@nestjs/common';
import { ELearningsController } from './e-learnings.controller';
import { ELearningsService } from './e-learnings.service';

@Module({
  controllers: [ELearningsController],
  providers: [ELearningsService]
})
export class ELearningsModule {}
