import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Universe } from '../../modules/universes/entities/universe.entity';
import { Unit } from '../../modules/units/entities/unit.entity';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { ELearning } from '../../modules/e-learnings/entities/e-learning.entity';
import { Step } from '../../modules/steps/entities/step.entity';
import { Block, BlockType } from '../../modules/blocks/entities/block.entity';
import { StepBlock } from '../../modules/step-blocks/entities/step-block.entity';
import { UniverseELearning } from '../../modules/universe-e-learning/entities/universe-e-learning.entity';
import * as bcrypt from 'bcrypt';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Create Universes
    const universe1 = em.create(Universe, {
      name: 'Swedbank group',
    });

    const universe2 = em.create(Universe, {
      name: 'Ejendom Danmark',
    });

    const universe3 = em.create(Universe, {
      name: 'Ramboll group',
    });

    // Create Units for Incept Universe
    const company1 = em.create(Unit, {
      name: 'UnitA-U1',
      universe: universe1,
    });

    const company2 = em.create(Unit, {
      name: 'UnitB-U1',
      universe: universe1,
    });

    // Create Units for Client Universe
    const company3 = em.create(Unit, {
      name: 'UnitX-U2',
      universe: universe2,
    });

    const company4 = em.create(Unit, {
      name: 'UnitY-U2',
      universe: universe2,
    });

    const company5 = em.create(Unit, {
      name: 'Incept',
      universe: universe3,
    });

    // Create Users
    const adminUser = em.create(User, {
      username: 'admin@incept.dk',
      password: await bcrypt.hash('admin123', 10),
      role: UserRole.INCEPT_ADMIN,
      unit: company5,
    });

    const clientUser1 = em.create(User, {
      username: 'user1@company1.com',
      password: await bcrypt.hash('user123', 10),
      role: UserRole.USER,
      unit: company1,
    });

    const clientUser2 = em.create(User, {
      username: 'user2@company1.com',
      password: await bcrypt.hash('user123', 10),
      role: UserRole.USER,
      unit: company1,
    });

    const clientUser3 = em.create(User, {
      username: 'user3@company2.com',
      password: await bcrypt.hash('user123', 10),
      role: UserRole.USER,
      unit: company3,
    });

    // ============================================
    // E-LEARNING 1: Introduction to Sustainability
    // ============================================
    const eLearning1 = em.create(ELearning, {
      title: 'Introduction to Sustainability',
      description: 'Learn the fundamentals of sustainable development and environmental responsibility',
    });

    // Step 1 - What is Sustainability
    const step1 = em.create(Step, {
      eLearning: eLearning1,
      title: 'Understanding Sustainability',
      orderIndex: 1,
    });

    const videoBlock1 = em.create(Block, {
      type: BlockType.VIDEO,
      headline: 'Introduction to Sustainable Development',
      description: 'Watch this overview of sustainability principles',
      content: {
        video_url: 'https://example.com/videos/sustainability-intro.mp4',
      },
    });

    em.create(StepBlock, {
      step: step1,
      block: videoBlock1,
      orderIndex: 1,
    });

    // Step 2 - Key Concepts
    const step2 = em.create(Step, {
      eLearning: eLearning1,
      title: 'Three Pillars of Sustainability',
      orderIndex: 2,
    });

    const imageBlock1 = em.create(Block, {
      type: BlockType.IMAGE,
      headline: 'Environmental, Social, and Economic Pillars',
      description: 'Visual representation of sustainability dimensions',
      content: {
        image_urls: [
          'https://example.com/images/sustainability-pillars.jpg',
          'https://example.com/images/circular-economy.jpg',
          'https://example.com/images/sdg-goals.jpg',
        ],
      },
    });

    const tabsBlock1 = em.create(Block, {
      type: BlockType.INTERACTIVE_TABS,
      headline: 'Sustainability Dimensions',
      description: 'Explore each pillar in detail',
      content: {
        tabs: [
          {
            title: 'Environmental',
            description: 'Protecting natural resources and ecosystems',
            content_url: 'https://example.com/content/environmental.html',
          },
          {
            title: 'Social',
            description: 'Ensuring equity and human wellbeing',
            content_url: 'https://example.com/content/social.html',
          },
          {
            title: 'Economic',
            description: 'Building viable and resilient economies',
            content_url: 'https://example.com/content/economic.html',
          },
        ],
      },
    });

    em.create(StepBlock, {
      step: step2,
      block: imageBlock1,
      orderIndex: 1,
    });

    em.create(StepBlock, {
      step: step2,
      block: tabsBlock1,
      orderIndex: 2,
    });

    // Step 3 - Apply Your Knowledge
    const step3 = em.create(Step, {
      eLearning: eLearning1,
      title: 'Sustainability in Action',
      orderIndex: 3,
    });

    const flipCardsBlock1 = em.create(Block, {
      type: BlockType.FLIP_CARDS,
      headline: 'Sustainable Practices',
      description: 'Match actions with their sustainability benefits',
      content: {
        cards: [
          {
            front: 'Using renewable energy sources',
            back: 'Reduces carbon emissions and dependence on fossil fuels',
          },
          {
            front: 'Implementing circular economy principles',
            back: 'Minimizes waste and maximizes resource efficiency',
          },
          {
            front: 'Promoting biodiversity',
            back: 'Maintains ecosystem health and resilience',
          },
        ],
      },
    });

    const feedbackBlock1 = em.create(Block, {
      type: BlockType.FEEDBACK_ACTIVITY,
      headline: 'Your Sustainability Journey',
      description: 'Share your thoughts',
      content: {
        question: 'What sustainable practices can you implement in your daily work?',
      },
    });

    em.create(StepBlock, {
      step: step3,
      block: flipCardsBlock1,
      orderIndex: 1,
    });

    em.create(StepBlock, {
      step: step3,
      block: feedbackBlock1,
      orderIndex: 2,
    });

    // Assign E-Learning 1 to Universe 1 and Universe 2
    em.create(UniverseELearning, {
      universe: universe1,
      eLearning: eLearning1,
    });

    em.create(UniverseELearning, {
      universe: universe2,
      eLearning: eLearning1,
    });

    // ============================================
    // E-LEARNING 2: Biodiversity and Ecosystems
    // ============================================
    const eLearning2 = em.create(ELearning, {
      title: 'Biodiversity and Ecosystems: Awareness Training for Infrastructure',
      description: 'Understanding the impact of infrastructure projects on biodiversity and ecosystem services',
    });

    // Step 1 - Biodiversity Basics
    const step4 = em.create(Step, {
      eLearning: eLearning2,
      title: 'Why Biodiversity Matters',
      orderIndex: 1,
    });

    const imageBlock2 = em.create(Block, {
      type: BlockType.IMAGE,
      headline: 'Ecosystem Diversity',
      description: 'Examples of diverse ecosystems affected by infrastructure',
      content: {
        image_urls: [
          'https://example.com/images/forest-ecosystem.jpg',
          'https://example.com/images/wetland-biodiversity.jpg',
        ],
      },
    });

    const videoBlock2 = em.create(Block, {
      type: BlockType.VIDEO,
      headline: 'Infrastructure and Nature',
      description: 'How construction impacts local ecosystems',
      content: {
        video_url: 'https://example.com/videos/infrastructure-biodiversity.mp4',
      },
    });

    em.create(StepBlock, {
      step: step4,
      block: imageBlock2,
      orderIndex: 1,
    });

    em.create(StepBlock, {
      step: step4,
      block: videoBlock2,
      orderIndex: 2,
    });

    // Step 2 - Best Practices
    const step5 = em.create(Step, {
      eLearning: eLearning2,
      title: 'Protecting Biodiversity in Projects',
      orderIndex: 2,
    });

    const feedbackBlock2 = em.create(Block, {
      type: BlockType.FEEDBACK_ACTIVITY,
      headline: 'Biodiversity Action Plan',
      description: 'Reflect on mitigation strategies',
      content: {
        question: 'What measures can you take to minimize biodiversity impact in your projects?',
      },
    });

    em.create(StepBlock, {
      step: step5,
      block: feedbackBlock2,
      orderIndex: 1,
    });

    // Assign E-Learning 2 to Universe 3
    em.create(UniverseELearning, {
      universe: universe3,
      eLearning: eLearning2,
    });

    // ============================================
    // E-LEARNING 3: Carbon Footprint and GHG Emissions
    // ============================================
    const eLearning3 = em.create(ELearning, {
      title: 'Carbon Footprint and Greenhouse Gas Emissions',
      description: 'Understanding and reducing carbon emissions in infrastructure and construction',
    });

    // Step 1 - Understanding Carbon Footprint
    const step6 = em.create(Step, {
      eLearning: eLearning3,
      title: 'What is a Carbon Footprint?',
      orderIndex: 1,
    });

    const videoBlock3 = em.create(Block, {
      type: BlockType.VIDEO,
      headline: 'Carbon Emissions Explained',
      description: 'Learn about greenhouse gases and climate impact',
      content: {
        video_url: 'https://example.com/videos/carbon-footprint-basics.mp4',
      },
    });

    em.create(StepBlock, {
      step: step6,
      block: videoBlock3,
      orderIndex: 1,
    });

    // Step 2 - Measuring Emissions
    const step7 = em.create(Step, {
      eLearning: eLearning3,
      title: 'Calculating Project Emissions',
      orderIndex: 2,
    });

    const tabsBlock2 = em.create(Block, {
      type: BlockType.INTERACTIVE_TABS,
      headline: 'Emission Scopes',
      description: 'Understanding Scope 1, 2, and 3 emissions',
      content: {
        tabs: [
          {
            title: 'Scope 1',
            description: 'Direct emissions from owned sources',
            content_url: 'https://example.com/content/scope1.html',
          },
          {
            title: 'Scope 2',
            description: 'Indirect emissions from purchased energy',
            content_url: 'https://example.com/content/scope2.html',
          },
          {
            title: 'Scope 3',
            description: 'All other indirect emissions in value chain',
            content_url: 'https://example.com/content/scope3.html',
          },
        ],
      },
    });

    const imageBlock3 = em.create(Block, {
      type: BlockType.IMAGE,
      headline: 'Carbon Reduction Strategies',
      description: 'Visual guide to emission reduction methods',
      content: {
        image_urls: [
          'https://example.com/images/renewable-energy.jpg',
          'https://example.com/images/carbon-capture.jpg',
          'https://example.com/images/efficient-transport.jpg',
        ],
      },
    });

    em.create(StepBlock, {
      step: step7,
      block: tabsBlock2,
      orderIndex: 1,
    });

    em.create(StepBlock, {
      step: step7,
      block: imageBlock3,
      orderIndex: 2,
    });

    // Step 3 - Reduction Strategies
    const step8 = em.create(Step, {
      eLearning: eLearning3,
      title: 'Taking Action on Climate',
      orderIndex: 3,
    });

    const flipCardsBlock2 = em.create(Block, {
      type: BlockType.FLIP_CARDS,
      headline: 'Carbon Reduction Actions',
      description: 'Practical steps to reduce emissions',
      content: {
        cards: [
          {
            front: 'Switch to renewable energy',
            back: 'Reduces Scope 2 emissions from electricity consumption',
          },
          {
            front: 'Optimize material use',
            back: 'Reduces embodied carbon in construction materials',
          },
          {
            front: 'Improve logistics efficiency',
            back: 'Minimizes transportation emissions (Scope 3)',
          },
        ],
      },
    });

    const feedbackBlock3 = em.create(Block, {
      type: BlockType.FEEDBACK_ACTIVITY,
      headline: 'Your Carbon Commitment',
      description: 'Share your emission reduction ideas',
      content: {
        question: 'What carbon reduction strategies are most feasible for your projects?',
      },
    });

    em.create(StepBlock, {
      step: step8,
      block: flipCardsBlock2,
      orderIndex: 1,
    });

    em.create(StepBlock, {
      step: step8,
      block: feedbackBlock3,
      orderIndex: 2,
    });

    // E-Learning 3 is NOT assigned to any universe (unassigned course)

    // Persist all entities in a single transaction
    await em.persistAndFlush([
      universe1,
      universe2,
      universe3,
      company1,
      company2,
      company3,
      company4,
      company5,
      adminUser,
      clientUser1,
      clientUser2,
      clientUser3,
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('---');
    console.log('Created 3 universes:');
    console.log('  - Swedbank group (with Unit1-U1, Unit2-U1)');
    console.log('  - Ejendom Danmark (with Unit1-U2, Unit2-U2)');
    console.log('  - Ramboll group (with Incept)');
    console.log('---');
    console.log('Created 4 users:');
    console.log('  - admin@incept.dk / admin123 (Incept Admin)');
    console.log('  - user1@company1.com / user123 (Regular User)');
    console.log('  - user2@company1.com / user123 (Regular User)');
    console.log('  - user3@company2.com / user123 (Regular User)');
    console.log('---');
    console.log('Created 3 sustainability e-learnings:');
    console.log('  1. Introduction to Sustainability (3 steps, 5 blocks) → Universe 1 & 2');
    console.log('  2. Biodiversity and Ecosystems (2 steps, 3 blocks) → Universe 3');
    console.log('  3. Carbon Footprint and GHG Emissions (3 steps, 5 blocks) → Unassigned');
  }
}
