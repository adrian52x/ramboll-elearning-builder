import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UniversesModule } from './modules/universes/universes.module';
import { UnitsModule } from './modules/units/units.module';
import { UsersModule } from './modules/users/users.module';
import { ELearningsModule } from './modules/e-learnings/e-learnings.module';
import config from '../mikro-orm.config';
import { BlocksModule } from './modules/blocks/blocks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MikroOrmModule.forRoot(config),
    UniversesModule,
    UnitsModule,
    UsersModule,
    ELearningsModule,
    BlocksModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
