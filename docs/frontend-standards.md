---
description: Frontend development standards for React 18, TypeScript, React Router, Design System, Accessibility (WCAG 2.1 AA), Performance Budgets, Analytics, and component-based architecture.
globs: ["src/**/*.{ts,tsx,js,jsx,css,scss}", "package.json", "tsconfig.json", "jest.config.js", "cypress.config.ts", "design-system/**"]
alwaysApply: true
---

# Frontend Development Standards

Comprehensive standards for the frontend: React 18, TypeScript, React Router, **Design System**, **Accessibility (WCAG 2.1 AA)**, **Performance Budgets**, **Analytics**, and modern React patterns.

## 1. Technology Stack

| Category | Technology | Version/Notes |
|----------|------------|---------------|
| Framework | React | 18.x with hooks |
| Language | TypeScript | Strict mode (all new components) |
| Routing | React Router | v6 |
| **Design System** | **Custom DS (React Bootstrap based)** | **Mandatory for all UI** |
| HTTP Client | Axios | Service layer + interceptors |
| Testing | Jest + React Testing Library | Unit + a11y tests |
| E2E Testing | Cypress | User workflow + analytics validation |
| Visual Testing | Storybook + Chromatic | DS component regression |
| Build | Vite | Fast dev/build |
| Linting | ESLint + Prettier + eslint-plugin-jsx-a11y | Standard config |
| Performance | Lighthouse CI + bundlesize + web-vitals | Budget enforcement |
| Analytics | Custom type-safe client | PostHog / Mixpanel compatible |

## 2. Architecture: Component-Based with Service Layer + Design System

```
src/
├── services/              # API communication (one per domain)
│   ├── candidateService.ts
│   ├── positionService.ts
│   ├── api.ts             # Axios instance, interceptors
│   └── analytics.ts       # Analytics client
├── components/            # Feature components (consume DS)
│   ├── features/          # Feature-specific components
│   ├── layouts/           # Layout components
│   └── pages/             # Page-level components (route targets)
├── hooks/                 # Custom hooks (useCandidate, useAnalytics, useForm)
├── types/                 # Shared TypeScript interfaces
├── utils/                 # Utility functions
├── styles/                # Global styles, design token imports
├── App.tsx                # Routes, providers
└── main.tsx               # Entry point
```

**Design System (Separate Package/Repo):**
```
design-system/
├── tokens/                # Design tokens (source of truth)
│   ├── color.json
│   ├── spacing.json
│   ├── typography.json
│   ├── motion.json
│   ├── shadows.json
│   └── breakpoints.json
├── components/            # React components (Button, Input, DataTable, etc.)
├── patterns/              # Composed patterns (forms, navigation, data-display)
├── hooks/                 # DS-specific hooks (useTheme, useTokens)
├── utils/                 # DS utilities (cn, token helpers)
├── docs/                  # Component documentation
└── package.json           # Published as @org/design-system
```

**Key Principles:**
- **Design System First**: All UI built with DS components + semantic tokens
- **Service layer** for ALL API communication — components never call fetch/axios directly
- **Components** are functional with hooks only
- **State** is local to components or custom hooks (TanStack Query for server state)
- **Routes** defined in `App.tsx` with React Router v6
- **Accessibility** built-in (WCAG 2.1 AA non-negotiable)
- **Performance budgets** enforced in CI
- **Analytics** integrated at component level

## 3. Design System Standards

### 3.1 Token Usage (Mandatory)
```tsx
// ✅ GOOD - Semantic tokens
const styles = {
  container: {
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text-primary)',
    padding: 'var(--spacing-lg)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
  },
  button: {
    transition: `all var(--motion-fast) var(--easing-standard)`,
  },
};

// ❌ BAD - Hardcoded values
const styles = {
  container: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '8px',
  },
};
```

### 3.2 Component Consumption
```tsx
// ✅ GOOD - DS components
import { Button, Input, Card, DataTable, Modal, Toast } from '@org/design-system';

export const CandidateForm = () => (
  <Card>
    <Input label="Email" type="email" required aria-describedby="email-hint" />
    <Button variant="primary" onClick={handleSubmit}>
      Create Candidate
    </Button>
  </Card>
);

// ❌ BAD - Raw React Bootstrap or custom
import { Button as BsButton, Form } from 'react-bootstrap';
```

