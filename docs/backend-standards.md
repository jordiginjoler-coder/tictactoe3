---
description: Backend development standards for TypeScript/Node.js/Express with Domain-Driven Design, SOLID principles, and clean architecture patterns.
globs: ["backend/src/**/*.ts", "backend/prisma/**/*.{prisma,ts}", "backend/jest.config.js", "backend/tsconfig.json", "backend/serverless.yml", "backend/package.json"]
alwaysApply: true
---

# Backend Development Standards

Comprehensive standards for the LTI backend: TypeScript, Node.js, Express, Prisma, PostgreSQL, Domain-Driven Design.

## 1. Technology Stack

| Category | Technology | Version/Notes |
|----------|------------|---------------|
| Runtime | Node.js | 20.19.0+ |
| Language | TypeScript | Strict mode enabled |
| Framework | Express.js | REST API |
| ORM | Prisma | Type-safe database access |
| Database | PostgreSQL | Docker container |
| Testing | Jest | 90% coverage threshold |
| Deployment | Serverless Framework | AWS Lambda |

## 2. Architecture: DDD Layered Architecture

```
src/
├── domain/                 # Pure business logic (NO external deps)
│   ├── models/            # Entities, Value Objects, Aggregates
│   ├── repositories/      # Repository interfaces (contracts)
│   ├── services/          # Domain services (business logic)
│   └── exceptions/        # Domain exceptions
├── application/           # Use cases, orchestration
│   ├── services/          # Application services
│   ├── dto/               # Data Transfer Objects
│   └── validator.ts       # Input validation
├── presentation/          # HTTP layer
│   ├── controllers/       # Request/response handlers
│   └── routes/            # Express route definitions
├── infrastructure/        # External concerns
│   ├── logger.ts          # Logging utilities
│   ├── prismaClient.ts    # Prisma client setup
│   └── repositories/      # Prisma implementations
├── middleware/            # Express middleware
├── index.ts               # Application entry point
└── lambda.ts              # AWS Lambda handler
```

**Dependency Rule**: Inner layers NEVER depend on outer layers. Domain has zero external dependencies.

## 3. Domain-Driven Design Patterns

### 3.1 Entities
- TypeScript classes with unique identity (`id`)
- Encapsulate business logic and invariants
- Constructor initializes from plain data
- `save()` method handles persistence via Prisma
- Static factory methods: `findOne()`, `findBy*()`

```typescript
export class Candidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;

  constructor(data: CandidateData) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.validate();
  }

  private validate(): void {
    if (!this.email.includes('@')) throw new InvalidEmailError(this.email);
  }

  async save(): Promise<Candidate> {
    // Prisma persistence logic
  }

  static async findOne(id: number): Promise<Candidate | null> {
    // Prisma query logic
  }
}
```

### 3.2 Value Objects
- No identity, defined by attributes
- Immutable after creation
- Encapsulate validation logic
- Examples: `Email`, `PhoneNumber`, `Address`

### 3.3 Aggregates
- Cluster of entities/value objects with a root
- Root enforces invariants across the cluster
- External references only to aggregate root
- Example: `Candidate` (root) → `Education`, `WorkExperience`, `Resume`

### 3.4 Repositories
- Interfaces in `domain/repositories/`
- Implementations in `infrastructure/repositories/`
- Dependency injection via constructor

```typescript
// Domain layer
export interface ICandidateRepository {
  findById(id: number): Promise<Candidate | null>;
  save(candidate: Candidate): Promise<Candidate>;
  findAll(filters: CandidateFilters): Promise<Candidate[]>;
}

// Infrastructure layer
export class CandidateRepository implements ICandidateRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: number): Promise<Candidate | null> {
    const data = await this.prisma.candidate.findUnique({ where: { id } });
    return data ? new Candidate(data) : null;
  }
}
```

### 3.5 Domain Services
- Business logic not belonging to a single entity
- Stateless, operate on entities/value objects
- Example: `InterviewSchedulingService`, `CandidateMatchingService`

## 4. SOLID Principles Enforcement

| Principle | Application |
|-----------|-------------|
| **SRP** | Each class has one reason to change. Controllers delegate to services; services delegate to repositories. |
| **OCP** | Extend via interfaces/factories, not modification. Use strategy pattern for varying algorithms. |
| **LSP** | Prefer composition over inheritance. Subtypes must honor base contracts. |
| **ISP** | Small, focused interfaces. `ICandidateRepository` not `IRepository`. |
| **DIP** | Depend on abstractions (interfaces), not concretions (Prisma). Inject via constructor. |

## 5. Coding Standards

### 5.1 Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables/Functions | camelCase | `candidateId`, `findCandidateById` |
| Classes/Interfaces | PascalCase | `Candidate`, `ICandidateRepository` |
| Constants | UPPER_SNAKE_CASE | `MAX_CANDIDATES_PER_PAGE` |
| Types | PascalCase | `CandidateData`, `CreateCandidateDto` |
| Files | camelCase | `candidateService.ts`, `candidateController.ts` |
| Private fields | underscore prefix | `_prisma` (optional) |

### 5.2 TypeScript Usage
- **Strict mode**: Always enabled in `tsconfig.json`
- **Explicit types**: Function parameters and return values
- **Interfaces**: For complex data structures and contracts
- **No `any`**: Use `unknown` or specific types
- **Generics**: For reusable components

### 5.3 Error Handling
- **Custom domain exceptions**: Extend `Error` with meaningful names
- **Error middleware**: Global handler maps to HTTP status codes
- **Prisma errors**: Transform `P2002` (unique), `P2025` (not found) to domain errors

