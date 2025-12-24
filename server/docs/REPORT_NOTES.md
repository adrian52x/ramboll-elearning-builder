# Academic Report Notes - E-Learning Content Authoring System

## 1. PROJECT CLASSIFICATION & SCOPE

### 1.1 System Type
- **Primary Classification**: E-Learning Content Authoring Platform
- **Alternative Terms**: 
  - Digital Learning Content Management System
  - Course Authoring Tool
  - Modular Learning Builder
- **Domain**: Educational Technology (EdTech)
- **User Base**: Content creators, instructional designers, course authors
- **NOT**: Learning Management System (LMS), Student-facing platform, Assessment engine

### 1.2 Core Value Proposition
Enable non-technical users to create structured, interactive e-learning content through a visual, block-based interface without programming knowledge.

### 1.3 Industry Context
**Similar Commercial Tools:**
- Articulate Rise (closest equivalent)
- Adobe Captivate Draft
- iSpring Page
- H5P (open-source)

**Key Differentiation:**
- Custom-built for organizational needs
- Tight integration with specific delivery infrastructure
- No SCORM export (content lives in database)
- Simplified, focused feature set

---

## 2. ARCHITECTURAL DECISIONS

### 2.1 Technology Stack Selection

#### Backend: NestJS (Node.js Framework)
**Rationale:**
- TypeScript-first framework (type safety across full stack)
- Modular architecture aligns with DDD principles
- Built-in dependency injection
- Excellent decorator-based validation (class-validator)
- Strong enterprise adoption and community support
- Native support for testing (Jest)

**Alternatives Considered:**
- Express.js: Too minimal, requires more boilerplate
- Django/Flask: Python stack, different ecosystem
- Spring Boot: Java, heavier runtime

#### Frontend: Next.js (React Framework)
**Rationale:**
- Server-side rendering (SSR) for better initial load
- File-based routing (developer experience)
- React 19 with concurrent features
- TypeScript integration
- Built-in API routes (not used, but available)
- Excellent developer tooling

**Alternatives Considered:**
- Create React App: Deprecated, no SSR
- Vite + React: Client-side only
- Vue/Angular: Different paradigm

#### Database: PostgreSQL
**Rationale:**
- Robust relational model for hierarchical content structure
- ACID compliance (data integrity)
- JSON/JSONB support for flexible content storage
- Excellent ORM support
- Industry standard for enterprise applications

**Why NOT NoSQL:**
- Complex relationships (7+ entities)
- Need for referential integrity
- Structured hierarchy (Universe → E-Learning → Unit → Step → Block)

### 2.2 ORM Choice: MikroORM (Migration from TypeORM)

**Original Choice: TypeORM**
- Most popular Node.js ORM
- Good TypeScript support

**Migration to MikroORM:**
**Reasons for Switch:**
1. **Unit of Work Pattern**: Automatic change tracking (more efficient)
2. **Better TypeScript Support**: Metadata reflection without experimental decorators
3. **Active Development**: More modern architecture
4. **Migration System**: Better CLI tools
5. **Identity Map**: Prevents duplicate entity instances

**Technical Benefits:**
```typescript
// MikroORM automatically tracks changes
const block = await em.findOne(Block, { id });
block.headline = "Updated"; // Change tracked
await em.flush(); // Only updates changed fields

// TypeORM requires explicit save
const block = await repo.findOne({ where: { id } });
block.headline = "Updated";
await repo.save(block); // Saves all fields
```

**Trade-offs:**
- Smaller community vs TypeORM
- Less Stack Overflow answers
- Learning curve for team members

---

## 3. DATA MODEL & ARCHITECTURE

### 3.1 Entity Relationship Model

**Hierarchy:**
```
Universe (Learning Domain/Organization)
  ├── Unit (Department/Team)
  │   └── User (Content Creator/Admin)
  └── UniverseELearning (Junction Table)
      └── E-Learning (Course)
          └── Step (Lesson/Page)
              └── StepBlock (Junction Table)
                  └── Block (Content Component - REUSABLE)
```

**Key Design Decisions:**

#### 3.1.1 Block Reusability
**Decision:** Blocks are independent entities, linked via junction table (StepBlock)

**Rationale:**
- Single source of truth for content
- Update once, reflect everywhere
- Reduce content duplication
- Easier content management

**Implementation:**
```typescript
@Entity()
class Block {
  @OneToMany(() => StepBlock, stepBlock => stepBlock.block)
  stepBlocks: StepBlock[]; // Many steps can use same block
}

@Entity()
class StepBlock {
  @ManyToOne(() => Step)
  step: Step;
  
  @ManyToOne(() => Block)
  block: Block;
  
  @Property()
  orderIndex: number; // Order within step
}
```

**Trade-off:**
- **Pro**: Content reuse, easier updates
- **Con**: Deleting used blocks could break courses (mitigated with foreign key checks)

#### 3.1.2 Many-to-Many: Universe ↔ E-Learning
**Decision:** Explicit junction entity (UniverseELearning) instead of implicit ManyToMany

**Rationale:**
- Future extensibility (can add assignment metadata)
- Explicit control over cascade behavior
- Better query performance

