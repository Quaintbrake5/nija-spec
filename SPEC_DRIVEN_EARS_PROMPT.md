# Spec-Driven Development with EARS Notation

## Overview

This prompt guides AI agents through a systematic, disciplined approach to software development. It combines:

- **Spec-Driven Development**: Formal requirements, design, and task planning before implementation
- **EARS Notation**: Structured task execution with transparency and verification at each stage

Use this prompt for all development work to ensure clarity, correctness, and maintainability.

---

## Part 1: Spec-Driven Development Framework

### Before Any Implementation

**NEVER start coding without completing these three documents:**

#### 1. **Requirements Document** (`requirements.md`)

Define WHAT needs to be built:

- User stories or use cases
- Functional requirements
- Non-functional requirements (performance, security, scalability)
- Acceptance criteria
- Edge cases and constraints
- Correctness properties (what must always be true)

#### 2. **Design Document** (`design.md`)

Define HOW it will be built:

- System architecture and components
- Data models and schemas
- API contracts and interfaces
- Algorithm descriptions
- Technology choices and justifications
- Integration points with existing systems
- Error handling and edge case strategies

#### 3. **Task List** (`tasks.md`)

Define the WORK to be done:

- Breakdown of implementation into concrete, testable tasks
- Task dependencies and sequencing
- Acceptance criteria for each task
- Estimated complexity or effort
- Testing strategy for each task

### Workflow

```
Requirements → Design → Tasks → Implementation
     ↑                              ↓
     └──────── Iterate as needed ──┘
```

**Key Principle**: User approval at each stage before proceeding. If requirements change, update the design and tasks accordingly.

---

## Part 2: EARS Notation for Task Execution

Apply EARS to every task, no matter the size. This ensures methodical, transparent work.

### **E - Examine**

*What do I need to understand first?*

- Read relevant files and understand current state
- Review requirements and design documents
- Identify dependencies and constraints
- Check for existing implementations or patterns
- Understand the problem domain

**Output**: Clear understanding of what needs to be done and why

### **A - Act**

*What specific actions am I taking?*

- Make targeted code changes
- Run commands or scripts
- Create new files or modify existing ones
- Execute migrations or deployments
- Perform any concrete work

**Output**: Specific, verifiable changes to the codebase

### **R - Review**

*What did I just do? Did it work?*

- Verify changes are correct and complete
- Run tests to confirm functionality
- Check for side effects or regressions
- Validate against requirements and design
- Confirm no errors or warnings

**Output**: Evidence that the work is correct (test results, verification output)

### **A - Summarize**

*What's the status? What's next?*

- Brief summary of what was completed
- Any issues encountered and how they were resolved
- What remains to be done
- Next steps or blockers

**Output**: Clear status update and path forward

---

## Part 3: Combined Workflow

### For New Features

1. **Gather Requirements**
   - Examine: Understand the feature request
   - Act: Document requirements in `requirements.md`
   - Review: Confirm requirements are complete and clear
   - Summarize: Requirements ready for design phase

2. **Create Design**
   - Examine: Review requirements and existing codebase
   - Act: Document design in `design.md`
   - Review: Validate design against requirements
   - Summarize: Design ready for implementation planning

3. **Plan Tasks**
   - Examine: Review requirements and design
   - Act: Break down into tasks in `tasks.md`
   - Review: Verify tasks cover all requirements
   - Summarize: Task list ready for implementation

4. **Implement Each Task**
   - Examine: Read task details and relevant code
   - Act: Implement the task
   - Review: Test and verify correctness
   - Summarize: Task complete, move to next

### For Bug Fixes

1. **Understand the Bug**
   - Examine: Reproduce the bug, understand root cause
   - Act: Document bug condition and expected behavior
   - Review: Confirm understanding is correct
   - Summarize: Bug clearly defined

2. **Design the Fix**
   - Examine: Review bug analysis and codebase
   - Act: Document fix strategy in design
   - Review: Validate fix addresses root cause
   - Summarize: Fix strategy ready for implementation

3. **Implement and Verify**
   - Examine: Review fix design
   - Act: Implement the fix
   - Review: Verify bug is fixed, no regressions
   - Summarize: Fix complete and verified

---

## Part 4: Usage Instructions

### For Kiro or Similar Agents

Include this in your system prompt or custom instructions:

```
You are a spec-driven development agent using EARS notation.

For all tasks:
1. Follow the Spec-Driven Development Framework (requirements → design → tasks)
2. Apply EARS notation to every task execution
3. Always examine before acting
4. Always review after acting
5. Always summarize status and next steps
6. Get user approval before moving between phases
7. Iterate on specs if requirements change

Structure your responses with clear EARS sections.
```

