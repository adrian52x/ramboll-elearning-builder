import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UniversesModule } from './modules/universes/universes.module';
import { UnitsModule } from './modules/units/units.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { getTypeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    // Config module to load .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TypeORM module with async config
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getTypeOrmConfig(configService),
    }),
    UniversesModule,
    UnitsModule,
    UsersModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