**Implementation:**
```typescript
@Entity()
class UniverseELearning {
  @ManyToOne(() => Universe)
  universe: Universe;
  
  @ManyToOne(() => ELearning)
  eLearning: ELearning;
  
  @Property()
  assignedAt: Date; // Metadata example
}
```

### 3.2 Content Storage Strategy

#### JSON Storage for Block Content
**Decision:** Store type-specific block content as JSON in single `content` field

**Rationale:**
- Flexibility: Easy to add new block types
- Simplicity: Single table for all block types
- Query Performance: Don't need to join multiple tables
- Schema Evolution: No migrations for new content fields

**Implementation:**
```typescript
@Entity()
class Block {
  @Enum(() => BlockType)
  type: BlockType; // 'video' | 'image' | 'flip_cards' | etc.
  
  @Property({ type: 'json' })
  content: Record<string, any>; // Type-specific data
}
```

**Content Examples:**
```json
// VIDEO
{ "videoUrl": "https://..." }

// FLIP_CARDS
{ "cards": [{ "front": "Q", "back": "A" }] }

// INTERACTIVE_TABS
{ "tabs": [{ "title": "Tab 1", "contentUrl": "..." }] }
```

**Trade-offs:**
- **Pro**: Flexible, extensible, no schema migrations
- **Con**: No database-level validation, requires application-level validation

**Alternative Considered: Single Table Inheritance (STI)**
```typescript
class Block { /* common fields */ }
class VideoBlock extends Block { videoUrl: string; }
class ImageBlock extends Block { imageUrls: string[]; }
```
**Rejected because:**
- More complex ORM configuration
- Requires migrations for new block types
- Harder to query across all blocks

### 3.3 Ordering Strategy

**Decision:** Explicit `orderIndex` integer field

**Implementation:**
```typescript
@Entity()
class Step {
  @Property()
  orderIndex: number; // Position within e-learning
  
  @ManyToOne(() => ELearning)
  eLearning: ELearning;
}

@Entity()
class StepBlock {
  @Property()
  orderIndex: number; // Position within step
  
  @ManyToOne(() => Step)
  step: Step;
}
```

**Constraints:**
```typescript
@Unique({ properties: ['step', 'orderIndex'] }) // Each step has unique order
@Unique({ properties: ['eLearning', 'orderIndex'] }) // Each e-learning has unique step order
```

**Rationale:**
- Simple to implement
- Easy to query (`ORDER BY orderIndex`)
- UI can display/edit directly

**Known Limitation:**
- Reordering requires updating multiple records
- Potential race conditions (not addressed in v1)

**Future Enhancement (noted in to-do):**
- Optimistic locking
- Fractional indexing (1, 2, 2.5, 3...)

---

## 4. API DESIGN & VALIDATION

### 4.1 RESTful API Structure

**Convention:**
```
/api/{resource}
/api/{resource}/{id}
/api/{resource}/{id}/{nested-resource}
```

**Examples:**
```
GET    /api/blocks              - List all blocks
GET    /api/blocks/unused       - Custom query
GET    /api/blocks/{id}         - Get one block
POST   /api/blocks              - Create block
PATCH  /api/blocks/{id}         - Update block (not implemented)
DELETE /api/blocks/{id}         - Delete block

POST   /api/e-learnings         - Create full e-learning
GET    /api/e-learnings/{id}    - Get with full hierarchy
DELETE /api/e-learnings/{id}    - Cascade delete
```

### 4.2 DTO (Data Transfer Object) Pattern

**Decision:** Separate DTOs for requests and responses

**Request DTOs (class-validator):**
```typescript
export class CreateBlockDto {
  @IsEnum(BlockType)
  type!: BlockType;
  
  @IsString()
  @IsNotEmpty()
  headline!: string;
  
  @ValidateIf(o => o.type === BlockType.VIDEO)
  @IsUrl()
  videoUrl?: string;
  
  @ValidateIf(o => o.type === BlockType.FLIP_CARDS)
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  cards?: CardDto[];
}
```

**Benefits:**
- Runtime validation (blocks invalid data at API boundary)
- Type safety (TypeScript compile-time)
- Conditional validation (type-specific fields)
- Automatic error responses (400 Bad Request)

**Response DTOs (TypeScript interfaces):**
```typescript
// Frontend types mirror backend entities
export interface Block {
  id: number;
  type: BlockType;
  headline: string;
  content: Record<string, any>;
}
```

### 4.3 Nested Entity Creation

**Challenge:** Create entire e-learning hierarchy in single request

**Solution:** Nested DTOs with complex validation

```typescript
export class CreateELearningDto {
  @IsString()
  title!: string;
  
  @ValidateNested({ each: true })
  @Type(() => CreateStepDto)
  steps!: CreateStepDto[]; // Array of steps
  
  @IsArray()
  @IsInt({ each: true })
  universeIds!: number[]; // Assign to universes
}

export class CreateStepDto {
  @IsString()
  title!: string;
  
  @IsInt()
  @Min(0)
  orderIndex!: number;
  
  @ValidateNested({ each: true })
  @Type(() => BlockAssignmentDto)
  stepBlocks!: BlockAssignmentDto[]; // Blocks in step
}

export class BlockAssignmentDto {
  @ValidateIf(o => !o.newBlock)
  @IsInt()
  existingBlockId?: number; // Reuse existing
  
  @ValidateIf(o => !o.existingBlockId)
  @ValidateNested()
  @Type(() => CreateBlockDto)
  newBlock?: CreateBlockDto; // Create new
}
```