### 3.3 Dark Mode (Automatic via Tokens)
```css
/* src/styles/tokens.css - Generated from design-system/tokens/ */
:root {
  --color-background: var(--color-background-light);
  --color-text-primary: var(--color-text-primary-light);
  --color-primary: var(--color-blue-500);
  --spacing-xs: var(--space-1);
  --spacing-sm: var(--space-2);
  --radius-sm: var(--radius-2);
  --motion-fast: 150ms;
  --motion-base: 250ms;
}

[data-theme="dark"] {
  --color-background: var(--color-background-dark);
  --color-text-primary: var(--color-text-primary-dark);
  /* Semantic tokens auto-switch via primitive references */
}
```

### 3.4 Responsive Tokens
```tsx
// Use token-based breakpoints
const styles = {
  container: {
    padding: 'var(--spacing-md)',
    '@media (min-width: var(--breakpoint-md))': {
      padding: 'var(--spacing-xl)',
    },
    '@media (min-width: var(--breakpoint-lg))': {
      maxWidth: 'var(--container-max-width)',
      margin: '0 auto',
    },
  },
};
```

### 3.5 Adding to Design System (RFC Process)
1. **Identify need**: Component/token used in ≥2 features
2. **Create RFC**: API design, variants, states, accessibility, tokens
3. **Design**: Figma component with all states + responsive
4. **Implement**: Build per DS standards (below)
5. **Review**: DS team + accessibility review
6. **Publish**: Version bump, changelog, migration guide

## 4. Accessibility Standards (WCAG 2.1 AA - Non-Negotiable)

### 4.1 Semantic HTML First
```tsx
// ✅ GOOD
<nav aria-label="Main navigation">
  <ul>
    <li><Link to="/">Home</Link></li>
  </ul>
</nav>

<main>
  <h1>Page Title</h1>
  <section aria-labelledby="section-heading">
    <h2 id="section-heading">Section</h2>
  </section>
</main>

// ❌ BAD
<div className="nav">...</div>
<div className="main">...</div>
```

### 4.2 Heading Hierarchy
- Exactly one `<h1>` per page
- Never skip levels (h1 → h2 → h3)
- Section headings use `aria-labelledby` or `<h2-h6>`

### 4.3 Form Accessibility
```tsx
// ✅ GOOD
<div>
  <label htmlFor="email">Email *</label>
  <Input
    id="email"
    type="email"
    required
    aria-describedby={emailError ? "email-error" : "email-hint"}
    aria-invalid={!!emailError}
  />
  <span id="email-hint">We'll never share your email</span>
  {emailError && (
    <span id="email-error" role="alert" className="text-danger">
      {emailError}
    </span>
  )}
</div>
```

### 4.4 Focus Management
```tsx
// Modal focus trap hook (use in all modals/dropdowns)
const useFocusTrap = (ref: RefObject<HTMLElement>, active: boolean) => {
  useEffect(() => {
    if (!active) return;
    const element = ref.current;
    const focusable = element?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first?.focus();
      }
    };
    element?.addEventListener('keydown', handleTab);
    return () => element?.removeEventListener('keydown', handleTab);
  }, [ref, active]);
};
```

### 4.5 Live Regions
```tsx
// Toast announcer
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {toastMessage}
</div>

// Form validation summary
<div aria-live="assertive" role="alert">
  {errors.map(e => <p key={e.field}>{e.message}</p>)}
</div>
```

### 4.6 Contrast & Touch Targets (Enforced by DS)
- Text: 4.5:1 (DS semantic tokens enforce)
- Large text (≥18pt/14pt bold): 3:1
- UI components: 3:1
- Focus indicators: 3:1
- Touch targets: ≥44x44 CSS pixels

### 4.7 Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 5. Performance Budgets (Enforced in CI)

### 5.1 Core Web Vitals Targets
| Metric | Budget | Enforcement |
|--------|--------|-------------|
| **LCP** | ≤ 2.5s | Lighthouse CI (error) |
| **INP** | ≤ 200ms | Lighthouse CI (error) |
| **CLS** | ≤ 0.1 | Lighthouse CI (error) |
| **FCP** | ≤ 1.8s | Lighthouse CI (warn) |
| **TTFB** | ≤ 800ms | Lighthouse CI (warn) |

### 5.2 Bundle Budgets
| Asset | Budget | Tool |
|-------|--------|------|
| Main JS (gz) | ≤ 170 KB | bundlesize (error) |
| Vendor JS (gz) | ≤ 100 KB | bundlesize (error) |
| CSS (gz) | ≤ 50 KB | bundlesize (error) |
| Total page | ≤ 500 KB | Lighthouse CI |

