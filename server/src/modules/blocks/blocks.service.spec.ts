import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Collection } from '@mikro-orm/core';
import { Block, BlockType } from './entities/block.entity';
import { StepBlock } from '../step-blocks/entities/step-block.entity';
import { CreateBlockDto } from './dto/create-block.dto';

describe('BlocksService - Business Logic', () => {
  let blockService: BlocksService;
  let entityManager: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    const mockEntityManager = {
      create: jest.fn(),
      flush: jest.fn(),
      findOneOrFail: jest.fn(),
      removeAndFlush: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlocksService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    blockService = module.get<BlocksService>(BlocksService);
    entityManager = module.get(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create block', () => {
    it('should create a new block with correct content', async () => {
      const createDto: CreateBlockDto = {
        type: BlockType.VIDEO,
        headline: 'Safety Training Video',
        description: 'Introduction to workplace safety',
        videoUrl: 'https://example.com/safety-training.mp4',
      };

      const mockCreatedBlock: Block = {
        id: 1,
        type: BlockType.VIDEO,
        headline: 'Safety Training Video',
        description: 'Introduction to workplace safety',
        content: { videoUrl: 'https://example.com/safety-training.mp4' },
        stepBlocks: { length: 0 } as Collection<StepBlock, object>,
      };

      entityManager.create.mockReturnValue(mockCreatedBlock);
      entityManager.flush.mockResolvedValue(undefined);

      const result = await blockService.create(createDto);

      expect(entityManager.create).toHaveBeenCalledWith(Block, {
        type: BlockType.VIDEO,
        headline: 'Safety Training Video',
        description: 'Introduction to workplace safety',
        content: { videoUrl: 'https://example.com/safety-training.mp4' },
      });
      expect(entityManager.flush).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedBlock);
    });
  });

  describe('remove block', () => {
    it('should throw BadRequestException when trying to delete a block in use', async () => {
      const mockBlock: Block = {
        id: 2,
        type: BlockType.VIDEO,
        headline: "Equipment Training Video",
        description: "How to use safety equipment",
        content: { videoUrl: "https://example.com/video.mp4" },
        stepBlocks: { length: 2 } as Collection<StepBlock, object>, // Used in 2 steps
      };

      entityManager.findOneOrFail.mockResolvedValue(mockBlock);

      await expect(blockService.remove(2)).rejects.toThrow(BadRequestException);
      await expect(blockService.remove(2)).rejects.toThrow(
        `Cannot delete block "${mockBlock.headline}". It is currently being used in ${mockBlock.stepBlocks.length} step(s).`
      );
      expect(entityManager.removeAndFlush).not.toHaveBeenCalled();
    });

    it('should allow deleting an unused block', async () => {
      const mockBlock: Block = {
        id: 1,
        headline: 'Unused Block',
        type: BlockType.VIDEO,
        content: {},
        stepBlocks: { length: 0 } as Collection<StepBlock, object>, // Empty - not used anywhere
      };

      entityManager.findOneOrFail.mockResolvedValue(mockBlock);
      entityManager.removeAndFlush.mockResolvedValue(undefined);

      await blockService.remove(1);

      expect(entityManager.findOneOrFail).toHaveBeenCalledWith(
        Block,
        { id: 1 },
        { populate: ['stepBlocks'] }
      );
      expect(entityManager.removeAndFlush).toHaveBeenCalledWith(mockBlock);
    });
  });
});