**Key Feature: Block Flexibility**
Each step can:
1. Reference existing block (`existingBlockId`)
2. Create new block inline (`newBlock`)
3. Mix both approaches

**Backend Processing:**
```typescript
async create(dto: CreateELearningDto) {
  const eLearning = this.em.create(ELearning, { /* basic fields */ });
  
  for (const stepDto of dto.steps) {
    const step = this.em.create(Step, { eLearning, ...stepDto });
    
    for (const blockDto of stepDto.stepBlocks) {
      let block;
      if (blockDto.existingBlockId) {
        block = await this.em.findOneOrFail(Block, blockDto.existingBlockId);
      } else {
        block = this.em.create(Block, buildBlockContent(blockDto.newBlock));
      }
      this.em.create(StepBlock, { step, block, orderIndex: blockDto.orderIndex });
    }
  }
  
  await this.em.flush(); // Single transaction
}
```

**Benefits:**
- Atomic creation (all-or-nothing)
- Single HTTP request
- Reduced network overhead
- Better UX (no multi-step form submission)

---

## 5. FILE UPLOAD & STORAGE

### 5.1 Storage Strategy: MinIO (S3-Compatible)

**Decision:** Use MinIO instead of local filesystem

**Rationale:**
- **Development/Production Parity**: Same API in both environments
- **Scalability**: Easy migration to AWS S3/Azure Blob
- **CDN Integration**: Direct URL access to files
- **Docker-friendly**: Containerized storage
- **S3 Compatibility**: Standard API, lots of tooling

**Configuration:**
```typescript
export class StorageConfig {
  private s3Client: S3Client;
  
  constructor(configService: ConfigService) {
    this.s3Client = new S3Client({
      endpoint: 'http://localhost:9000', // MinIO in dev
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'minioadmin',
        secretAccessKey: 'minioadmin',
      },
      forcePathStyle: true, // Required for MinIO
    });
  }
}
```

### 5.2 Upload Flow

**Frontend:**
```typescript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/uploads', {
  method: 'POST',
  body: formData,
});

const { url } = await response.json();
// Use URL in block content
```

**Backend (Multer Middleware):**
```typescript
@Post()
@UseInterceptors(FileInterceptor('file'))
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  // 1. Validate file type
  const allowedTypes = ['image/jpeg', 'video/mp4', ...];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new BadRequestException('Invalid file type');
  }
  
  // 2. Validate size (500MB max)
  if (file.size > 500 * 1024 * 1024) {
    throw new BadRequestException('File too large');
  }
  
  // 3. Generate unique filename
  const fileName = `${uuidv4()}.${extension}`;
  
  // 4. Upload to MinIO
  await s3Client.send(new PutObjectCommand({
    Bucket: 'elearning-resources',
    Key: `uploads/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));
  
  // 5. Return public URL
  return { url: `http://localhost:9000/bucket/uploads/${fileName}` };
}
```

**Key Features:**
- UUID filenames (prevent collisions)
- Type validation (images/videos only)
- Size limits (500MB)
- Public read access (bucket policy)
- Direct URL access (no download endpoint needed)

### 5.3 Bucket Auto-Creation

**Problem:** MinIO bucket might not exist on first run

**Solution:** Lazy initialization
```typescript
async ensureBucketExists() {
  try {
    await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
  } catch {
    // Bucket doesn't exist, create it
    await this.s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    await this.setPublicReadPolicy(); // Make files publicly accessible
  }
}
```

**Called on service initialization:**
```typescript
constructor(configService: ConfigService) {
  this.storageConfig = new StorageConfig(configService);
  this.init(); // Ensures bucket exists
}
```

---

## 6. FRONTEND ARCHITECTURE

### 6.1 State Management Strategy

**Decision:** React Query (TanStack Query) instead of Redux/Zustand

**Rationale:**
- **Server State Focus**: App is mostly CRUD operations
- **Built-in Caching**: Reduces API calls
- **Automatic Refetching**: Keeps data fresh
- **Optimistic Updates**: Better UX
- **Loading/Error States**: Declarative handling
- **DevTools**: Excellent debugging

**No Local State Library Needed:**
- Form state: React useState (temporary, component-scoped)
- No complex client-side business logic
- No cross-component shared state (except server data)

**Example Usage:**
```typescript
// Query (GET)
const { data: blocks, isLoading } = useQuery({
  queryKey: ['blocks'],
  queryFn: BlockAPI.getAllBlocks,
});

// Mutation (POST/DELETE)
const createMutation = useMutation({
  mutationFn: (data) => ELearningAPI.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries(['e-learnings']); // Refresh list
    router.push('/'); // Navigate
  },
});
```

### 6.2 Component Architecture

**Structure:**
```
components/
  ├── cards/                     # Reusable card displays
  │   ├── block-card.tsx
  │   ├── e-learning-card.tsx
  │   └── json-output-card.tsx
  ├── block-modal-forms/         # Type-specific block forms
  │   ├── VideoBlockForm.tsx
  │   ├── FlipCardsForm.tsx
  │   └── index.ts
  ├── create-elearning-tabs/     # Wizard steps
  │   ├── BasicInfoTab.tsx
  │   ├── StructureTab.tsx
  │   └── UniversesTab.tsx
  ├── preview/                   # Content preview
  │   ├── BlockPreview.tsx
  │   └── block-renderers/
  └── ui/                        # Shadcn components
