---
description: "Use when implementing or reviewing homepage voice features. Produces an implementation checklist, acceptance tests, and regression checks."
name: "Voice Feature Checklist"
argument-hint: "Describe the homepage voice feature or PR to validate"
agent: "Homepage Voice Feature Builder"
tools: [read, search, execute, todo]
---
Create a practical, repo-aware checklist for the requested homepage voice feature.

Inputs:
- Feature request or PR summary: ${input}

Required output sections:
1. Scope Detection
- Identify likely target files and why.
- Call out cross-file dependencies (context, routes, API clients, styles).

2. Implementation Checklist
- Ordered task list from setup to polish.
- Include browser capability checks, permission flow, transcript handling, and audio fallback behavior.

3. Acceptance Criteria
- Functional criteria for start/stop/retry/clear controls.
- Criteria for error states: permission denied, no device, unsupported API, runtime failure.
- Responsive criteria for desktop and mobile.

4. Test Plan
- Manual tests by browser/device class.
- Suggested automated test targets if current repo setup supports them.
- Regression checks to ensure existing homepage interactions remain intact.

5. Risk Review
- Top 3 likely failure points.
- Mitigation for each.

Format expectations:
- Keep output concise and action-oriented.
- Use checkboxes for the implementation checklist.
- Include concrete references to existing project patterns when visible in the workspace.
