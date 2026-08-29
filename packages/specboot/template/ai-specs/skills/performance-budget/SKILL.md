---
name: performance-budget
description: Use when defining, enforcing, and monitoring performance budgets: Core Web Vitals, bundle size, runtime metrics, Lighthouse CI, and regression detection. Integrated into OpenSpec propose/apply/verify.
author: LIDR.co
version: 1.1.0
---

# Performance Budget Skill

Enforces performance budgets as non-negotiable quality gates. Budgets defined in propose, implemented in apply, verified in verify.

## When to Use

- **Propose**: Define performance budgets for new feature
- **Apply**: Implement with budget awareness (code splitting, lazy loading)
- **Verify**: Automated budget enforcement in CI
- **Monitor**: Post-deployment regression detection

## Budget Categories

### Core Web Vitals (Non-Negotiable)

| Metric | Budget | Threshold | Tool |
|--------|--------|-----------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | Good ≤ 2.5s, Needs Improvement ≤ 4s | Lighthouse, Web Vitals |
| **INP** (Interaction to Next Paint) | ≤ 200ms | Good ≤ 200ms, Needs Improvement ≤ 500ms | Web Vitals |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | Good ≤ 0.1, Needs Improvement ≤ 0.25 | Lighthouse, Web Vitals |
| **FCP** (First Contentful Paint) | ≤ 1.8s | Good ≤ 1.8s | Lighthouse |
| **TTFB** (Time to First Byte) | ≤ 800ms | Good ≤ 800ms | Lighthouse |

### Bundle Budgets

| Budget | Limit | Enforcement |
|--------|-------|-------------|
| **Initial JS (gzipped)** | ≤ 170 KB | webpack-bundle-analyzer, CI fail |
| **Initial CSS (gzipped)** | ≤ 50 KB | CI fail |
| **Total page weight** | ≤ 500 KB | Lighthouse CI |
| **Third-party scripts** | ≤ 2 | Audit, justify each |
| **Font weight** | ≤ 100 KB | Subset, WOFF2, preload |

### Runtime Budgets

| Metric | Budget | Measurement |
|--------|--------|-------------|
| **Main thread blocking** | ≤ 300ms | Lighthouse TBT |
| **JS parse/compile** | ≤ 500ms | Chrome DevTools |
| **Memory growth** | ≤ 10MB/5min | Chrome DevTools |
| **Long tasks** | 0 > 50ms | Web Vitals |

## Budget Definition (In Propose)

```markdown
# In openspec/changes/<name>/design.md

## Performance Budget

### Core Web Vitals Targets
- LCP: ≤ 2.5s (target 1.8s)
- INP: ≤ 200ms (target 100ms)
- CLS: ≤ 0.1 (target 0.05)

### Bundle Budgets
| Asset | Current | Budget | Delta |
|-------|---------|--------|-------|
| Main JS (gz) | 145 KB | 170 KB | +25 KB headroom |
| Vendor JS (gz) | 85 KB | 100 KB | +15 KB |
| CSS (gz) | 28 KB | 50 KB | +22 KB |
| Fonts | 45 KB | 100 KB | +55 KB |

### Feature-Specific Budgets
- New component: ≤ 5 KB gzipped
- New route chunk: ≤ 15 KB gzipped
- New API call: ≤ 200ms p95
- New DB query: ≤ 50ms p95
```

## Implementation Patterns (Apply Phase)

### Code Splitting (Mandatory)

```tsx
// Route-level splitting (React Router v6)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Candidates = lazy(() => import('./pages/Candidates'));

// Component-level splitting (heavy components)
const DataTable = lazy(() => import('./components/DataTable'));
const Chart = lazy(() => import('./components/Chart'));

// Suspense boundaries
<Suspense fallback={<TableSkeleton />}>
  <DataTable />
</Suspense>
```

### Lazy Loading & Prefetching

```tsx
// Prefetch on hover (route)
<Link
  to="/candidates"
  onMouseEnter={() => import('./pages/Candidates')}
/>

// Intersection Observer for below-fold
const LazyImage = ({ src, alt }) => {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && observer.unobserve(ref.current!),
      { rootMargin: '100px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <img ref={ref} src={src} alt={alt} loading="lazy" />;
};
```

### Font Optimization

```css
/* Critical: Preload + font-display: swap */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-display: swap;
  font-weight: 100 900;
}

/* Subset for Latin only */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

### Image Optimization

```tsx
// Next.js Image or custom with srcset
<picture>
  <source srcSet="/hero.avif" type="image/avif" />
  <source srcSet="/hero.webp" type="image/webp" />
  <img
    src="/hero.jpg"
    alt="Hero"
    width="1200"
    height="600"
    loading="eager"      // LCP image
    fetchPriority="high" // LCP hint
    decoding="async"
  />