```

**Design Pattern: Composition**
```typescript
<BlockModal
  type={BlockType.FLIP_CARDS}
  onSubmit={handleAddBlock}
>
  {/* Form dynamically rendered based on type */}
</BlockModal>
```

### 6.3 Form Handling Strategy

**Decision:** Controlled components with useState (no Formik/React Hook Form)

**Rationale:**
- Forms are relatively simple
- Custom validation logic (type-dependent)
- Direct control over state
- Less dependencies

**Example:**
```typescript
function FlipCardsForm({ cards, onCardsChange }) {
  const [localCards, setLocalCards] = useState(cards || []);
  
  const addCard = () => {
    setLocalCards([...localCards, { front: '', back: '' }]);
  };
  
  const updateCard = (index, field, value) => {
    const updated = [...localCards];
    updated[index][field] = value;
    setLocalCards(updated);
    onCardsChange(updated); // Lift state up
  };
  
  return (/* JSX */);
}
```

**Trade-off:**
- **Pro**: Simple, explicit, no learning curve
- **Con**: More boilerplate for complex forms

### 6.4 Type Safety Across Stack

**Strategy:** Shared TypeScript types (manual sync)

**Frontend Types:**
```typescript
// types/api-responses.ts
export interface Block {
  id: number;
  type: BlockType;
  headline: string;
  content: Record<string, any>;
}

// types/api-requests.ts
export interface CreateBlockDto {
  type: BlockType;
  headline: string;
  videoUrl?: string; // Type-specific
  cards?: CardDto[];
}
```

**Backend Types:**
```typescript
// entities/block.entity.ts
@Entity()
export class Block {
  @PrimaryKey()
  id!: number;
  
  @Enum(() => BlockType)
  type!: BlockType;
}

// dto/create-block.dto.ts
export class CreateBlockDto {
  @IsEnum(BlockType)
  type!: BlockType;
  
  @ValidateIf(o => o.type === 'video')
  @IsUrl()
  videoUrl?: string;
}
```

**Synchronization:**
- **Manual**: Copy enum definitions
- **Risk**: Types can drift
- **Mitigation**: E2E tests, runtime validation

**Future Enhancement (not implemented):**
- Shared types package
- tRPC (automatic type sync)
- GraphQL with code generation

---

## 7. TESTING STRATEGY

### 7.1 End-to-End Tests (Jest + Supertest)

**Coverage:**
- `blocks.e2e-spec.ts`: Block CRUD operations
- `e-learnings.e2e-spec.ts`: Full e-learning creation flow

**Example:**
```typescript
describe('E-Learnings API (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;
  
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // Same as production
    await app.init();
    
    orm = module.get(MikroORM);
  });
  
  it('should create e-learning with nested structure', async () => {
    const dto = {
      title: 'Test Course',
      steps: [
        {
          title: 'Step 1',
          stepBlocks: [
            { newBlock: { type: 'video', headline: 'Intro', videoUrl: '...' } },
            { existingBlockId: 1 },
          ],
        },
      ],
      universeIds: [1],
    };
    
    return request(app.getHttpServer())
      .post('/api/e-learnings')
      .send(dto)
      .expect(201)
      .expect(res => {
        expect(res.body.id).toBeDefined();
        expect(res.body.steps).toHaveLength(1);
      });
  });
});
```

**Benefits:**
- Tests actual HTTP layer
- Validates entire stack
- Catches integration issues

### 7.2 Unit Tests (Partial Implementation)

**Coverage:**
- `blocks.service.spec.ts`: Business logic for block deletion

**Example:**
```typescript
describe('BlocksService - Business Logic', () => {
  it('should prevent deletion of blocks in use', async () => {
    const block = {
      id: 1,
      stepBlocks: [{ id: 1 }], // Block is used
    };
    entityManager.findOneOrFail.mockResolvedValue(block);
    
    await expect(service.remove(1)).rejects.toThrow(BadRequestException);
  });
  
  it('should allow deletion of unused blocks', async () => {
    const block = { id: 1, stepBlocks: [] }; // Not used
    entityManager.findOneOrFail.mockResolvedValue(block);
    
    await expect(service.remove(1)).resolves.not.toThrow();
  });
});
```

### 7.3 Testing Gaps (Noted for Future)

**Missing:**
- Frontend component tests (React Testing Library)
- Integration tests with test database
- Performance tests
- Security tests (SQL injection, XSS)

**Rationale for Limited Testing:**
- Time constraints (bachelor project scope)
- Focus on core functionality demonstration
- E2E tests cover critical paths

---

## 8. DESIGN PATTERNS & BEST PRACTICES

### 8.1 Dependency Injection (NestJS)

**Pattern:** Constructor injection with TypeScript decorators

```typescript
@Injectable()
export class BlocksService {
  constructor(
    private readonly em: EntityManager, // Auto-injected by NestJS
  ) {}
}

