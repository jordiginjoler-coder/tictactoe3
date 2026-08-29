---
name: product-analytics
description: Use when implementing, validating, and leveraging product analytics: event tracking, funnel analysis, retention, feature adoption, experimentation. Integrates with OpenSpec for post-launch validation.
author: LIDR.co
version: 1.1.0
---

# Product Analytics Skill

Implements analytics as a first-class citizen: tracking plans in propose, implementation in apply, validation in verify, iteration post-launch.

## When to Use

- **Propose**: Define tracking plan for feature success metrics
- **Apply**: Implement event tracking with type safety
- **Verify**: Validate tracking fires correctly
- **Post-Launch**: Monitor adoption, funnels, retention, run experiments

## Tracking Plan (Source of Truth)

### Event Schema

```typescript
// src/lib/analytics/events.ts
export interface BaseEvent {
  event: string;
  timestamp: number;           // Unix ms
  userId: string;              // Hashed/anonymized
  sessionId: string;
  properties: Record<string, unknown>;
  context: {
    page: string;
    referrer: string;
    userAgent: string;
    viewport: { width: number; height: number };
  };
}

// Feature-specific events (generated per feature)
export interface CandidateCreatedEvent extends BaseEvent {
  event: 'candidate_created';
  properties: {
    candidateId: string;
    source: 'manual' | 'import' | 'referral' | 'api';
    hasResume: boolean;
    skillsCount: number;
    experienceYears: number;
  };
}

export interface InterviewScheduledEvent extends BaseEvent {
  event: 'interview_scheduled';
  properties: {
    interviewId: string;
    candidateId: string;
    type: 'phone' | 'video' | 'onsite' | 'technical';
    durationMinutes: number;
    scheduledBy: 'recruiter' | 'hiring_manager' | 'candidate_self';
    timezone: string;
  };
}

export type AnalyticsEvent =
  | CandidateCreatedEvent
  | InterviewScheduledEvent
  | JobPostedEvent
  | OfferSentEvent
  | UserLoginEvent
  | FeatureAdoptedEvent;
```

### Tracking Plan Document (In Propose)

```markdown
# Tracking Plan: <Feature Name>

## Events to Implement

| Event | Trigger | Properties | Purpose |
|-------|---------|------------|---------|
| `candidate_created` | POST /candidates 201 | candidateId, source, hasResume, skillsCount, experienceYears | Measure creation funnel |
| `candidate_viewed` | GET /candidates/:id | candidateId, referrer, timeOnPage | Engagement |
| `interview_scheduled` | POST /interviews 201 | interviewId, candidateId, type, duration, scheduledBy | Core workflow |
| `interview_completed` | PATCH /interviews/:id status=completed | interviewId, outcome, rating, notes | Outcome tracking |
| `offer_sent` | POST /offers 201 | offerId, candidateId, salary, equity, expiresAt | Conversion |
| `offer_accepted` | PATCH /offers/:id status=accepted | offerId, timeToAccept | Time-to-hire |

## User Properties (Identify)

| Property | Source | Updated |
|----------|--------|---------|
| `role` | Auth token | On login |
| `plan` | Billing | On change |
| `team_size` | Org settings | On change |
| `features_enabled` | Feature flags | On change |

## Funnels to Monitor

### Hiring Funnel
```
candidate_created → candidate_viewed → interview_scheduled → interview_completed → offer_sent → offer_accepted
```

### Activation Funnel (New Users)
```
user_signed_up → first_job_posted → first_candidate_added → first_interview_scheduled → first_offer_sent
```

## Dashboards Needed

| Dashboard | Audience | Refresh |
|-----------|----------|---------|
| Hiring Pipeline | Recruiters, Hiring Managers | Real-time |
| Team Performance | Leadership | Daily |
| Feature Adoption | Product | Weekly |
| Funnel Conversion | Product, Growth | Daily |
| Retention Cohorts | Product | Weekly |
```

## Implementation (Apply Phase)

### Type-Safe Analytics Wrapper

