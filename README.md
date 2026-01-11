# Loom Commander Factory

A file-based artifact management system where Claude Code instances are stateless workers.

## Core Concept

- **Factory** = file system
- **Worker** = Claude Code instance (stateless, reads floor, does one job, dies)
- **Artifact** = thing being built (moves: inbox -> floor -> dock -> shipped)
- **Shipping** = externalization (file leaves system, gets used for real purpose)

## Structure

```
/factory/
├── manifest.json     # what exists, what state
├── clock.json        # deadlines, session state
├── log.json          # append-only decisions (immutable)
├── inbox/            # raw inputs, not claimed
├── floor/            # work in progress (has deadlines)
├── dock/             # complete, awaiting export
├── shipped/          # done, externalized
├── waste/            # abandoned (deadline passed)
└── exports/          # shipped outputs (real files)
```

## Commands

```bash
node factory/factory.js claim <artifact> [deadline_min] [default_action]
node factory/factory.js work <artifact> "<instruction>"
node factory/factory.js decide <artifact> <decision_id> <choice> [reason]
node factory/factory.js dock <artifact>
node factory/factory.js ship <artifact> <destination>
node factory/factory.js tick    # enforce deadlines
node factory/factory.js status
```

## Webapp

```bash
node factory/server.js
# -> http://localhost:3000
```

## Rules

1. Artifacts only move forward: inbox -> floor -> dock -> shipped
2. Every artifact on floor has a deadline
3. When deadline passes, default_action executes (abandon or ship_as_is)
4. Decisions are logged and cannot be edited
5. Once shipped, it's done