</picture>
```

### Third-Party Script Strategy

```tsx
// Load after interaction (facade pattern)
const ChatWidget = () => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div ref={ref => ref && !loaded && (setLoaded(true), loadChatScript())}>
      {loaded && <ChatEmbed />}
    </div>
  );
};

// Or use Partytown (web workers)
<script type="text/partytown" src="https://analytics.example.com/script.js" />
```

## CI Enforcement (Verify Phase)

### 1. Bundle Analyzer (Every PR)

```yaml
# .github/workflows/bundle.yml
jobs:
  bundle:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: npm run build
      - name: Analyze bundle
        run: npx webpack-bundle-analyzer --mode=static --report=report.html
      - name: Check budgets
        run: |
          npx bundlesize  # or custom script
          # Fails if any budget exceeded
```

```json
// bundlesize.config.json
{
  "files": [
    { "path": "dist/main.*.js.gz", "maxSize": "170 KB" },
    { "path": "dist/vendor.*.js.gz", "maxSize": "100 KB" },
    { "path": "dist/styles.*.css.gz", "maxSize": "50 KB" }
  ]
}
```

### 2. Lighthouse CI (Every PR)

```yaml
# .github/workflows/lighthouse.yml
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build & Preview
        run: npm run build && npm run preview -- --port 3000 &
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/candidates
            http://localhost:3000/dashboard
          configPath: ./lighthouserc.json
```

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 5,
      "settings": {
        "preset": "desktop",
        "staticDistDir": "./dist"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 1 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["warn", { "minScore": 0.8 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "interaction-to-next-paint": ["error", { "maxNumericValue": 200 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 1800 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```

### 3. Web Vitals Monitoring (Production)

```typescript
// src/lib/web-vitals.ts
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  fetch('/api/vitals', {
    method: 'POST',
    body: JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      page: window.location.pathname,
      timestamp: Date.now(),
    }),
  });
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

### 4. Performance Regression Alerting

```yaml
# .github/workflows/perf-regression.yml
on:
  schedule: [{ cron: '0 6 * * *' }]  # Daily
  workflow_dispatch:

jobs:
  regression:
    runs-on: ubuntu-latest
    steps:
      - name: Run Lighthouse on production
        run: |
          npx lighthouse https://app.example.com \
            --output=json --output-path=report.json \
            --preset=desktop
      - name: Compare with baseline
        run: |
          node scripts/compare-perf.js report.json baseline.json
          # Alerts if any metric regressed >10%
```

## Integration with OpenSpec

### In `propose` → `design.md`

```markdown
## Performance Budget
- LCP: ≤ 2.5s (current baseline: 1.9s)
- INP: ≤ 200ms (current: 120ms)
- CLS: ≤ 0.1 (current: 0.03)
- Bundle: +15 KB JS headroom for this feature
- New API endpoints: p95 ≤ 200ms
- New DB queries: p95 ≤ 50ms
```

### In `apply` → `tasks.md`

```markdown
- [ ] Implement route-level code splitting (REF: PERF-001)
- [ ] Lazy load heavy components (DataTable, Chart) (REF: PERF-002)
- [ ] Optimize images: WebP/AVIF, srcset, lazy load (REF: PERF-003)
- [ ] Font subset + preload critical (REF: PERF-004)
- [ ] Bundle analysis: verify < budget (REF: PERF-005)
- [ ] Lighthouse CI: all budgets pass (REF: PERF-006)
```

### In `verify` → Pre-archive

```bash
# All must pass
npm run build
npm run bundle:check      # bundlesize
npm run lighthouse:ci     # Lighthouse budgets
npm run test:perf         # Custom perf tests (if any)

# Production monitoring (post-deploy)
# - Web Vitals dashboard (Grafana/Datadog)
# - Alert on regression >10%
```

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run build` | Production build |
| `npm run bundle:analyze` | Visual bundle analysis |
| `npm run bundle:check` | Fail if over budget |
| `npm run lighthouse:ci` | Lighthouse budget gate |
| `npm run perf:profile` | Chrome trace analysis |
| `npm run vitals:report` | Web Vitals summary |

## Budget Evolution

| Phase | Approach |
|-------|----------|
| **MVP** | Generous budgets, focus on correctness |
| **Growth** | Tighten budgets, add new metrics |
| **Scale** | Per-route budgets, edge caching, streaming |
| **Mature** | Real-user monitoring (RUM) driven budgets |

## Tools Stack

| Category | Tools |
|----------|-------|
| **Build** | Vite/esbuild, webpack-bundle-analyzer, bundlesize |
| **CI** | Lighthouse CI, GitHub Actions |
| **Runtime** | web-vitals, Performance Observer API |
| **Monitoring** | Grafana, Datadog, New Relic, Vercel Analytics |
| **Regression** | lighthouse-ci, sitespeed.io, custom scripts |