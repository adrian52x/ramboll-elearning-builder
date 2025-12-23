import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MikroORM } from '@mikro-orm/core';
import { AppModule } from '../src/app.module';
import { Block, BlockType } from '../src/modules/blocks/entities/block.entity';
import { Universe } from '../src/modules/universes/entities/universe.entity';
import { CreateELearningDto } from '../src/modules/e-learnings/dto/create-e-learning.dto';


describe('E-Learnings API (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;
  let createdELearningId: number;
  let universeId: number;
  let existingBlockId: number;
  let testCreatedBlockIds: number[] = []; // Track blocks created during test

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));

    await app.init();

    orm = moduleFixture.get(MikroORM);

    // Setup: Create a universe for testing
    const em = orm.em.fork();
    const universe = em.create(Universe, { name: 'Test Universe' });
    await em.persistAndFlush(universe);
    universeId = universe.id;

    // Create a reusable block for testing
    const block = em.create(Block, {
      type: BlockType.VIDEO,
      headline: 'Reusable Video Block',
      content: { videoUrl: 'https://example.com/video.mp4' },
    });
    await em.persistAndFlush(block);
    existingBlockId = block.id;
  });

  afterAll(async () => {
    // Clean up test data created in beforeAll
    const em = orm.em.fork();
    
    // Delete the reusable block
    if (existingBlockId) {
      await em.nativeDelete(Block, { id: existingBlockId });
    }
    
    // Delete the test universe
    if (universeId) {
      await em.nativeDelete(Universe, { id: universeId });
    }
    
    await app.close();
  });

  describe('Complete E-Learning Flow', () => {
    it('should create e-learning with 2 steps using new blocks and existing blocks', async () => {
      const eLearningDto: CreateELearningDto = {
        title: 'Workplace Safety Training',
        description: 'Comprehensive safety training for new employees',
        coverImage: 'https://example.com/cover.jpg',
        steps: [
          {
            title: 'Introduction',
            orderIndex: 1,
            stepBlocks: [
              {
                orderIndex: 1,
                newBlock: {
                  type: BlockType.VIDEO,
                  headline: 'Welcome Video',
                  videoUrl: 'https://youtube.com/welcome',
                },
              },
            ],
          },
          {
            title: 'Safety Equipment',
            orderIndex: 2,
            stepBlocks: [
              {
                orderIndex: 1,
                existingBlockId: existingBlockId, // Reuse existing block
              },
              {
                orderIndex: 2,
                newBlock: {
                  type: BlockType.IMAGE,
                  headline: 'Equipment Images',
                  imageUrls: ['helmet.jpg', 'gloves.jpg'],
                },
              },
            ],
          }
        ],
        universeIds: [universeId],
      };

      const response = await request(app.getHttpServer())
        .post('/api/e-learnings')
        .send(eLearningDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.message).toBe('E-learning created successfully');
      
      createdELearningId = response.body.id;
    });

    it('should retrieve e-learning (by ID) with full structure', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/e-learnings/${createdELearningId}`)
        .expect(200);

      // partial matching.
      expect(response.body).toMatchObject({
        id: createdELearningId,
        title: 'Workplace Safety Training',
        description: 'Comprehensive safety training for new employees',
      });

      // Verify steps structure
      expect(response.body.steps).toHaveLength(2);
      expect(response.body.steps[0].title).toBe('Introduction');
      expect(response.body.steps[1].title).toBe('Safety Equipment');

      // Verify blocks are properly linked
      expect(response.body.steps[0].stepBlocks).toHaveLength(1);
      expect(response.body.steps[1].stepBlocks).toHaveLength(2);

      // Track the newly created block IDs for cleanup
      testCreatedBlockIds.push(response.body.steps[0].stepBlocks[0].block.id); // Welcome Video
      testCreatedBlockIds.push(response.body.steps[1].stepBlocks[1].block.id); // Equipment Images

      // Verify existing block was reused
      const reusedBlock = response.body.steps[1].stepBlocks[0].block;
      expect(reusedBlock.id).toBe(existingBlockId);
      expect(reusedBlock.headline).toBe('Reusable Video Block');
    });

    it('should list all e-learnings', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/e-learnings')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const ourELearning = response.body.find(e => e.id === createdELearningId);
      expect(ourELearning).toBeDefined();
      expect(ourELearning.title).toBe('Workplace Safety Training');
    });

    it('should delete e-learning and orphan its blocks', async () => {
      // Delete the e-learning
      await request(app.getHttpServer())
        .delete(`/api/e-learnings/${createdELearningId}`)
        .expect(200);

      // Verify it's deleted
      await request(app.getHttpServer())
        .get(`/api/e-learnings/${createdELearningId}`)
        .expect(404);

      // Verify our test blocks are now orphaned
      const unusedBlocks = await request(app.getHttpServer())
        .get('/api/blocks/unused')
        .expect(200);

      const unusedBlockIds = unusedBlocks.body.map(b => b.id);
      expect(unusedBlockIds).toContain(testCreatedBlockIds[0]); // Welcome Video
      expect(unusedBlockIds).toContain(testCreatedBlockIds[1]); // Equipment Images

      // Clean up: Delete ONLY the blocks we created during this test
      for (const blockId of testCreatedBlockIds) {
        await request(app.getHttpServer())
          .delete(`/api/blocks/${blockId}`)
          .expect(200);
      }
    });
  });

  describe('Validation', () => {
    it('should reject e-learning without steps', async () => {
      const invalidDto = {
        title: 'Invalid E-Learning',
        description: 'Missing steps',
        steps: [],
        universeIds: [universeId],
      };

      await request(app.getHttpServer())
        .post('/api/e-learnings')
        .send(invalidDto)
        .expect(400);
    });

    it('should reject step without blocks', async () => {
      const invalidDto = {
        title: 'Invalid E-Learning',
        description: 'Step without blocks',
        steps: [
          {
            title: 'Empty Step',
            orderIndex: 1,
            stepBlocks: [], // Empty
          },
        ],
        universeIds: [universeId],
      };

      await request(app.getHttpServer())
        .post('/api/e-learnings')
        .send(invalidDto)
        .expect(400);
    });

    it('should reject block assignment without existingBlockId or newBlock', async () => {
      const invalidDto = {
        title: 'Invalid E-Learning',
        description: 'Invalid block assignment',
        steps: [
          {
            title: 'Step 1',
            orderIndex: 1,
            stepBlocks: [
              {
                orderIndex: 1,
                // Neither existingBlockId nor newBlock
              },
            ],
          },
        ],
        universeIds: [universeId],
      };

      await request(app.getHttpServer())
        .post('/api/e-learnings')
        .send(invalidDto)
        .expect(400);
    });
  });
});