```typescript
export class NotFoundError extends Error {
  constructor(resource: string, id: string | number) {
    super(`${resource} not found: ${id}`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public details: ValidationErrorDetail[]) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### 5.4 Validation
- **Centralized**: `src/application/validator.ts`
- **Validate at boundaries**: Controllers → Validator → Services
- **DTOs**: Define input shapes with validation rules

### 5.5 Logging
- **Structured**: JSON with context `{ candidateId, operation, durationMs }`
- **Levels**: `error`, `warn`, `info`, `debug`
- **Correlation IDs**: Trace requests across services

## 6. API Design Standards

### 6.1 REST Conventions

| Resource | Endpoints |
|----------|-----------|
| Candidates | `GET/POST /candidates`, `GET/PUT/DELETE /candidates/:id` |
| Positions | `GET/POST /positions`, `GET/PUT/DELETE /positions/:id` |
| Applications | `GET/POST /positions/:id/candidates`, `PUT /candidates/:id` (stage) |

### 6.2 Response Format

```typescript
// Success
{ success: true, data: T, message?: string }

// Error
{ success: false, error: { message: string, code: string, details?: any[] } }
```

### 6.3 HTTP Status Codes
- `200` — OK
- `201` — Created
- `400` — Bad Request (validation)
- `401` — Unauthorized
- `403` — Forbidden
- `404` — Not Found
- `409` — Conflict (unique constraint)
- `500` — Internal Server Error

### 6.4 CORS
- Allow specific origins (not `*` in production)
- Credentials: `true` for auth cookies

## 7. Database Patterns

### 7.1 Prisma Schema
- Single source of truth: `prisma/schema.prisma`
- camelCase fields, PascalCase models
- Explicit relations with `@relation`
- Indexes on frequently queried fields

### 7.2 Migrations
- Version controlled: `npx prisma migrate dev --name descriptive_name`
- Review before applying: `npx prisma migrate deploy` in production
- Seed data: `npx prisma db seed`

### 7.3 Query Optimization
- **Select specific fields**: Avoid `select: *`
- **Use `include`**: Prevent N+1 queries
- **Indexes**: On foreign keys and filter fields

```typescript
// Good: Single query with include
const candidate = await prisma.candidate.findUnique({
  where: { id },
  include: { educations: true, workExperiences: true }
});

// Bad: N+1 queries
const candidate = await prisma.candidate.findUnique({ where: { id } });
const educations = await prisma.education.findMany({ where: { candidateId: id } });
```

## 8. Testing Standards

### 8.1 Coverage Requirements
- **Threshold**: 90% branches, functions, lines, statements
- **Location**: `__tests__/` directories and `*.test.ts` files
- **Reports**: `npm run test:coverage` → `coverage/YYYYMMDD-backend-coverage.md`

### 8.2 Test Structure (AAA Pattern)

```typescript
describe('CandidateService - findById', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return candidate when found', async () => {
    // Arrange
    const candidateId = 1;
    const mockCandidate = new Candidate({ id: 1, firstName: 'John' });
    (CandidateRepository.findById as jest.Mock).mockResolvedValue(mockCandidate);

    // Act
    const result = await candidateService.findById(candidateId);

    // Assert
    expect(result).toEqual(mockCandidate);
    expect(CandidateRepository.findById).toHaveBeenCalledWith(candidateId);
  });

  it('should throw NotFoundError when not found', async () => {
    // Arrange
    (CandidateRepository.findById as jest.Mock).mockResolvedValue(null);

    // Act & Assert
    await expect(candidateService.findById(999))
      .rejects.toThrow(NotFoundError);
  });
});
```

### 8.3 Test Categories (All Required)
1. **Happy Path** — Valid inputs, expected outputs
2. **Error Handling** — Invalid inputs, missing data, DB errors
3. **Edge Cases** — Boundaries, null/undefined, empty collections
4. **Validation** — Input validation, business rule enforcement
5. **Integration Points** — External service calls, DB operations

### 8.4 Mocking Standards
- Mock ALL external dependencies (Prisma, services, models)
- Use `jest.mock()` at module level
- Clear mocks in `beforeEach()`
- Realistic mock data structures

## 9. Performance Best Practices

| Practice | Implementation |
|----------|----------------|
| **Parallel Operations** | `Promise.all([serviceA(), serviceB()])` |
| **Early Returns** | Guard clauses to avoid unnecessary processing |
| **Connection Pooling** | Prisma connection pool (configure in `DATABASE_URL`) |
| **Pagination** | Cursor-based for large datasets |
| **Caching** | Redis for frequently accessed reference data |

## 10. Security Best Practices

| Area | Requirement |
|------|-------------|
| **Input Validation** | Validate ALL inputs at application layer |
| **Secrets** | Never commit `.env`; use environment variables |
| **Dependency Injection** | Inject Prisma via middleware, not global state |
| **SQL Injection** | Prisma parameterized queries (built-in protection) |
| **Rate Limiting** | Implement on public endpoints |

## 11. Development Workflow

```bash
npm run dev              # Dev server with hot reload
npm run build            # Production build
npm test                 # Run tests
npm run test:coverage    # Tests with coverage report
npm run prisma:generate  # Generate Prisma client
npx prisma migrate dev   # Create and apply migration
npx prisma db seed       # Seed database
```

### Git Workflow
- Feature branches with descriptive names
- Conventional commits in English
- Code review required before merge
- Small, focused branches

## 12. Serverless Deployment

- **Handler**: `src/lambda.ts` wraps Express with `serverless-http`
- **Config**: `serverless.yml` defines Lambda, API Gateway, env vars
- **Build**: `npm run build:lambda` for Lambda artifact
- **Deploy**: `serverless deploy`