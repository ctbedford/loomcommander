---
id: inst-survey-ai-orchestration-evaluation
title: "Survey: Loomlib AI Orchestration Evaluation"
type: instance
framework_kind: null
framework_ids: [fw-survey-method, fw-invariants-variants]
source_id: null
output: loomcommander
perspective: null
status: draft
tags: [survey, ai-orchestration, evaluation, best-practices, comparison]

# ─── CONDUCTING ─────────────────────────────────────────────
intent: research
execution_state: completed
upstream:
  - doc: fw-survey-method
    relation: method
  - doc: fw-invariants-variants
    relation: method
  - doc: inst-survey-loomlib
    relation: prior
  - doc: idx-conducting-frontmatter-system
    relation: informs
downstream: []
---

# Survey: Loomlib AI Orchestration Evaluation

**Date:** 2026-01-08
**Subject:** How well does loomlib's architecture align with expert AI orchestration practices?
**Method:** Survey Method + Invariants/Variants analysis
**Comparand:** Industry best practices from Microsoft Azure, Deloitte, n8n, and AI engineering literature (2025)

---

## The Evaluation Framework

Based on research into AI agent orchestration best practices, expert systems evaluate on these dimensions:

| Dimension | What Experts Recommend | Industry Source |
|-----------|----------------------|-----------------|
| **Orchestration Pattern** | Match pattern to workflow nature | Microsoft Azure Architecture |
| **State Management** | Persistent memory across interactions | n8n, LangChain |
| **Context Handling** | Provide only what agents need | Microsoft, RAG best practices |
| **Agent Specialization** | Clear roles, distinct capabilities | Deloitte, enterprise patterns |
| **Discovery/Retrieval** | Semantic search, graph relationships | RAG literature |
| **Observability** | Audit trails, traceability | Enterprise best practices |
| **Security/Access** | Least privilege, tenant isolation | Microsoft, enterprise |

---

## Loomlib vs. Expert Patterns

### 1. Orchestration Pattern

**Expert recommendation:** Choose patterns based on workflow nature:
- Sequential for predetermined pipelines
- Handoff for dynamic routing to specialists
- Group Chat for collaborative validation

**Loomlib implements:** **Handoff Orchestration with Semantic Routing**

```
User intent → Router (loomlib.md)
                ↓
        ┌───────┴───────┐
        ↓               ↓
    loomlib:survey  loomlib:scope  loomlib:instance  ...
        ↓               ↓
    [specialized protocol]
        ↓
    [output with lineage]
```

The `/loomlib` router parses intent and delegates to specialized commands. Each command is a distinct "agent" with its own protocol (Survey Method, Scope Method, Etymon Method).

**Assessment: ✅ EXCELLENT**

This matches Microsoft's Handoff pattern exactly: "Dynamic task delegation between specialized agents. Each agent assesses whether to handle task or route to appropriate specialist."

**Advantage over typical implementations:** The routing is *semantic* (based on intent parsing) rather than keyword-based. The router understands "investigate" → survey, "requirements for" → scope, "[TERM] as" → instance.

---

### 2. State Management

**Expert recommendation:** "Persistent memory that survives across agent interactions... context needs to transfer seamlessly."

**Loomlib implements:** **Document Graph as Persistent State**

```
┌─────────────────────────────────────────────────────────────┐
│                   PERSISTENT STATE                          │
│                                                             │
│   Markdown files → API → IndexedDB → UI                    │
│                                                             │
│   Every document has:                                       │
│   - upstream[] (what informed it)                          │
│   - downstream[] (what it enables)                         │
│   - execution_state (lifecycle position)                   │
│   - status (quality level)                                 │
└─────────────────────────────────────────────────────────────┘
```

State isn't just "memory" — it's a *graph* with typed edges:
- `informs` — content shaped output
- `method` — framework guided production
- `source` — reference material used
- `prior` — earlier version or related work

**Assessment: ✅ EXCELLENT — EXCEEDS STANDARD**