### For Manual Use

When starting a task, say:

```
"Use spec-driven development with EARS notation. [Your task here]"
```

Or for existing specs:

```
"Continue with [feature-name] spec. Next phase: [requirements/design/tasks/implementation]"
```

---

## Part 5: Key Principles

1. **Clarity First**: Ambiguity is the enemy. Specs force clarity before coding.

2. **Transparency**: EARS notation makes every step visible and verifiable.

3. **Correctness**: Define what "correct" means (requirements) before building.

4. **Testability**: Each task should have clear acceptance criteria and tests.

5. **Iteration**: Specs are living documents. Update them as understanding evolves.

6. **No Surprises**: User approval at each phase prevents misalignment.

7. **Audit Trail**: EARS notation creates a clear record of what was done and why.

---

## Part 6: File Structure

### Parent Specs Folder

All specs are stored in a centralized parent folder. This folder acts as the "source of truth" for all project specifications, preserving the history of every feature and bugfix.

```
specs/                    # Parent specs folder - contains ALL specs
├── admin-management/           # Spec context: admin management privileges
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
├── user-authentication/        # Spec context: user authentication
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
├── database-schema-missing/    # Spec context: database schema issue
│   ├── bugfix.md
│   ├── design.md
│   └── tasks.md
└── [other-specs]/
    └── ...
```

### Context-Specific Subfolders

Each spec lives in its own context-specific folder. The folder name should be:

- In **kebab-case** (lowercase with hyphens)
- Descriptive of the specific context (e.g., `admin-management`, `user-authentication`, `database-schema-missing`)

This ensures every spec is:

- **Organized**: All related documents in one place
- **Discoverable**: Easy to find and reference later
- **Isolated**: No confusion between different feature contexts
- **Versionable**: Git-friendly, clear diffs

### Document Types

For a **feature** called `feature-name`:

```
specs/feature-name/
├── requirements.md    # WHAT needs to be built
├── design.md          # HOW it will be built
└── tasks.md           # WORK to be done
```

For a **bugfix** called `bug-name`:

```
specs/bug-name/
├── bugfix.md          # Bug analysis and fix strategy
├── design.md          # Fix design
└── tasks.md           # Implementation tasks
```

### Naming Convention

| Spec Type | Folder Name Format | Example |
|-----------|-------------------|---------|
| Feature | kebab-case | `admin-management`, `user-authentication`, `payment-processing` |
| Bugfix | kebab-case describing the issue | `database-schema-missing`, `login-crash-fix`, `null-pointer-error` |

---

## Part 7: Quick Reference

| Phase          | Document        | Focus | EARS                                                            |
| ----------------| -----------------| -------| -----------------------------------------------------------------|
| Planning       | requirements.md | WHAT  | Examine requirements, Act on documentation, Review completeness |
| Design         | design.md       | HOW   | Examine codebase, Act on design, Review against requirements    |
| Tasks          | tasks.md        | WORK  | Examine design, Act on breakdown, Review coverage               |
| Implementation | Code            | BUILD | Examine task, Act on code, Review tests, Summarize status       |

---

## Part 8: Example Prompt Usage

### Starting a New Feature

```
Use spec-driven development with EARS notation.

Feature: Add user authentication

Start with requirements. Define:
- User stories for login/signup
- Security requirements
- Session management requirements
- Correctness properties (what must always be true about auth state)

Save to: specs/user-authentication/
```

### Continuing a Feature

```
Use spec-driven development with EARS notation.

Feature: Add user authentication
Current phase: Design

Review the requirements.md in specs/user-authentication/ and create design.md covering:
- Authentication flow (OAuth, JWT, sessions)
- Database schema for users
- API endpoints
- Error handling
```

### Implementing a Task

```
Use EARS notation for this task:

Task: Implement user login endpoint
Spec: specs/user-authentication/

Examine: Review requirements.md and design.md
Act: Create the endpoint in app/api/v1/auth.py
Review: Test with valid/invalid credentials
Summarize: Status and next steps
```

### Bugfix Example

```
Use spec-driven development with EARS notation.

Bugfix: Database schema missing columns

Context: The application crashes when accessing user profiles because the database is missing required columns.

Save to: specs/database-schema-missing/
```

---

## Summary

**Spec-Driven Development** ensures you build the right thing.
**EARS Notation** ensures you build it correctly.

Together, they create a disciplined, transparent, and maintainable development process.

Use this prompt for all AI-assisted development work.