@Module({
  providers: [BlocksService],
  exports: [BlocksService],
})
export class BlocksModule {}
```

**Benefits:**
- Testability (easy to mock dependencies)
- Loose coupling (services don't create dependencies)
- Single Responsibility (services focus on business logic)

### 8.2 Repository Pattern (via EntityManager)

**MikroORM Approach:**
```typescript
// No explicit repository classes
// EntityManager acts as generic repository

async findOne(id: number): Promise<Block> {
  return this.em.findOneOrFail(Block, { id }); // Built-in method
}

async create(dto: CreateBlockDto): Promise<Block> {
  const block = this.em.create(Block, dto); // Creates entity
  await this.em.flush(); // Persists to DB
  return block;
}
```

**Alternative (TypeORM style):**
```typescript
@InjectRepository(Block)
private blockRepo: Repository<Block>;

this.blockRepo.findOne({ where: { id } });
```

**Decision Rationale:**
- EntityManager is more flexible (Unit of Work pattern)
- Fewer classes to maintain
- Consistent API across all entities

### 8.3 DTO Validation Pattern

**Decorator-based Validation:**
```typescript
export class CreateBlockDto {
  @IsEnum(BlockType)
  type!: BlockType;
  
  // Conditional validation based on type
  @ValidateIf(o => o.type === BlockType.VIDEO)
  @IsUrl()
  videoUrl?: string;
  
  @ValidateIf(o => o.type === BlockType.FLIP_CARDS)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  cards?: CardDto[];
}
```

**Automatic Error Handling:**
```typescript
// NestJS ValidationPipe in main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,        // Strip unknown properties
  transform: true,        // Auto-transform to DTO types
  forbidNonWhitelisted: true, // Throw on unknown props
}));
```

**Result:**
- Invalid requests return 400 with detailed errors
- No manual validation in controllers
- Type safety + runtime safety

### 8.4 Builder Pattern for Block Content

**Problem:** Different block types have different content structures

**Solution:** Content builder utility
```typescript
export function buildBlockContent(dto: CreateBlockDto): Record<string, any> {
  switch (dto.type) {
    case BlockType.VIDEO:
      return { videoUrl: dto.videoUrl };
    
    case BlockType.IMAGE:
      return { imageUrls: dto.imageUrls };
    
    case BlockType.INTERACTIVE_TABS:
      return { tabs: dto.tabs };
    
    case BlockType.FLIP_CARDS:
      return { cards: dto.cards };
    
    case BlockType.FEEDBACK_ACTIVITY:
      return { 
        question: dto.question,
        feedbackOptions: dto.feedbackOptions,
        correctAnswers: dto.correctAnswers,
      };
    
    default:
      throw new BadRequestException(`Unknown block type: ${dto.type}`);
  }
}
```

**Usage:**
```typescript
async create(dto: CreateBlockDto): Promise<Block> {
  const content = buildBlockContent(dto); // Centralized logic
  const block = this.em.create(Block, { ...dto, content });
  await this.em.flush();
  return block;
}
```

**Benefits:**
- Single source of truth for content structure
- Easy to add new block types
- Type-safe (TypeScript ensures all cases covered)

---

## 9. SECURITY CONSIDERATIONS

### 9.1 Implemented Security Measures

#### Input Validation
```typescript
// DTO-level validation
@IsString()
@IsNotEmpty()
title!: string;

@IsUrl()
videoUrl?: string;

// File upload validation
if (!allowedMimeTypes.includes(file.mimetype)) {
  throw new BadRequestException('Invalid file type');
}

if (file.size > 500 * 1024 * 1024) {
  throw new BadRequestException('File too large');
}
```

#### SQL Injection Prevention
- ORM-based queries (parameterized)
- No raw SQL queries
- EntityManager escapes inputs

#### CORS Configuration
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
});
```

### 9.2 Authentication System (JWT)

**Implementation:**
```typescript
@Post('login')
async login(@Body() dto: LoginDto) {
  const user = await this.authService.validateUser(dto.email, dto.password);
  const token = this.authService.generateToken(user);
  return { accessToken: token };
}

// Protected route
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user; // Extracted from JWT
}
```

**Note:** Authentication implemented but NOT integrated with frontend (time constraints)

### 9.3 Security Gaps (Acknowledged)

**Missing:**
- **Authorization**: No role-based access control (RBAC)
- **Rate Limiting**: No protection against brute force
- **CSRF Protection**: No CSRF tokens
- **XSS Protection**: React provides some protection, but no Content Security Policy
- **File Upload Scanning**: No malware detection
- **Audit Logging**: No tracking of who created/modified content

**Justification:**
- Project scope limited to core functionality
- Development/demo environment (not production)
- Authentication framework in place for future expansion

---

## 10. DEPLOYMENT & INFRASTRUCTURE

### 10.1 Development Environment (Docker Compose)

**Services:**
```yaml
services:
  postgres:
    image: postgres:17
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: ramboll-elearning
  
  minio:
    image: minio/minio
    ports: 
      - "9000:9000"  # API
      - "9002:9002"  # Console
    command: server /data --console-address ":9002"
  
  pgadmin: # Optional DB GUI
    image: dpage/pgadmin4
    ports: ["5050:80"]
```