```typescript
// src/lib/analytics/client.ts
import { AnalyticsEvent } from './events';

class AnalyticsClient {
  private queue: AnalyticsEvent[] = [];
  private batchSize = 10;
  private flushInterval = 5000;

  constructor(
    private endpoint: string,
    private apiKey: string,
    private enabled: boolean = true
  ) {
    if (enabled) this.startFlush();
  }

  track<T extends AnalyticsEvent>(event: T): void {
    if (!this.enabled) return;
    
    const enriched = this.enrich(event);
    this.queue.push(enriched);
    
    if (this.queue.length >= this.batchSize) this.flush();
  }

  private enrich<T extends AnalyticsEvent>(event: T): T {
    return {
      ...event,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      context: {
        page: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        viewport: { width: window.innerWidth, height: window.innerHeight },
      },
    };
  }

  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;
    
    const payload = this.queue.splice(0, this.batchSize);
    
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ events: payload }),
        keepalive: true,
      });
    } catch (e) {
      // Re-queue on failure (max 3 retries)
      this.queue.unshift(...payload);
      console.warn('Analytics flush failed, re-queued', e);
    }
  }

  private getSessionId(): string {
    let id = sessionStorage.getItem('analytics_session');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('analytics_session', id);
    }
    return id;
  }

  private getUserId(): string {
    // Get from auth context (hashed)
    return getCurrentUserId() ?? 'anonymous';
  }

  private startFlush(): void {
    setInterval(() => this.flush(), this.flushInterval);
    window.addEventListener('beforeunload', () => this.flush());
  }
}

export const analytics = new AnalyticsClient(
  import.meta.env.VITE_ANALYTICS_ENDPOINT,
  import.meta.env.VITE_ANALYTICS_API_KEY,
  import.meta.env.PROD
);
```

### React Hook for Components

```typescript
// src/hooks/useAnalytics.ts
import { useCallback } from 'react';
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
        experienceYears: data.experienceYears,
      },
    });
  };
}
```

### Feature Flag Integration

```typescript
// src/lib/analytics/feature-flags.ts
export function trackFeatureAdoption(
  featureKey: string,
  action: 'exposed' | 'used' | 'completed',
  metadata?: Record<string, unknown>
) {
  analytics.track({
    event: 'feature_adopted',
    properties: {
      feature: featureKey,
      action,
      ...metadata,
    },
  });
}

// Usage
function CandidateAIAssist() {
  const { track } = useAnalytics();
  
  useEffect(() => {
    trackFeatureAdoption('ai_candidate_matching', 'exposed');
  }, []);

  const handleGenerate = () => {
    trackFeatureAdoption('ai_candidate_matching', 'used');
    // ... generate
  };
}
```

## Validation (Verify Phase)

### Automated Tracking Tests

```typescript
// test/analytics.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { analytics } from '@/lib/analytics/client';
import { CreateCandidateForm } from '@/features/candidates/CreateCandidateForm';

jest.mock('@/lib/analytics/client');

test('tracks candidate_created on successful submit', async () => {
  const mockTrack = jest.spyOn(analytics, 'track');
  
  render(<CreateCandidateForm />);
  
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: /create/i }));
  
  await waitFor(() => expect(mockTrack).toHaveBeenCalledWith(
    expect.objectContaining({
      event: 'candidate_created',
      properties: expect.objectContaining({
        source: 'manual',
        hasResume: false,
      }),
    })
  ));
});
```

### Network Validation (Cypress)

```typescript
// cypress/e2e/analytics.cy.ts
describe('Analytics tracking', () => {
  it('sends candidate_created event', () => {
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

### Debug Mode (Development)

```typescript
// src/lib/analytics/debug.ts
if (import.meta.env.DEV) {
  const originalTrack = analytics.track;
  analytics.track = (event) => {
    console.group(`📊 Analytics: ${event.event}`);
    console.log('Properties:', event.properties);
    console.log('Context:', event.context);
    console.groupEnd();
    originalTrack(event);
  };
}
```

## Post-Launch Analysis (Continuous)

### Adoption Metrics

```sql
-- Feature Adoption Rate
WITH exposed_users AS (
  SELECT DISTINCT userId 
  FROM events 
  WHERE event = 'feature_adopted' AND properties->>'action' = 'exposed'
    AND properties->>'feature' = 'ai_candidate_matching'
    AND timestamp > NOW() - INTERVAL '30 days'
),
active_users AS (
  SELECT DISTINCT userId 
  FROM events 
  WHERE event = 'feature_adopted' AND properties->>'action' = 'used'
    AND properties->>'feature' = 'ai_candidate_matching'
    AND timestamp > NOW() - INTERVAL '30 days'
)
SELECT 
  COUNT(DISTINCT active_users.userId) * 100.0 / COUNT(DISTINCT exposed_users.userId) AS adoption_rate
FROM exposed_users
LEFT JOIN active_users ON exposed_users.userId = active_users.userId;
```

### Funnel Analysis

```sql
-- Hiring Funnel Conversion
WITH funnel_steps AS (
  SELECT 'candidate_created' as step, 1 as step_order UNION ALL
  SELECT 'candidate_viewed', 2 UNION ALL
  SELECT 'interview_scheduled', 3 UNION ALL
  SELECT 'interview_completed', 4 UNION ALL
  SELECT 'offer_sent', 5 UNION ALL
  SELECT 'offer_accepted', 6
),
user_funnel AS (
  SELECT 
    e.userId,
    fs.step,
    fs.step_order,
    MIN(e.timestamp) as first_occurrence
  FROM events e
  JOIN funnel_steps fs ON e.event = fs.step
  WHERE e.timestamp > NOW() - INTERVAL '90 days'
  GROUP BY e.userId, fs.step, fs.step_order
)
SELECT 
  step,
  step_order,
  COUNT(DISTINCT userId) as users,
  LAG(COUNT(DISTINCT userId)) OVER (ORDER BY step_order) as prev_users,
  COUNT(DISTINCT userId) * 100.0 / LAG(COUNT(DISTINCT userId)) OVER (ORDER BY step_order) as conversion_rate