### 5.3 Implementation Patterns
```tsx
// Route-level code splitting (mandatory)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Candidates = lazy(() => import('./pages/Candidates'));

// Component-level splitting (heavy components)
const DataTable = lazy(() => import('./components/DataTable'));
const Chart = lazy(() => import('./components/Chart'));

// Suspense boundaries with skeleton
<Suspense fallback={<TableSkeleton />}>
  <DataTable />
</Suspense>

// Image optimization
<picture>
  <source srcSet="/hero.avif" type="image/avif" />
  <source srcSet="/hero.webp" type="image/webp" />
  <img
    src="/hero.jpg"
    alt="Hero"
    width="1200" height="600"
    loading="eager"        // LCP image
    fetchPriority="high"   // LCP hint
    decoding="async"
  />
</picture>

// Font optimization
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-display: swap;
  font-weight: 100 900;
}

// Third-party: facade pattern
const ChatWidget = () => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div ref={ref => ref && !loaded && (setLoaded(true), loadChatScript())}>
      {loaded && <ChatEmbed />}
    </div>
  );
};
```

## 6. Analytics Standards

### 6.1 Type-Safe Events
```typescript
// src/lib/analytics/events.ts
export interface BaseEvent {
  event: string;
  timestamp: number;
  userId: string;
  sessionId: string;
  properties: Record<string, unknown>;
  context: { page: string; referrer: string; viewport: { width: number; height: number } };
}

export interface CandidateCreatedEvent extends BaseEvent {
  event: 'candidate_created';
  properties: {
    candidateId: string;
    source: 'manual' | 'import' | 'referral' | 'api';
    hasResume: boolean;
    skillsCount: number;
  };
}
```

### 6.2 Implementation
```tsx
// src/hooks/useAnalytics.ts
import { analytics } from '@/lib/analytics/client';
import { AnalyticsEvent } from '@/lib/analytics/events';

export function useAnalytics() {
  const track = useCallback(<T extends AnalyticsEvent>(event: T) => {
    analytics.track(event);
  }, []);
  return { track };
}

// Usage in component
function CreateCandidateForm() {
  const { track } = useAnalytics();
  
  const handleSubmit = async (data: CandidateFormData) => {
    const result = await createCandidate(data);
    track({
      event: 'candidate_created',
      properties: {
        candidateId: result.id,
        source: 'manual',
        hasResume: !!data.resume,
        skillsCount: data.skills.length,
      },
    });
  };
}
```

### 6.3 Feature Adoption Funnel
```tsx
// Track: exposed → used → completed
function CandidateAIAssist() {
  const { track } = useAnalytics();
  
  useEffect(() => {
    track({ event: 'feature_adopted', properties: { feature: 'ai_matching', action: 'exposed' } });
  }, []);

  const handleGenerate = () => {
    track({ event: 'feature_adopted', properties: { feature: 'ai_matching', action: 'used' } });
  };
}
```

## 7. Service Layer Standards

### 7.1 Service Structure
```typescript
// src/services/candidateService.ts
import { api } from './api';
import type { Candidate, CreateCandidateDto, CandidateFilters } from '../types';

export const candidateService = {
  async getAll(filters?: CandidateFilters): Promise<Candidate[]> { ... },
  async getById(id: number): Promise<Candidate> { ... },
  async create(data: CreateCandidateDto): Promise<Candidate> { ... },
  async update(id: number, data: Partial<Candidate>): Promise<Candidate> { ... },
  async delete(id: number): Promise<void> { ... },
};
```

### 7.2 API Client with Analytics
```typescript
// src/services/api.ts
import axios from 'axios';
import { analytics } from '@/lib/analytics/client';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use(config => {
  config.metadata = { startTime: Date.now() };
  return config;
});

api.interceptors.response.use(
  response => {
    const duration = Date.now() - response.config.metadata?.startTime;
    analytics.track({
      event: 'api_request',
      properties: { url: response.config.url, method: response.config.method, duration, status: response.status },
    });
    return response;
  },
  error => {
    analytics.track({
      event: 'api_error',
      properties: { url: error.config?.url, message: error.message, status: error.response?.status },
    });
    return Promise.reject(error);
  }
);
```

## 8. Component Standards

