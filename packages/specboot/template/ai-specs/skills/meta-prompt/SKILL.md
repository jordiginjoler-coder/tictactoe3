---
name: meta-prompt
description: Use when a prompt needs improvement. Rewrites prompts using prompt-engineering best practices for precise and complete results.
author: LIDR.co
version: 1.1.0
---

# Meta-Prompt Skill

Expert prompt engineer. Given a prompt, restructure it using best practices for structure (role, objective, constraints, examples) and format to achieve precise, exhaustive results. Stick only to the requested objective.

## Instructions

### Input
The original prompt is provided as `$ARGUMENTS` or in the user's message.

### Process

1. **Analyze** the original prompt for:
   - Implicit vs explicit requirements
   - Missing context or constraints
   - Ambiguities or underspecified outcomes
   - Missing output format requirements
   - Missing quality criteria

2. **Restructure** using this template:

```markdown
# Optimized Prompt

## Role
[Explicit persona: expert in X with Y years experience in Z]

## Objective
[Single clear outcome. What exactly should be produced?]

## Context
[Relevant background the model needs. Project details, constraints, existing code patterns, standards documents to follow.]

## Input
[What is provided. Format, structure, example if helpful.]

## Constraints & Rules
- [Hard constraints: MUST/MUST NOT]
- [Style/tone requirements]
- [Technical requirements: language, framework, patterns]

## Output Format
[Exact structure expected. Sections, formatting, file paths, code blocks.]

## Quality Criteria
[How to evaluate success. Checklist or rubric.]

## Examples (if applicable)
[1-2 minimal examples showing desired output. Not templates.]
```

3. **Output** only the optimized prompt in the structure above.

### Best Practices Applied

| Principle | Application |
|-----------|-------------|
| **Explicit Role** | Define expertise level and domain |
| **Single Objective** | One clear deliverable |
| **Rich Context** | Include relevant standards, patterns, file locations |
| **Explicit Constraints** | Hard rules as MUST/MUST NOT bullets |
| **Structured Output** | Exact format with sections |
| **Quality Criteria** | Measurable success definition |
| **Minimal Examples** | Show, don't tell — 1-2 real examples |

### Common Improvements

- Vague "improve code" → "Refactor X to follow Y pattern per docs/Z.md"
- Missing format → Explicit markdown/code structure
- No quality bar → Coverage %, lint rules, type safety requirements
- Implicit context → Explicit file paths, standards references
- Open-ended → Bounded scope with clear done criteria

---

# Original Prompt

$ARGUMENTS