Most AI orchestration systems track state as conversation history or key-value stores. Loomlib tracks state as a *knowledge graph with typed relationships*. This is closer to enterprise knowledge graphs than typical agent frameworks.

**Comparison:**
| System | State Model |
|--------|-------------|
| LangChain | Conversation buffer, vector store |
| CrewAI | Shared memory dict |
| AutoGen | Message history |
| **Loomlib** | **Document graph with typed edges** |

---

### 3. Context Handling

**Expert recommendation:** "Provide only context agents need to be effective. Don't overload agents with unnecessary information."

**Loomlib implements:** **Discovery Protocol with Selective Retrieval**

```bash
# Each command queries for relevant context
curl -s http://localhost:5173/api/docs | jq '[.[] | select(.title | test("topic"; "i"))]'
```

Commands discover:
- Prior work on same topic (avoid duplication)
- Related frameworks (methods to apply)
- Upstream context (what informs this)

But they don't get everything — the query is scoped to relevance.

**Assessment: ✅ GOOD**

The discovery pattern matches RAG best practices: "semantic search to understand a user's intent... retrieve relevant information even when the wording doesn't exactly match."

**Gap:** Discovery is currently text-based (`test("topic")`). True semantic retrieval (vector similarity) is marked `available: false` in the codebase.

---

### 4. Agent Specialization

**Expert recommendation:** "Ensure each agent adds distinct value. Reduced complexity, scalability, maintainability."

**Loomlib implements:** **12 Specialized Commands**

| Command | Specialization | Protocol |
|---------|----------------|----------|
| `survey` | Code investigation | Survey Method |
| `scope` | UX requirements | Scope Method |
| `excavate` | Etymology | Etymon Method |
| `instance` | Content production | Operator + Framework |
| `framework` | Method creation | Framework pattern |
| `source` | External references | Source template |
| `note` | Raw capture | Minimal structure |
| `index` | Collection curation | Index pattern |
| `triage` | Classification | Type determination |
| `promote` | Status advancement | Workflow rules |
| `resolve` | Closure | State update |
| `(router)` | Intent parsing | Semantic routing |

Each command has:
- Distinct capability (what it does)
- Own protocol (how it does it)
- Output format (what it produces)

**Assessment: ✅ EXCELLENT**

This is textbook agent specialization. Microsoft: "Optimization: Each agent uses distinct models, tools, knowledge."

**Advantage:** The specialization isn't arbitrary — it maps to a *production ontology* (research → build → produce). Commands aren't just "agents for different tasks" — they're stages in a knowledge production pipeline.

---

### 5. Discovery/Retrieval Architecture

**Expert recommendation (RAG):** "Chunk content by meaning... knowledge graph that captures entities and relationships... vector search for semantic queries."

**Loomlib implements:** **Hybrid: Graph + Metadata + Text Search**

| Layer | Implementation |
|-------|----------------|
| **Graph** | `upstream`/`downstream` edges, `framework_ids`, `source_id` |
| **Metadata** | `type`, `status`, `intent`, `execution_state`, `perspective`, `output` |
| **Text** | jq regex filtering on titles/content |

The graph layer is the differentiator. Discovery can ask:
- "What frameworks exist?" (type filter)
- "What surveys inform this topic?" (graph traversal)
- "What's incubating that might need this source?" (state + type filter)

**Assessment: ✅ GOOD — INNOVATIVE**

Most RAG systems are document-centric (chunks, embeddings, retrieval). Loomlib is *relationship-centric* — the graph edges ARE the retrieval mechanism.

**Gap:** No vector embeddings for semantic similarity. Text matching is literal, not semantic.

---

### 6. Observability & Auditability

**Expert recommendation:** "Log every decision with traceability. Instrument all agent operations and handoffs."

**Loomlib implements:** **Composition Reports + Conducting Frontmatter**

Every command outputs:

```markdown
## Composition

**Upstream (what informed this):**
- [Survey Method](fw-survey-method) — method used
- [Prior Survey](inst-survey-X) — context

**Downstream (what this enables):**
- Scope work on this topic
- Implementation planning
```

