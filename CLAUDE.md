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


## Jira Context Tools (PathX 2 Board)

Scripts at `/scripts/jira/` — read-only access for context gathering.

### Commands
```bash
python scripts/jira/board_state.py          # Current board snapshot (all columns)
python scripts/jira/board_state.py --column "TO DO"  # Single column
python scripts/jira/search.py "keyword"     # Find related tickets by text
python scripts/jira/search.py --jql "status = 'In Development'"  # Raw JQL
python scripts/jira/get_ticket.py P2-1234   # Full ticket detail
```

### Drafting Tickets
1. Gather context (board state, related tickets, user request)
2. Draft to `/drafts/tickets/<name>.md` using structure:
   - Summary (one line)
   - Strategic Context (why this matters)
   - User Story (As a... I want... so that...)
   - Acceptance Criteria (testable conditions)
   - Stakeholder Notes (who requested, what they said)
   - Technical Notes (if relevant)
   - Labels (suggested)
3. User reviews, pastes to Jira manually

### Stop If
- Creating/updating tickets via API (read-only access only)
- Drafting without gathering board context first
- Thin tickets (no strategic context, no acceptance criteria)
```

---

**Directory addition:**
```
/loomcommander
├── CLAUDE.md
├── minwrite/
├── scripts/
│   └── jira/
│       ├── auth.py
│       ├── board_state.py
│       ├── search.py
│       └── get_ticket.py
├── templates/
│   └── ticket.md
└── drafts/
    └── tickets/