---
description: Data model definitions, entity relationships, validation rules, and ER diagram for the LTI application.
globs: ["backend/prisma/schema.prisma", "docs/api-spec.yml"]
alwaysApply: true
---

# Data Model

Entity definitions, relationships, validation rules, and ER diagram for the LTI application.

## 1. Entities

### 1.1 Candidate

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Int | `@id @default(autoincrement())` | Primary key |
| firstName | String | `@db.VarChar(100)` | Given name |
| lastName | String | `@db.VarChar(100)` | Family name |
| email | String | `@unique @db.VarChar(255)` | Email address (unique) |
| phone | String? | `@db.VarChar(20)` | Phone number (optional) |
| location | String? | `@db.VarChar(200)` | City, Country (optional) |
| linkedinUrl | String? | `@db.VarChar(500)` | LinkedIn profile (optional) |
| githubUrl | String? | `@db.VarChar(500)` | GitHub profile (optional) |
| portfolioUrl | String? | `@db.VarChar(500)` | Portfolio website (optional) |
| summary | String? | `@db.Text` | Professional summary (optional) |
| createdAt | DateTime | `@default(now())` | Record creation timestamp |
| updatedAt | DateTime | `@updatedAt` | Last modification timestamp |

**Relations:**
- `educations` — Education[] (one-to-many)
- `workExperiences` — WorkExperience[] (one-to-many)
- `skills` — Skill[] (many-to-many via CandidateSkill)
- `applications` — Application[] (one-to-many)
- `resumes` — Resume[] (one-to-many)

### 1.2 Position

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Int | `@id @default(autoincrement())` | Primary key |
| title | String | `@db.VarChar(200)` | Position title |
| department | String | `@db.VarChar(100)` | Department name |
| location | String | `@db.VarChar(200)` | Work location |
| type | PositionType | — | Employment type (FULL_TIME, PART_TIME, CONTRACT, INTERN) |
| level | SeniorityLevel | — | Seniority (JUNIOR, MID, SENIOR, LEAD, PRINCIPAL) |
| description | String | `@db.Text` | Position description |
| requirements | String | `@db.Text` | Required qualifications |
| responsibilities | String | `@db.Text` | Key responsibilities |
| salaryMin | Int? | — | Minimum salary (optional) |
| salaryMax | Int? | — | Maximum salary (optional) |
| currency | String | `@default("USD") @db.VarChar(3)` | Salary currency |
| status | PositionStatus | `@default(OPEN)` | Position status (OPEN, CLOSED, ON_HOLD, FILLED) |
| hiringManagerId | Int | — | Foreign key to User |
| createdAt | DateTime | `@default(now())` | Record creation timestamp |
| updatedAt | DateTime | `@updatedAt` | Last modification timestamp |

**Relations:**
- `applications` — Application[] (one-to-many)
- `hiringManager` — User (many-to-one)
- `requiredSkills` — Skill[] (many-to-many via PositionSkill)

### 1.3 Application

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Int | `@id @default(autoincrement())` | Primary key |
| candidateId | Int | — | Foreign key to Candidate |
| positionId | Int | — | Foreign key to Position |
| stage | ApplicationStage | `@default(APPLIED)` | Current stage |
| coverLetter | String? | `@db.Text` | Cover letter (optional) |
| resumeId | Int? | — | Foreign key to Resume (optional) |
| appliedAt | DateTime | `@default(now())` | Application timestamp |
| updatedAt | DateTime | `@updatedAt` | Last modification timestamp |

**Relations:**
- `candidate` — Candidate (many-to-one)
- `position` — Position (many-to-one)
- `resume` — Resume? (many-to-one, optional)
- `interviews` — Interview[] (one-to-many)
- `notes` — ApplicationNote[] (one-to-many)

### 1.4 Education

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Int | `@id @default(autoincrement())` | Primary key |
| candidateId | Int | — | Foreign key to Candidate |
| institution | String | `@db.VarChar(200)` | School/University name |
| degree | String | `@db.VarChar(100)` | Degree name |
| fieldOfStudy | String | `@db.VarChar(100)` | Major/Field |
| startDate | DateTime | — | Start date |
| endDate | DateTime? | — | End date (optional, null = current) |
| grade | String? | `@db.VarChar(20)` | GPA/Grade (optional) |
| description | String? | `@db.Text` | Additional details (optional) |

### 1.5 WorkExperience

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Int | `@id @default(autoincrement())` | Primary key |
| candidateId | Int | — | Foreign key to Candidate |
| company | String | `@db.VarChar(200)` | Company name |
| position | String | `@db.VarChar(100)` | Position title |
| location | String? | `@db.VarChar(200)` | Work location (optional) |
| startDate | DateTime | — | Start date |
| endDate | DateTime? | — | End date (optional, null = current) |
| description | String | `@db.Text` | Responsibilities and achievements |
| technologies | String[] | — | Technologies used (array) |

### 1.6 Skill

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Int | `@id @default(autoincrement())` | Primary key |
| name | String | `@unique @db.VarChar(100)` | Skill name (unique) |
| category | SkillCategory | — | Category (TECHNICAL, SOFT, LANGUAGE, TOOL, FRAMEWORK, DATABASE, CLOUD) |

**Relations:**
- `candidates` — Candidate[] (many-to-many via CandidateSkill)
- `positions` — Position[] (many-to-many via PositionSkill)

