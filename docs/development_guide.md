# Development Guide

Complete setup, workflow, and testing guide for the LTI ATS system.

## 1. Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20.19.0+ | Runtime |
| npm | 10+ | Package manager |
| Docker | 24+ | PostgreSQL container |
| Docker Compose | 2.20+ | Multi-container orchestration |
| Git | 2.40+ | Version control |

## 2. Repository Setup

```bash
# Clone the repository
git clone git@github.com:your-org/lti-ats.git
cd lti-ats

# Verify Node version
node --version  # Should be 20.19.0+
```

## 3. Environment Configuration

### 3.1 Backend Environment (`backend/.env`)

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=lti_user
DB_PASSWORD=secure_password_change_in_production
DB_NAME=lti_db

# Application Configuration
PORT=3000
NODE_ENV=development

# Prisma Database URL (required)
DATABASE_URL="postgresql://lti_user:secure_password_change_in_production@localhost:5432/lti_db?schema=public"

# Optional: JWT Secret for auth (when implemented)
# JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Optional: Frontend URL for CORS
# FRONTEND_URL=http://localhost:3001
```

### 3.2 Frontend Environment (`frontend/.env`)

```env
REACT_APP_API_URL=http://localhost:3000
```

## 4. Database Setup (PostgreSQL via Docker)

```bash
# Start PostgreSQL container
docker-compose up -d

# Verify container is running
docker-compose ps

# Expected output:
# NAME               IMAGE              STATUS          PORTS
# lti-postgres       postgres:15        Up (healthy)    0.0.0.0:5432->5432/tcp

# Connection details:
# Host: localhost
# Port: 5432
# Database: lti_db
# Username: lti_user
# Password: secure_password_change_in_production
```

### 4.1 Docker Compose File (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: lti-postgres
    environment:
      POSTGRES_USER: lti_user
      POSTGRES_PASSWORD: secure_password_change_in_production
      POSTGRES_DB: lti_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U lti_user -d lti_db"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

## 5. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Seed database with sample data
npx prisma db seed

# Start development server
npm run dev
```

**Backend available at**: `http://localhost:3000`

### 5.1 Backend Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Run compiled production build |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Create and apply migration |
| `npm run prisma:studio` | Open Prisma Studio GUI |
| `npm run prisma:seed` | Seed database |

## 6. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend available at**: `http://localhost:3000` (CRA default) or `http://localhost:3001` (if configured)

### 6.1 Frontend Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server (port 3000/3001) |
| `npm test` | Run unit tests (Jest + RTL) |
| `npm run build` | Production build |
| `npm run cypress:open` | Open Cypress Test Runner |
| `npm run cypress:run` | Run Cypress headless |
| `npm run lint` | Run ESLint |

## 7. Testing

### 7.1 Backend Testing

```bash
cd backend

# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report (saved to coverage/YYYYMMDD-backend-coverage.md)
npm run test:coverage
```

**Coverage Thresholds** (enforced in `jest.config.js`):
- Branches: 90%
- Functions: 90%
- Lines: 90%
- Statements: 90%

### 7.2 Frontend Testing

```bash
cd frontend

# Unit tests (watch mode)
npm test

# E2E tests - Interactive
npm run cypress:open

# E2E tests - Headless (CI)
npm run cypress:run
```

### 7.3 Test Structure

```
backend/
├── src/
│   └── **/__tests__/**/*.test.ts    # Unit tests alongside code
└── jest.config.js

frontend/
├── src/
│   └── components/__tests__/*.test.tsx  # Component tests
├── cypress/
│   └── e2e/*.cy.ts                     # E2E tests
└── cypress.config.ts
```

## 8. Development Workflow

### 8.1 Feature Development (Spec-Driven)

```bash
# 1. Optional: Enrich user story
/enrich-us SCRUM-123

# 2. Create OpenSpec artifacts
/ff SCRUM-123

# 3. Implement tasks (one at a time)
/apply SCRUM-123

# 4. Verify implementation
/verify SCRUM-123

# 5. Adversarial review
/adversarial-review SCRUM-123

# 6. Archive change
/archive SCRUM-123

# 7. Commit and create PR
/commit
```

### 8.2 Git Workflow

