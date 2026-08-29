# Project Name

One-line description of your project.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Architecture

This project follows Domain-Driven Design (DDD) layered architecture on the backend and component-based architecture on the frontend.

### Backend (TypeScript/Node.js/Express/Prisma)
```
backend/
├── src/
│   ├── domain/           # Pure business logic
│   ├── application/      # Use cases & orchestration
│   ├── presentation/     # HTTP layer (controllers/routes)
│   └── infrastructure/   # External concerns (Prisma, logging)
```

### Frontend (React/TypeScript/React Bootstrap)
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── services/         # API service layer
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page-level components
│   └── routes/           # Route definitions
```

## Documentation

- [Base Standards](docs/base-standards.md) — Core principles and rules
- [Backend Standards](docs/backend-standards.md) — Backend architecture and patterns
- [Frontend Standards](docs/frontend-standards.md) — Frontend architecture and patterns
- [Documentation Standards](docs/documentation-standards.md) — How to write docs
- [OpenSpec Tasks](docs/openspec-tasks-mandatory-steps.md) — Task execution rules
- [API Specification](docs/api-spec.yml) — OpenAPI 3.0 spec
- [Data Model](docs/data-model.md) — Entity definitions and relationships

## Development Workflow

This project uses **OpenSpec** for spec-driven development:

```bash
# 1. Optional: Enhance user story with technical detail
/enrich-us SCRUM-123

# 2. Create all OpenSpec artifacts
/ff SCRUM-123

# 3. Implement tasks one by one
/apply SCRUM-123

# 4. Verify implementation against artifacts
/verify SCRUM-123

# 5. Independent adversarial review
/adversarial-review SCRUM-123

# 6. Archive completed change
/archive SCRUM-123

# 7. Create commit and PR
/commit
```

## Agent Personas

Available in `ai-specs/agents/`:
- `backend-developer.md` — Backend DDD implementation
- `frontend-developer.md` — React component development
- `product-strategy-analyst.md` — Product ideation and strategy

## Skills

Available in `ai-specs/skills/`:
- `enrich-us` — Enhance user stories
- `using-git-worktrees` — Isolated workspace setup
- `writing-skills` — Create/verify skills (TDD for docs)
- `code-auditing` — Systematic code quality audits
- `commit` — Focused commits and PRs
- `adversarial-review` — Red-team review before archive
- `update-docs` — Keep documentation current
- `explain` — Teach concepts with mental models
- `meta-prompt` — Rewrite prompts with best practices
- `openspec-sync-specs` — Sync delta specs to main specs
- `show-spec-working` — Live feature demonstration

## Quality Gates

Every change must pass:
- [ ] All tests pass (90%+ coverage)
- [ ] TypeScript compiles (strict mode)
- [ ] ESLint passes
- [ ] Documentation updated
- [ ] API spec matches implementation
- [ ] Data model matches Prisma schema
- [ ] Symlinks verified intact
- [ ] English-only language check

## License

MIT