FROM user_funnel
GROUP BY step, step_order
ORDER BY step_order;
```

### Retention Cohorts

```sql
-- Weekly Retention Cohorts
WITH first_use AS (
  SELECT 
    userId,
    DATE_TRUNC('week', MIN(timestamp)) as cohort_week
  FROM events
  WHERE event IN ('candidate_created', 'job_posted', 'interview_scheduled')
  GROUP BY userId
),
weekly_activity AS (
  SELECT 
    e.userId,
    DATE_TRUNC('week', e.timestamp) as activity_week
  FROM events e
  JOIN first_use fu ON e.userId = fu.userId
  WHERE e.timestamp > fu.cohort_week
  GROUP BY e.userId, DATE_TRUNC('week', e.timestamp)
)
SELECT 
  fu.cohort_week,
  COUNT(DISTINCT fu.userId) as cohort_size,
  COUNT(DISTINCT CASE WHEN wa.activity_week = fu.cohort_week + INTERVAL '0 weeks' THEN wa.userId END) * 100.0 / COUNT(DISTINCT fu.userId) as week_0,
  COUNT(DISTINCT CASE WHEN wa.activity_week = fu.cohort_week + INTERVAL '1 week' THEN wa.userId END) * 100.0 / COUNT(DISTINCT fu.userId) as week_1,
  COUNT(DISTINCT CASE WHEN wa.activity_week = fu.cohort_week + INTERVAL '2 weeks' THEN wa.userId END) * 100.0 / COUNT(DISTINCT fu.userId) as week_2,
  COUNT(DISTINCT CASE WHEN wa.activity_week = fu.cohort_week + INTERVAL '4 weeks' THEN wa.userId END) * 100.0 / COUNT(DISTINCT fu.userId) as week_4
FROM first_use fu
LEFT JOIN weekly_activity wa ON fu.userId = wa.userId
GROUP BY fu.cohort_week
ORDER BY fu.cohort_week DESC;
```

## Integration with OpenSpec

### In `propose` → `design.md`

```markdown
## Analytics & Success Metrics

### Tracking Plan
- Events: candidate_created, interview_scheduled, offer_sent, offer_accepted
- Properties: [detailed in tracking plan]
- User properties: role, plan, team_size

### Success Metrics (KPIs)
| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Candidate → Interview | 15% | 25% | Funnel conversion |
| Interview → Offer | 30% | 40% | Funnel conversion |
| Offer Acceptance | 75% | 85% | Funnel conversion |
| Time to Hire | 45 days | 30 days | Median days |
| Feature Adoption (AI Match) | N/A | 40% | Exposed→Used |

### Dashboards Required
- Hiring Pipeline (real-time)
- Team Performance (daily)
- Feature Adoption (weekly)
```

### In `apply` → `tasks.md`

```markdown
- [ ] Implement analytics client with type-safe events (REF: AN-001)
- [ ] Add tracking to candidate create flow (REF: AN-002)
- [ ] Add tracking to interview scheduling flow (REF: AN-003)
- [ ] Add tracking to offer flow (REF: AN-004)
- [ ] Unit tests for analytics events (REF: AN-005)
- [ ] Cypress e2e validation of tracking (REF: AN-006)
- [ ] Debug mode verified in development (REF: AN-007)
```

### In `verify` → Pre-archive

```bash
# Validation
npm run test:analytics      # Unit tests
npm run cypress:analytics   # E2E tracking validation

# Manual verification
- [ ] Open Network tab → verify events fire
- [ ] Check debug console in dev
- [ ] Verify in analytics platform (dev environment)
- [ ] Confirm no PII in events
```

### Post-Launch (Continuous)

```markdown
# Weekly Analytics Review (Automated Report)

## Feature Adoption
- AI Candidate Matching: 32% adoption (target 40%)
- Bulk Actions: 58% adoption (target 50%) ✅

## Funnel Health
- Candidate → Interview: 22% (target 25%) ↗️
- Interview → Offer: 35% (target 40%) →
- Offer Accepted: 82% (target 85%) ↗️

## Alerts Triggered
- ⚠️ Drop-off at "Schedule Interview" step: +15% week-over-week
- ✅ No error rate regressions

## Action Items
1. Investigate interview scheduling drop-off (UX + analytics)
2. A/B test: simplified scheduling flow
3. Push AI Matching adoption: in-app nudge for exposed non-users
```