```bash
# Create feature branch
git checkout -b feature/SCRUM-123-add-candidate-filters

# Make changes following TDD
# - Write failing test
# - Implement minimal code
# - Refactor

# Commit with conventional message
git add .
git commit -m "feat(candidates): add filter by location and status

- Add location and status query parameters to GET /candidates
- Update CandidateRepository with filter methods
- Add unit tests for new filter logic
- Update API spec with new parameters"

# Push and create PR
git push origin feature/SCRUM-123-add-candidate-filters
gh pr create --title "[SCRUM-123] Add candidate filters" --body "Implements candidate filtering by location and status"
```

### 8.3 Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code restructuring |
| `test` | Test additions/changes |
| `docs` | Documentation updates |
| `chore` | Maintenance tasks |
| `perf` | Performance improvements |
| `security` | Security fixes |

## 9. Code Quality Gates

Every commit must pass:

```bash
# Backend
cd backend
npm run lint        # ESLint
npm run build       # TypeScript compilation
npm test            # All tests pass
npm run test:coverage  # 90% coverage

# Frontend
cd frontend
npm run lint        # ESLint
npm run build       # Production build succeeds
npm test            # Unit tests pass
npm run cypress:run # E2E tests pass
```

## 10. Common Issues & Troubleshooting

| Issue | Solution |
|-------|----------|
| `Prisma Client not generated` | Run `npm run prisma:generate` in backend |
| `Database connection failed` | Verify Docker container running: `docker-compose ps` |
| `Migration failed` | Check `prisma/migrations/` for conflicts; reset with `npx prisma migrate reset` |
| `Port 3000/3001 in use` | Kill existing process or change PORT in `.env` |
| `Cypress cannot connect` | Ensure backend is running on correct port; check `cypress.config.ts` |
| `TypeScript errors in tests` | Check `tsconfig.json` includes test files; types for jest/cypress installed |
| `Module not found` | Run `npm install` in respective directory |

## 11. Useful Commands Reference

### Database Operations

```bash
# View database in Prisma Studio
cd backend && npx prisma studio

# Create new migration
cd backend && npx prisma migrate dev --name descriptive_name

# Reset database (⚠️ destroys data)
cd backend && npx prisma migrate reset

# Seed database
cd backend && npx prisma db seed
```

### Logs & Debugging

```bash
# Backend logs (dev mode)
cd backend && npm run dev

# View Docker logs
docker-compose logs -f postgres

# Frontend build output
cd frontend && npm run build
```

### Cleanup

```bash
# Stop all containers
docker-compose down

# Remove volumes (⚠️ destroys database data)
docker-compose down -v

# Clean node_modules (both frontend and backend)
rm -rf backend/node_modules frontend/node_modules
npm install  # in each directory
```

## 12. Project Structure Overview

```
lti-ats/
├── backend/
│   ├── src/
│   │   ├── domain/           # Entities, repositories, domain services
│   │   ├── application/      # Services, validators, DTOs
│   │   ├── presentation/     # Controllers, routes
│   │   ├── infrastructure/   # Prisma, logger, repositories impl
│   │   ├── middleware/       # Express middleware
│   │   ├── index.ts          # Express app setup
│   │   └── lambda.ts         # AWS Lambda handler
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/       # Migration history
│   ├── __tests__/            # Test utilities
│   ├── jest.config.js
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API service layer
│   │   ├── hooks/            # Custom hooks
│   │   ├── types/            # Shared types
│   │   ├── App.tsx           # Routing & providers
│   │   └── index.tsx         # Entry point
│   ├── cypress/
│   │   └── e2e/              # E2E tests
│   ├── tsconfig.json
│   ├── cypress.config.ts
│   └── package.json
├── docs/                     # Technical documentation
├── ai-specs/                 # AI agent specs & skills
├── docker-compose.yml
└── README.md
```

## 13. Deployment

### 13.1 Backend (AWS Lambda via Serverless)

```bash
cd backend

# Build for Lambda
npm run build:lambda

# Deploy to AWS
serverless deploy --stage production
```

### 13.2 Frontend (Static Hosting)

```bash
cd frontend

# Production build
npm run build

# Deploy build/ folder to:
# - AWS S3 + CloudFront
# - Vercel
# - Netlify
# - Any static hosting
```

### 13.3 Environment Variables (Production)

| Variable | Backend | Frontend |
|----------|---------|----------|
| `DATABASE_URL` | Required | — |
| `PORT` | Required (3000) | — |
| `NODE_ENV` | `production` | — |
| `FRONTEND_URL` | Required for CORS | — |
| `REACT_APP_API_URL` | — | Required |
| `JWT_SECRET` | Required (when auth added) | — |

---

**Last Updated**: 2025-01-15  
**Version**: 1.0.0