# Minimalist markdown writing app. Ship: textarea that feels like paper.

## Read First (GLOB then READ)
`/minwrite/src/editor/*.ts` textarea, cursor, selection - READ FIRST for any edit work
`/minwrite/src/document/*.ts` markdown AST, parse/serialize - READ FIRST for format work
`/minwrite/src/library/*.ts` document list, folders, search
`/minwrite/src/export/*.ts` PDF, HTML, DOCX renderers
`/minwrite/src/ui/*.{ts,css}` shell chrome only: sidebar, themes
`/minwrite/specs/*.md` feature specs - READ BEFORE implementing any feature

## Workflow
1. EXPLORE: GLOB `/minwrite/specs/*.md` + relevant `/minwrite/src/**/*.ts`, then READ matching files
2. PLAN: Write plan to /minwrite/scratch/plan.md, get approval before coding
3. CODE: One feature per branch: feat/<name>, fix/<name>, refactor/<name>
4. TEST:
   - Data layer (`src/library/*`): `cd minwrite && npm test` must pass
   - UI layer (`src/editor/*`, `src/ui/*`): `npm run build` + manual browser verification
   - New data logic? Write tests first (TDD)
5. COMMIT: Small commits, imperative mood, reference spec if exists
6. VERIFY: `cd minwrite && npm run build && npm test` green = feature complete

## Stop If
- Coding before reading relevant /src/ and /specs/
- Multi-feature branches or commits
- Continuing past 15 turns without /clear or commit checkpoint
- Adding dependencies without explicit approval
- WYSIWYG, toolbars, or any chrome that interrupts writing

## Before Any Change
> Have I read the spec? Is the plan approved? Will tests/build prove completion?

**No spec read = no code. No plan approval = no implementation. No green build = not done.**
