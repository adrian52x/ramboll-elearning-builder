import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (configService: ConfigService): DataSourceOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: configService.get<string>('NODE_ENV') === 'development', // disable in production
  logging: configService.get<string>('NODE_ENV') === 'development',
});

// For TypeORM CLI (migrations)
export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'dev',
  password: process.env.DB_PASSWORD || 'dev',
  database: process.env.DB_NAME || 'ramboll-elearning',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: false, // always false for CLI
});