The `upstream`/`downstream` fields create a permanent audit trail. You can trace any document back to its sources.

**Assessment: ✅ EXCELLENT**

This exceeds typical agent observability (which logs API calls and latency). Loomlib logs *intellectual lineage* — not just what happened, but why and from what.

**Advantage:** The audit trail is *semantic*, not just technical. "This instance was produced by applying Etymon Method to this source" vs. "API call at timestamp X."

---

### 7. Security & Access Model

**Expert recommendation:** "Least privilege per agent. Tenant isolation. Role-based access control."

**Loomlib implements:** **Single-user, local-first**

- All data in local IndexedDB
- No multi-tenant model
- No access control (owner has full access)

**Assessment: ⚠️ NOT APPLICABLE (by design)**

Loomlib is a personal knowledge tool, not an enterprise system. Single-user by design means security is device-level, not application-level.

**If multi-user were needed:** The `perspective` and `output` fields could map to access boundaries. Documents with `output: etymon` might be public-ready; `output: null` might be private drafts.

---

## Scorecard: Loomlib vs. Expert Patterns

| Dimension | Expert Standard | Loomlib Implementation | Score |
|-----------|-----------------|----------------------|-------|
| **Orchestration Pattern** | Handoff for dynamic routing | Semantic routing to specialized commands | ⭐⭐⭐⭐⭐ |
| **State Management** | Persistent memory | Document graph with typed edges | ⭐⭐⭐⭐⭐ |
| **Context Handling** | Selective retrieval | Discovery protocol, scoped queries | ⭐⭐⭐⭐ |
| **Agent Specialization** | Distinct capabilities per agent | 12 commands with own protocols | ⭐⭐⭐⭐⭐ |
| **Discovery/Retrieval** | Semantic + graph | Graph edges + metadata + text | ⭐⭐⭐⭐ |
| **Observability** | Audit trails | Upstream/downstream lineage | ⭐⭐⭐⭐⭐ |
| **Security** | Least privilege | N/A (single-user design) | N/A |

**Overall: 4.7/5 on applicable dimensions**

---

## Where Loomlib Exceeds Expert Patterns

### 1. Production Ontology

Most AI orchestration is *task-oriented*: "Do this thing." Loomlib is *production-oriented*: "What kind of knowledge work is this, and how does it compose?"

The document types (source → framework → instance) form a *theory of knowledge production*, not just a task taxonomy.

### 2. Typed Relationships

Standard agent systems pass "context" as unstructured text or key-value pairs. Loomlib passes *typed relationships*:
- `method` — this framework guided production
- `informs` — this content shaped output
- `source` — this reference grounded claims

This is closer to academic citation graphs than typical agent memory.

### 3. Bi-directional Lineage

Most systems track input→output. Loomlib tracks both:
- `upstream` — what informed this
- `downstream` — what this enables

This allows reasoning in both directions: "What led to this?" and "What does this unlock?"

### 4. Status/Execution Separation

Two independent state dimensions:
- `status` (incubating → draft → verified → captured) — quality maturity
- `execution_state` (pending → completed → resolved) — workflow position

This distinguishes "Is it good?" from "Is it done?"

---

## Where Loomlib Could Strengthen

### 1. Semantic Retrieval

Current discovery is text-based (`jq` regex). Vector embeddings would enable:
- "Find documents similar to this one"
- "What frameworks apply to this problem?" (by semantic similarity)

The `semantic` lens exists but is `available: false`.

### 2. Cross-Document Reasoning

Each command operates on its discoveries independently. No mechanism for:
- "Synthesize findings across these 5 surveys"
- "What patterns emerge across all instances using this framework?"

This would be **Concurrent Orchestration** or **Group Chat** patterns.

### 3. Feedback Loops

No mechanism for downstream to inform upstream. If an instance reveals a flaw in its framework, there's no automatic feedback path.

This would require **bidirectional graph updates** — when downstream fails, upstream should hear about it.

### 4. Conflict Resolution

