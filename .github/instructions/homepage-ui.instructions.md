---
description: "Use when editing homepage React UI, voice interactions, hero sections, and landing-page UX. Enforces accessibility, responsive behavior, and consistent implementation patterns."
name: "Homepage UI and Voice Rules"
applyTo: "frontend/src/Components/Home/**/*.jsx"
---
# Homepage UI and Voice Rules

- Keep changes scoped to homepage files unless the task explicitly requests cross-page refactors.
- Preserve current design language and existing component structure before introducing new abstractions.
- Favor explicit UI states for interactive features: idle, active, loading, success, error.

## Voice Interaction Standards

- Check capability before use: verify browser support for `MediaRecorder` and speech recognition APIs.
- Request microphone permissions only when the user starts recording.
- Provide immediate visible status and actionable recovery text for denied permission or unsupported browser.
- Include keyboard-accessible controls for start, stop, retry, and clear actions.
- Always provide a typed-input fallback when voice features are unavailable.

## Accessibility and UX

- Every interactive element must be reachable by keyboard and have clear focus styles.
- Buttons that control recording must include descriptive labels and ARIA attributes.
- Status updates (recording, processing, errors) should be announced with accessible text.
- Keep desktop-first ergonomics, but do not break layout or interactions on mobile widths.

## Code Quality

- Reuse existing API/helpers/context patterns in this project before adding new utilities.
- Avoid adding new dependencies for functionality available via native browser APIs.
- Keep components readable by extracting small helper functions for permission checks and state transitions.
- Run frontend lint/build checks after non-trivial changes.
