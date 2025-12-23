import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MikroORM } from '@mikro-orm/core';
import { AppModule } from '../src/app.module';
import { BlockType, Block } from '../src/modules/blocks/entities/block.entity';

describe('Blocks API (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;
  let createdBlockId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply same validation pipe as main app
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));

    await app.init();

    // Get ORM instance for database cleanup
    orm = moduleFixture.get(MikroORM);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Block CRUD operations', () => {
    it('should create and fetch all blocks including the newly created one', async () => {
      // Create
      const createDto = {
        type: BlockType.VIDEO,
        headline: 'Safety Training Video',
        description: 'Introduction to workplace safety',
        videoUrl: 'https://youtube.com/watch?v=safety123',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/api/blocks')
        .send(createDto)
        .expect(201);

      expect(createResponse.body).toMatchObject({
        type: BlockType.VIDEO,
        headline: 'Safety Training Video',
        content: { videoUrl: 'https://youtube.com/watch?v=safety123' },
      });
      expect(createResponse.body.id).toBeDefined();
      
      createdBlockId = createResponse.body.id;

      // Retrieve all blocks
      const getResponse = await request(app.getHttpServer())
        .get('/api/blocks')
        .expect(200);

      expect(Array.isArray(getResponse.body)).toBe(true);
      const createdBlock = getResponse.body.find(b => b.id === createdBlockId);
      expect(createdBlock).toBeDefined();

    });

    it('should delete unused block then fetch it by ID to verify it is deleted', async () => {
      // Delete it
      await request(app.getHttpServer())
        .delete(`/api/blocks/${createdBlockId}`)
        .expect(200);

      // Verify it's gone by trying to fetch it
      await request(app.getHttpServer())
        .get(`/api/blocks/${createdBlockId}`)
        .expect(404);
    });
  });

  describe('Check Validation', () => {
    it('should reject invalid block type', async () => {
      await request(app.getHttpServer())
        .post('/api/blocks')
        .send({
          type: 'INVALID_TYPE',
          headline: 'Invalid Block',
        })
        .expect(400);
    });

    it('should reject VIDEO block without videoUrl', async () => {
      await request(app.getHttpServer())
        .post('/api/blocks')
        .send({
          type: BlockType.VIDEO,
          headline: 'Video without URL',
        })
        .expect(400);
    });
  });
});