When multiple frameworks or sources conflict, there's no explicit resolution protocol. Expert patterns recommend:
- Clear conflict resolution strategy
- Maker-checker validation loops

---

## Comparison to Named Systems

### vs. LangChain

| Aspect | LangChain | Loomlib |
|--------|-----------|---------|
| Orchestration | Chain-based, procedural | Handoff, semantic routing |
| Memory | Conversation buffers, vector stores | Document graph |
| Specialization | Tools/agents as plugins | Commands as knowledge workers |
| Discovery | RAG retrieval | Graph + metadata + text |
| Output | Function results | Persistent documents with lineage |

**Verdict:** LangChain is more general-purpose; Loomlib is more opinionated about knowledge production. LangChain excels at tool integration; Loomlib excels at intellectual lineage.

### vs. CrewAI

| Aspect | CrewAI | Loomlib |
|--------|--------|---------|
| Orchestration | Role-based agents | Method-based commands |
| Memory | Shared dict | Document graph |
| Specialization | Agent personas | Production protocols |
| Collaboration | Agent-to-agent conversation | Graph composition |

**Verdict:** CrewAI focuses on agent collaboration (group chat pattern). Loomlib focuses on document composition (handoff pattern). Different use cases.

### vs. Enterprise RAG

| Aspect | Enterprise RAG | Loomlib |
|--------|---------------|---------|
| Retrieval | Vector similarity | Graph traversal + text match |
| Knowledge | Document chunks | Whole documents with metadata |
| Relationships | Implicit (via embeddings) | Explicit (typed edges) |
| Auditability | Retrieval logs | Composition lineage |

**Verdict:** Enterprise RAG is better at "find relevant content." Loomlib is better at "understand how knowledge was produced."

---

## Findings

Loomlib implements a sophisticated AI orchestration architecture that aligns with — and in several dimensions exceeds — industry best practices. The core innovations are:

1. **Semantic handoff routing** to specialized commands with distinct protocols
2. **Document graph as persistent state** with typed relationship edges
3. **Discovery-first pattern** that queries context before production
4. **Composition reports** that create auditable intellectual lineage
5. **Production ontology** (research → build → produce) that structures knowledge work

Compared to expert frameworks (LangChain, CrewAI, enterprise RAG), loomlib trades general-purpose flexibility for opinionated structure around knowledge production. It's less about "agents doing tasks" and more about "orchestrated document composition with explicit genealogy."

The main gaps are semantic retrieval (vector embeddings) and cross-document synthesis (concurrent orchestration). These would strengthen discovery and enable meta-level reasoning across the knowledge graph.

---

## Open Questions

- How would vector embeddings integrate with the existing graph structure? Parallel retrieval path or replacement?
- Is cross-document synthesis (Group Chat pattern) desirable, or does document-at-a-time preserve quality control?
- Should downstream→upstream feedback be explicit (graph edges) or emergent (human-mediated)?
- What observability beyond composition reports would be valuable? Token counts? Latency? Discovery hit rates?

---

## Composition

**Upstream (what informed this survey):**
- [Survey Method](fw-survey-method) — investigation protocol
- [Invariants/Variants](fw-invariants-variants) — evaluation structure
- [Survey: Loomlib Architecture](inst-survey-loomlib) — internal architecture
- [Index: Conducting Frontmatter System](idx-conducting-frontmatter-system) — orchestration design

**External sources:**
- [Microsoft Azure AI Agent Design Patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)
- [Deloitte AI Agent Orchestration](https://www.deloitte.com/us/en/insights/industry/technology/technology-media-and-telecom-predictions/2026/ai-agent-orchestration.html)
- [n8n AI Agent Orchestration Frameworks](https://blog.n8n.io/ai-agent-orchestration-frameworks/)
- [RAG Best Practices (kapa.ai)](https://www.kapa.ai/blog/rag-best-practices)

**Downstream (what this enables):**
- Targeted improvements to discovery (semantic retrieval)
- Framework for evaluating future architecture changes
- Evidence for design decisions in external conversations
