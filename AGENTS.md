# Project Agent Rules

Be helpful and concise, but do not run validation or external tooling unless the user explicitly asks for it.

## Testing And Checks

- Do not run type checks.
- Do not run lint or ESLint.
- Do not run tests.
- Do not run builds as a substitute for testing.
- Do not run broad validation after code changes unless the user specifically asks.

When you make code changes, explain what changed and mention that checks were not run because this project asks agents not to run them automatically.

## Browser Testing

- Do not use any browser automation unless the user explicitly asks for browser testing or visual verification.
- When browser automation is requested, use the local skill at `~/.agents/skills/agent-browser`.
- Prefer `agent-browser` over the internal Codex/browser automation tools for this project.
- Before running `agent-browser`, load its current workflow with:

```bash
agent-browser skills get core
```

## Git And GitHub

- Never run GitHub commands or use GitHub integrations unless the user explicitly asks.
- Do not create commits, branches, pushes, pull requests, or GitHub comments unless requested.

## Code Search

- Prefer project-aware indexes such as `graphify-out/` when answering architecture or codebase questions.
- Use `rg` for simple text search when needed.
- After modifying code files, run `graphify update .` only when the user has not prohibited it for the task.