### 8.1 Structure & TypeScript
```tsx
// src/components/features/CandidateCard.tsx
import { Card, Button } from '@org/design-system';
import type { Candidate } from '../../types';

interface CandidateCardProps {
  candidate: Candidate;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onEdit,
  onDelete,
}) => (
  <Card>
    <Card.Body>
      <Card.Title>{candidate.firstName} {candidate.lastName}</Card.Title>
      <Card.Text>{candidate.email}</Card.Text>
      <Button variant="primary" onClick={() => onEdit(candidate.id)}>Edit</Button>
      <Button variant="danger" onClick={() => onDelete(candidate.id)}>Delete</Button>
    </Card.Body>
  </Card>
);
```

### 8.2 State Management
- **Local**: `useState`/`useReducer`
- **Server**: TanStack Query (caching, deduping, background refetch)
- **Forms**: React Hook Form + Zod validation
- **Loading/Error/Empty**: ALWAYS explicit

## 9. Routing Standards

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CandidateList } from './pages/CandidateList';
import { CandidateDetail } from './pages/CandidateDetail';

export const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/candidates" replace />} />
      <Route path="/candidates" element={<CandidateList />} />
      <Route path="/candidates/:id" element={<CandidateDetail />} />
    </Routes>
  </BrowserRouter>
);
```

## 10. Testing Standards

### 9.1 Unit Tests (Jest + RTL + jest-axe)
```tsx
// __tests__/CandidateCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CandidateCard } from '@/components/features/CandidateCard';

expect.extend(toHaveNoViolations);

describe('CandidateCard', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<CandidateCard candidate={mock} onEdit={jest.fn()} onDelete={jest.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders candidate name', () => {
    render(<CandidateCard candidate={mock} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### 9.2 Visual Regression (Storybook + Chromatic)
```tsx
// CandidateCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CandidateCard } from './CandidateCard';

const meta: Meta<typeof CandidateCard> = { component: CandidateCard, tags: ['autodocs'] };
export default meta;

export const Default: StoryObj = { args: { candidate: mock, onEdit: fn(), onDelete: fn() } };
export const WithLongName: StoryObj = { args: { candidate: {...mock, firstName: 'VeryLongName'}, onEdit: fn(), onDelete: fn() } };
```

### 9.3 E2E Tests (Cypress + Analytics)
```typescript
// cypress/e2e/candidate-flow.cy.ts
describe('Candidate flow', () => {
  it('creates candidate and tracks analytics', () => {
    cy.intercept('POST', '**/analytics/events', { statusCode: 200 }).as('trackEvent');
    cy.visit('/candidates/new');
    cy.fillCandidateForm({ name: 'Jane', email: 'jane@example.com' });
    cy.get('button[type=submit]').click();
    cy.wait('@trackEvent').its('request.body').should('deep.include', {
      events: [{ event: 'candidate_created', properties: { source: 'manual' } }]
    });
  });
});
```

## 11. Development Workflow

```bash
npm run dev              # Dev server with HMR
npm run build            # Production build
npm run test             # Unit tests (incl. a11y)
npm run test:coverage    # Coverage report
npm run test:a11y        # jest-axe only
npm run lint             # ESLint + jsx-a11y
npm run format           # Prettier
npm run typecheck        # tsc --noEmit
npm run bundle:analyze   # Visual bundle analysis
npm run bundle:check     # Budgets (error if exceeded)
npm run lighthouse:ci    # Lighthouse budgets
npm run cypress:open     # E2E interactive
npm run cypress:run      # E2E headless
npm run storybook        # Storybook dev
npm run chromatic        # Visual regression
```

## 12. Environment Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |
| `VITE_ANALYTICS_ENDPOINT` | Analytics ingestion endpoint | Yes |
| `VITE_ANALYTICS_API_KEY` | Analytics API key | Yes |
| `VITE_APP_TITLE` | Application title | No |

## 13. Quality Gates (Pre-Commit + CI)

| Gate | Tool | Threshold |
|------|------|-----------|
| TypeScript | `tsc --noEmit` | 0 errors |
| Lint | ESLint + jsx-a11y | 0 errors |
| Format | Prettier | 0 changes |
| Unit Tests | Jest | 100% pass, 90% coverage |
| A11y Unit | jest-axe | 0 violations |
| Visual Regression | Chromatic | 0 changes (or approved) |
| Bundle Size | bundlesize | Within budgets |
| Lighthouse CI | Lighthouse | LCP≤2.5s, INP≤200ms, CLS≤0.1 |
| E2E | Cypress | 100% pass |
| Analytics E2E | Cypress | Events fire correctly |