**Benefits:**
- **Consistency**: Same environment for all developers
- **Isolation**: No conflicting local installs
- **Easy Setup**: `docker-compose up -d`
- **Production Parity**: Similar to production setup

### 10.2 Environment Configuration

**Backend (.env):**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=dev
DB_PASSWORD=dev
DB_NAME=ramboll-elearning

# Storage
MINIO_ENDPOINT=http://localhost:9000
MINIO_BUCKET_NAME=elearning-resources
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Auth
JWT_SECRET=your-secret-key
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

**Configuration Management:**
```typescript
// NestJS ConfigService
constructor(private configService: ConfigService) {
  const dbHost = this.configService.get('DB_HOST', 'localhost');
  // Type-safe, with defaults
}
```

### 10.3 Database Migrations

**Workflow:**
```bash
# 1. Modify entity
@Entity()
class Block {
  @Property()
  newField!: string; // Added
}

# 2. Generate migration
npm run migration:create

# 3. Review generated SQL
// migrations/Migration20241224000000.ts
up() {
  this.addSql('alter table "blocks" add column "new_field" varchar(255)');
}

# 4. Apply migration
npm run migration:up

# 5. Rollback if needed
npm run migration:down
```

**Benefits:**
- Version control for schema changes
- Reproducible database state
- Team collaboration (shared migrations)
- Production deployment (run migrations before app start)

**Alternative: Schema Sync (Development Only):**
```bash
npm run schema:update # Automatically sync entities → database
```

---

## 11. CHALLENGES & SOLUTIONS

### 11.1 Block Reusability vs. Deletion

**Challenge:**
Cannot delete blocks that are in use (foreign key constraints)

**Solution:**
```typescript
async remove(id: number): Promise<void> {
  const block = await this.em.findOneOrFail(Block, { id }, {
    populate: ['stepBlocks'], // Load related data
  });
  
  if (block.stepBlocks.length > 0) {
    throw new BadRequestException(
      `Cannot delete block "${block.headline}". ` +
      `It is currently being used in ${block.stepBlocks.length} step(s).`
    );
  }
  
  await this.em.removeAndFlush(block);
}
```

**UX Improvement:**
- Added `/api/blocks/unused` endpoint
- Frontend filters to show only deletable blocks

### 11.2 Nested Entity Creation Complexity

**Challenge:**
Creating e-learning with all nested entities (steps, blocks, universes) in single request

**Solution:**
Transaction-based creation with MikroORM's Unit of Work:
```typescript
async create(dto: CreateELearningDto): Promise<ELearning> {
  // All creates tracked by EntityManager
  const eLearning = this.em.create(ELearning, { /* ... */ });
  
  for (const stepDto of dto.steps) {
    const step = this.em.create(Step, { /* ... */ });
    
    for (const blockDto of stepDto.stepBlocks) {
      // Create or reference block
      // Create junction entity
    }
  }
  
  for (const universeId of dto.universeIds) {
    this.em.create(UniverseELearning, { /* ... */ });
  }
  
  await this.em.flush(); // Single transaction, all-or-nothing
  return eLearning;
}
```

**Benefits:**
- Atomic operation (rollback on any error)
- Single database round-trip
- Maintains referential integrity

### 11.3 TypeScript Type Safety with JSON Content

**Challenge:**
`content: Record<string, any>` loses type safety

**Attempted Solution:**
Type guards in frontend:
```typescript
function isVideoContent(content: any): content is { videoUrl: string } {
  return 'videoUrl' in content && typeof content.videoUrl === 'string';
}

// Usage
if (block.type === BlockType.VIDEO && isVideoContent(block.content)) {
  const url = block.content.videoUrl; // Type-safe!
}
```

**Limitation:**
Still requires runtime checks, no compile-time guarantee

**Alternative Considered (Not Implemented):**
Discriminated union types:
```typescript
type BlockContent = 
  | { type: 'video'; videoUrl: string }
  | { type: 'image'; imageUrls: string[] }
  | { type: 'flip_cards'; cards: Card[] };
```

### 11.4 Form State Management in Multi-Step Wizard

**Challenge:**
Create E-Learning wizard has 3 tabs, sharing state

**Solution:**
Lift state to parent component:
```typescript
function CreateELearningPage() {
  const [formData, setFormData] = useState<CreateELearningDto>({
    title: '',
    description: '',
    coverImage: '',
    steps: [],
    universeIds: [],
  });
  
  return (
    <Tabs>
      <BasicInfoTab 
        data={formData}
        onChange={setFormData}
      />
      <StructureTab
        steps={formData.steps}
        onChange={(steps) => setFormData({ ...formData, steps })}
      />
      <UniversesTab
        selected={formData.universeIds}
        onChange={(ids) => setFormData({ ...formData, universeIds: ids })}
      />
    </Tabs>
  );
}
```

**Benefits:**
- Single source of truth
- Easy to validate before submission
- Can save to localStorage for draft

---

## 12. PERFORMANCE CONSIDERATIONS

### 12.1 N+1 Query Problem

**Problem:**
Loading e-learning → steps → blocks could cause multiple queries