### 1.7 Resume

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Int | `@id @default(autoincrement())` | Primary key |
| candidateId | Int | — | Foreign key to Candidate |
| fileName | String | `@db.VarChar(255)` | Original file name |
| fileUrl | String | `@db.VarChar(500)` | Storage URL |
| fileSize | Int | — | File size in bytes |
| mimeType | String | `@db.VarChar(100)` | MIME type |
| parsedText | String? | `@db.Text` | Extracted text content (optional) |
| isPrimary | Boolean | `@default(false)` | Primary resume flag |
| uploadedAt | DateTime | `@default(now())` | Upload timestamp |

### 1.8 Interview

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Int | `@id @default(autoincrement())` | Primary key |
| applicationId | Int | — | Foreign key to Application |
| interviewerId | Int | — | Foreign key to User |
| type | InterviewType | — | Type (PHONE, VIDEO, ONSITE, TECHNICAL, BEHAVIORAL) |
| scheduledAt | DateTime | — | Scheduled date/time |
| durationMinutes | Int | `@default(60)` | Duration in minutes |
| status | InterviewStatus | `@default(SCHEDULED)` | Status |
| feedback | String? | `@db.Text` | Interview feedback (optional) |
| score | Int? | — | Score 1-10 (optional) |

### 1.9 User (Internal)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Int | `@id @default(autoincrement())` | Primary key |
| email | String | `@unique @db.VarChar(255)` | Email (unique) |
| firstName | String | `@db.VarChar(100)` | Given name |
| lastName | String | `@db.VarChar(100)` | Family name |
| role | UserRole | `@default(RECRUITER)` | Role (ADMIN, RECRUITER, HIRING_MANAGER, INTERVIEWER) |
| isActive | Boolean | `@default(true)` | Account status |
| createdAt | DateTime | `@default(now())` | Creation timestamp |

## 2. Enums

### PositionType
```prisma
enum PositionType {
  FULL_TIME
  PART_TIME
  CONTRACT
  INTERN
}
```

### SeniorityLevel
```prisma
enum SeniorityLevel {
  JUNIOR
  MID
  SENIOR
  LEAD
  PRINCIPAL
}
```

### PositionStatus
```prisma
enum PositionStatus {
  OPEN
  CLOSED
  ON_HOLD
  FILLED
}
```

### ApplicationStage
```prisma
enum ApplicationStage {
  APPLIED
  SCREENING
  TECHNICAL_REVIEW
  INTERVIEW_SCHEDULED
  INTERVIEW_COMPLETED
  OFFER_EXTENDED
  OFFER_ACCEPTED
  OFFER_DECLINED
  REJECTED
  WITHDRAWN
}
```

### SkillCategory
```prisma
enum SkillCategory {
  TECHNICAL
  SOFT
  LANGUAGE
  TOOL
  FRAMEWORK
  DATABASE
  CLOUD
}
```

### InterviewType
```prisma
enum InterviewType {
  PHONE
  VIDEO
  ONSITE
  TECHNICAL
  BEHAVIORAL
}
```

### InterviewStatus
```prisma
enum InterviewStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
  RESCHEDULED
  NO_SHOW
}
```

### UserRole
```prisma
enum UserRole {
  ADMIN
  RECRUITER
  HIRING_MANAGER
  INTERVIEWER
}
```

## 3. Relationships Diagram

```
User (1) ──────< (many) Position (hiringManager)
    │
    └──< (many) Interview (interviewer)

Candidate (1) ──────< (many) Education
    │
    ├──< (many) WorkExperience
    │
    ├──< (many) Resume
    │
    ├──< (many) Application
    │       │
    │       ├──< (many) Interview
    │       │
    │       └──< (many) ApplicationNote
    │
    └──< (many) CandidateSkill >──── (many) Skill <──── (many) PositionSkill >──── (many) Position

Position (1) ──────< (many) Application
```

## 4. Validation Rules

### 4.1 Candidate
- Email must be valid format and unique
- First name and last name required, max 100 chars
- Phone must be valid format if provided
- At least one contact method (email or phone) required

### 4.2 Position
- Title required, max 200 chars
- Description required
- Salary min ≤ salary max if both provided
- Hiring manager must exist and be active

### 4.3 Application
- Candidate and position must exist
- Candidate cannot apply twice to same position
- Stage transitions must follow valid workflow

### 4.4 Education
- Institution and degree required
- End date ≥ start date
- If end date null, candidate is currently studying

### 4.5 WorkExperience
- Company and position required
- End date ≥ start date
- If end date null, candidate currently works there

## 5. Indexes

| Entity | Index | Fields |
|--------|-------|--------|
| Candidate | Unique | email |
| Candidate | Composite | (firstName, lastName) |
| Position | Composite | (status, department) |
| Application | Composite | (candidateId, positionId) — unique |
| Application | Composite | (stage, appliedAt) |
| Skill | Unique | name |
| User | Unique | email |

## 6. Soft Deletes

Entities with soft delete pattern (deletedAt field):
- None currently — hard deletes only. Add `deletedAt DateTime?` if needed.

## 7. Audit Fields

All entities include:
- `createdAt` — Record creation timestamp (auto-set)
- `updatedAt` — Last modification timestamp (auto-updated)

## 8. Multi-tenancy

Not currently implemented. If needed, add `tenantId` to all entities with `@@index([tenantId])`.