**Solution:**
Eager loading with MikroORM:
```typescript
async findOne(id: number): Promise<ELearning> {
  return this.em.findOneOrFail(ELearning, { id }, {
    populate: ['steps', 'steps.stepBlocks', 'steps.stepBlocks.block'],
    // Single query with joins
  });
}
```

**SQL Generated:**
```sql
SELECT e.*, s.*, sb.*, b.*
FROM e_learnings e
LEFT JOIN steps s ON s.e_learning_id = e.id
LEFT JOIN step_blocks sb ON sb.step_id = s.id
LEFT JOIN blocks b ON sb.block_id = b.id
WHERE e.id = $1
```

### 12.2 React Query Caching

**Configuration:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

**Impact:**
- Blocks list cached (avoids refetch on every modal open)
- Universes cached (rarely change)
- E-learnings invalidated on create/update

### 12.3 File Upload Optimization

**Current:**
- Direct upload to MinIO (no proxy through Node.js)
- Files stored with unique UUIDs (CDN-friendly)

**Future Enhancement (Not Implemented):**
- Pre-signed URLs (upload directly from browser)
- Image optimization (resize/compress)
- Lazy loading for images in preview

---

## 13. FUTURE ENHANCEMENTS (Documented in to do.md)

### 13.1 Feature Additions

**Assessments/Quiz Blocks:**
- Multiple choice questions
- True/false
- Score calculation
- Progress tracking

**Re-ordering UI:**
- Drag-and-drop for steps
- Drag-and-drop for blocks within steps
- Automatic orderIndex updates

**Advanced Block Types:**
- Audio blocks
- PDF/Document viewers
- Interactive diagrams
- Branching scenarios

### 13.2 Technical Improvements

**Race Condition Prevention:**
```typescript
// Optimistic locking
@Entity()
class ELearning {
  @Property({ version: true })
  version!: number; // Auto-incremented
}

// Update fails if version mismatch
await em.flush(); // Throws if concurrent update
```

**Better Frontend Validation:**
- Zod schema validation
- Form-level error display
- Real-time validation feedback

**Integration Tests with Test Database:**
```typescript
beforeEach(async () => {
  await orm.em.execute('TRUNCATE TABLE e_learnings CASCADE');
  // Clean state for each test
});
```

### 13.3 Production Readiness

**Monitoring:**
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Logging (Winston)

**Deployment:**
- CI/CD pipeline (GitHub Actions)
- Container orchestration (Kubernetes)
- Database backups
- Blue-green deployment

**Security Hardening:**
- Rate limiting (express-rate-limit)
- Helmet.js (security headers)
- Input sanitization (DOMPurify)
- Regular dependency updates

---

## 14. LESSONS LEARNED & REFLECTIONS

### 14.1 What Went Well

**Technology Choices:**
- NestJS structure scaled well with feature additions
- MikroORM's Unit of Work simplified complex creates
- React Query eliminated state management complexity
- TypeScript caught many bugs at compile-time

**Architecture Decisions:**
- Block reusability proved valuable in reducing duplication
- JSON storage for content provided needed flexibility
- REST API design is intuitive and well-documented

**Development Process:**
- Docker Compose enabled quick onboarding
- E2E tests caught integration issues early
- Incremental development (blocks → steps → e-learnings) worked well

### 14.2 What Could Be Improved

**Type Safety:**
- JSON content field loses TypeScript benefits
- Could use branded types or runtime validation libraries (Zod)

**Testing Coverage:**
- Frontend has zero tests
- More edge cases needed in backend tests
- No performance/load testing

**Documentation:**
- API documentation could use OpenAPI/Swagger
- Inline code comments sparse in places
- Missing architectural decision records (ADRs)

**User Experience:**
- Form validation errors not always clear
- No draft saving (lose work on accidental navigation)
- No undo/redo functionality

### 14.3 Alternative Approaches Considered

**GraphQL vs REST:**
- **Considered:** GraphQL for flexible queries
- **Rejected:** Adds complexity, REST sufficient for CRUD
- **Future:** Could add GraphQL layer for complex queries

**Monorepo vs Separate Repos:**
- **Current:** Separate client/server folders
- **Alternative:** Nx/Turborepo monorepo
- **Trade-off:** Simpler setup vs. shared code benefits

**PostgreSQL JSONB vs Dedicated Tables:**
- **Current:** JSON content field
- **Alternative:** Separate tables per block type (VideoBlock, ImageBlock)
- **Trade-off:** Flexibility vs. query performance

---

## 15. ACADEMIC CONTEXT

### 15.1 Software Engineering Principles Applied

**SOLID Principles:**
- **Single Responsibility**: Each service handles one domain (BlocksService, ELearningsService)
- **Open/Closed**: New block types added without modifying existing code (builder pattern)
- **Dependency Inversion**: Services depend on abstractions (EntityManager interface)

**DRY (Don't Repeat Yourself):**
- Reusable blocks eliminate content duplication
- Component composition in React (block-modal-forms)
- Utility functions (buildBlockContent)

**Separation of Concerns:**
- Layered architecture (Controller → Service → Entity)
- DTO validation separate from business logic
- Frontend/backend decoupled (RESTful API)

### 15.2 Design Patterns Used

1. **Repository Pattern** (via EntityManager)
2. **DTO Pattern** (data transfer objects)
3. **Builder Pattern** (block content builder)
4. **Dependency Injection** (NestJS core)
5. **MVC Pattern** (Controller-Service-Entity)
6. **Singleton Pattern** (EntityManager, QueryClient)
7. **Factory Pattern** (em.create() for entities)

### 15.3 Relevant Theories & Concepts

**Database Normalization:**
- 3NF (Third Normal Form) achieved
- Junction tables for M:N relationships
- No data duplication (except intentional denormalization in JSON fields)

**RESTful API Design:**
- Resource-based URLs
- HTTP verb semantics (GET/POST/PATCH/DELETE)
- Stateless communication
- Hypermedia (could add HATEOAS links)

**Software Development Lifecycle:**
- Iterative development (features added incrementally)
- Testing pyramid (E2E tests at top, unit tests at base)
- Version control (Git)
- Documentation as code

---

## 16. QUANTITATIVE METRICS

### 16.1 Project Scale

**Backend:**
- **Lines of Code**: ~3,000 (excluding tests)
- **Entities**: 9 (Universe, Unit, User, ELearning, Step, Block, StepBlock, UniverseELearning, Auth)
- **API Endpoints**: ~25
- **Dependencies**: 15 major packages

**Frontend:**
- **Lines of Code**: ~2,500
- **Components**: ~30
- **Pages/Routes**: 4 main routes
- **Dependencies**: 12 major packages

**Database:**
- **Tables**: 9
- **Relationships**: 8 (foreign keys)
- **Indexes**: 6 (unique constraints, primary keys)

### 16.2 Development Timeline (Estimated)

1. **Initial Setup** (Week 1)
   - Project scaffolding
   - Docker environment
   - Database design

2. **Core Entities** (Week 2-3)
   - Universe/Unit/User
   - Authentication
   - Basic CRUD

3. **Block System** (Week 4-5)
   - Block entity and types
   - Block forms (frontend)
   - File upload

4. **E-Learning Creation** (Week 6-7)
   - Full hierarchy creation
   - Wizard UI
   - Preview system

5. **Polish & Testing** (Week 8)
   - E2E tests
   - Bug fixes
   - Documentation

---

## 17. REFERENCES & RESOURCES

### 17.1 Documentation Used

**Official Docs:**
- [NestJS Documentation](https://docs.nestjs.com)
- [MikroORM Guide](https://mikro-orm.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query)
- [PostgreSQL Manual](https://www.postgresql.org/docs)

**Tutorials & Guides:**
- NestJS + MikroORM integration
- React Query best practices
- TypeScript advanced types
- Docker Compose for development

### 17.2 Similar Projects (Inspiration)

- **Strapi**: Headless CMS (similar content management approach)
- **Directus**: Open-source data platform
- **Notion**: Block-based content editor
- **WordPress Gutenberg**: Block editor

---

## 18. CONCLUSION & CONTRIBUTIONS

### 18.1 Project Achievements

**Functional Requirements Met:**
✅ Create, view, delete e-learnings
✅ Hierarchical content structure (universes → e-learnings → steps → blocks)
✅ 5 interactive block types
✅ Block reusability across courses
✅ File upload system
✅ Preview functionality
✅ Type-safe full-stack application

**Technical Goals Achieved:**
✅ Clean architecture (separation of concerns)
✅ Type safety (TypeScript throughout)
✅ Automated testing (E2E tests)
✅ Containerized development (Docker)
✅ RESTful API design
✅ Modern web stack (Next.js, NestJS)

### 18.2 Unique Contributions

**Novel Design Decisions:**
1. **Hybrid block creation**: Mix new and existing blocks in single request
2. **JSON-based content storage**: Flexibility without schema migrations
3. **Explicit junction entities**: Better control than implicit M:N

**Problem-Solving:**
- Solved nested entity creation with single transaction
- Implemented safe block deletion with usage checking
- Created intuitive wizard UI for complex data structure

### 18.3 Academic Value

**Demonstrates:**
- Full-stack web development proficiency
- Understanding of database design and normalization
- Application of software engineering principles
- Modern development practices (Docker, testing, TypeScript)
- Problem decomposition and system architecture

**Suitable for:**
- Bachelor thesis in Software Engineering
- Portfolio project for job applications
- Case study in educational technology development

---

## APPENDIX: TERMINOLOGY GLOSSARY

**Block**: Reusable content component (video, image, flip cards, etc.)
**Step**: Single page/lesson within an e-learning course
**Unit**: Module or chapter containing steps
**Universe**: Top-level organizational entity (client organization)
**E-Learning**: Complete course/training module
**DTO**: Data Transfer Object (request/response structure)
**ORM**: Object-Relational Mapping (database abstraction layer)
**Junction Table**: Table connecting two entities in M:N relationship
**Unit of Work**: Pattern tracking changes and committing atomically
**Eager Loading**: Loading related entities in single query
**Cascade Delete**: Automatically delete related entities
**Foreign Key**: Database constraint ensuring referential integrity
**JSONB**: PostgreSQL binary JSON storage type
**S3**: Amazon Simple Storage Service (object storage)
**MinIO**: S3-compatible self-hosted object storage
**JWT**: JSON Web Token (authentication mechanism)
**CORS**: Cross-Origin Resource Sharing
**SSR**: Server-Side Rendering
