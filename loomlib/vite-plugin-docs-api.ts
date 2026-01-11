/**
 * Vite plugin: Provides /api/docs endpoints for reading/writing documents.
 *
 * In dev mode, documents are read directly from markdown files (live source).
 * This enables browser edits to persist without page refreshes.
 * Only active in dev mode (not included in production builds).
 */

import type { Plugin } from 'vite';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

// Types matching src/types.ts
type DocumentType = 'source' | 'note' | 'framework' | 'instance' | 'index';
type FrameworkKind = 'toolkit' | 'domain';
type DocumentStatus = 'incubating' | 'draft' | 'verified' | 'captured';

// Conducting frontmatter types
type DocumentIntent = 'research' | 'build' | 'capture' | 'organize' | 'produce';
type ExecutionState = 'pending' | 'in_progress' | 'completed' | 'resolved';
type RelationType = 'informs' | 'method' | 'source' | 'prior' | 'defines';
interface UpstreamRef {
  doc: string;
  relation: RelationType;
}

// Default intent by document type
const DEFAULT_INTENT: Record<DocumentType, DocumentIntent> = {
  source: 'capture',
  note: 'capture',
  framework: 'build',
  instance: 'produce',
  index: 'organize',
};

interface Document {
  id: string;
  title: string;
  content: string;
  type: DocumentType;
  framework_kind: FrameworkKind | null;
  perspective: string | null;
  framework_ids: string[];
  source_id: string | null;
  output: string | null;
  status: DocumentStatus;
  tags: string[];
  createdAt: number;
  modifiedAt: number;
  // Domain membership
  domain?: string;
  // Conducting fields
  intent?: DocumentIntent;
  execution_state?: ExecutionState;
  upstream?: UpstreamRef[];
  downstream?: UpstreamRef[];
}

// Omit timestamps for API responses (client adds them)
type ApiDocument = Omit<Document, 'createdAt' | 'modifiedAt'>;

// ID prefix to type mapping
const TYPE_FROM_PREFIX: Record<string, DocumentType> = {
  'fw-': 'framework',
  'inst-': 'instance',
  'note-': 'note',
  'src-': 'source',
  'idx-': 'index',
};

// Files to exclude
const EXCLUDED_FILES = ['aesthetic-invariants.md'];

function getTypeFromId(id: string): DocumentType | null {
  for (const [prefix, type] of Object.entries(TYPE_FROM_PREFIX)) {
    if (id.startsWith(prefix)) return type;
  }
  return null;
}

function getSlugFromId(id: string): string {
  for (const prefix of Object.keys(TYPE_FROM_PREFIX)) {
    if (id.startsWith(prefix)) {
      return id.slice(prefix.length);
    }
  }
  return id;
}

/**
 * Parse upstream/downstream refs from YAML.
 */
function parseUpstreamRefs(data: unknown): UpstreamRef[] {
  if (!Array.isArray(data)) return [];
  return data
    .filter((item): item is { doc: string; relation: string } =>
      typeof item === 'object' && item !== null && 'doc' in item && 'relation' in item
    )
    .map(item => ({
      doc: String(item.doc),
      relation: item.relation as RelationType,
    }));
}

/**
 * Parse a markdown file into a document object.
 */
function parseMarkdownFile(filePath: string): ApiDocument | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(raw);
    const data = parsed.data;

    // Validate required fields
    if (!data.id || !data.title || !data.type || !data.status) {
      console.warn(`[docs-api] Invalid document (missing fields): ${filePath}`);
      return null;
    }

    const docType = data.type as DocumentType;

    return {
      id: String(data.id),
      title: String(data.title),
      type: docType,
      framework_kind: data.type === 'framework' ? (data.framework_kind as FrameworkKind) : null,
      perspective: data.perspective != null ? String(data.perspective) : null,
      framework_ids: Array.isArray(data.framework_ids) ? data.framework_ids.map(String) : [],
      source_id: data.source_id != null ? String(data.source_id) : null,
      output: data.output != null ? String(data.output) : null,
      status: data.status as DocumentStatus,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      content: parsed.content.trim(),
      // Domain membership (defaults based on output or 'etymon')
      domain: data.domain != null ? String(data.domain) : (data.output != null ? String(data.output) : null),
      // Conducting fields (with defaults for backward compatibility)
      intent: (data.intent as DocumentIntent) ?? DEFAULT_INTENT[docType],
      execution_state: (data.execution_state as ExecutionState) ?? 'completed',
      upstream: parseUpstreamRefs(data.upstream),
      downstream: parseUpstreamRefs(data.downstream),
    };
  } catch (err) {
    console.error(`[docs-api] Failed to parse: ${filePath}`, err);
    return null;
  }
}

/**
 * Read all markdown files from docs directory.
 */
function readAllDocs(docsDir: string): ApiDocument[] {
  const docs: ApiDocument[] = [];
  const types: DocumentType[] = ['framework', 'instance', 'note', 'source', 'index'];

  for (const type of types) {
    const typeDir = path.join(docsDir, type);
    if (!fs.existsSync(typeDir)) continue;

    const files = fs.readdirSync(typeDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      if (EXCLUDED_FILES.includes(file)) continue;

      const filePath = path.join(typeDir, file);
      const doc = parseMarkdownFile(filePath);
      if (doc) {
        docs.push(doc);
      }
    }
  }

  return docs;
}

/**
 * Serialize upstream/downstream refs to YAML.
 */
function serializeUpstreamRefs(refs: UpstreamRef[] | undefined): string {
  if (!refs || refs.length === 0) return '[]';
  const lines = refs.map(ref => `  - doc: ${ref.doc}\n    relation: ${ref.relation}`);
  return '\n' + lines.join('\n');
}

/**
 * Serialize a document to markdown with YAML frontmatter.
 */
function serializeToMarkdown(doc: Document | ApiDocument): string {
  const lines: string[] = ['---'];

  // Descriptive frontmatter
  lines.push(`id: ${doc.id}`);
  lines.push(`title: "${doc.title.replace(/"/g, '\\"')}"`);
  lines.push(`type: ${doc.type}`);
  lines.push(`framework_kind: ${doc.framework_kind ?? 'null'}`);
  lines.push(`framework_ids: [${doc.framework_ids.join(', ')}]`);
  lines.push(`source_id: ${doc.source_id ?? 'null'}`);
  lines.push(`output: ${doc.output ?? 'null'}`);
  lines.push(`domain: ${doc.domain ?? 'null'}`);
  lines.push(`perspective: ${doc.perspective ?? 'null'}`);
  lines.push(`status: ${doc.status}`);
  lines.push(`tags: [${doc.tags.join(', ')}]`);

  // Conducting frontmatter
  lines.push('');
  lines.push('# ─── CONDUCTING ─────────────────────────────────────────────');
  lines.push(`intent: ${doc.intent ?? DEFAULT_INTENT[doc.type]}`);
  lines.push(`execution_state: ${doc.execution_state ?? 'completed'}`);
  lines.push(`upstream: ${serializeUpstreamRefs(doc.upstream)}`);
  lines.push(`downstream: ${serializeUpstreamRefs(doc.downstream)}`);

  lines.push('---');
  lines.push('');
  lines.push(doc.content);

  return lines.join('\n');
}

/**
 * Get the file path for a document.
 */
function getDocPath(docsDir: string, docId: string, docType: DocumentType): string {
  const slug = getSlugFromId(docId);
  return path.join(docsDir, docType, `${slug}.md`);
}

export function docsApiPlugin(): Plugin {
  let docsDir: string;

  return {
    name: 'docs-api',

    configResolved(config) {
      docsDir = path.resolve(config.root, 'docs');
    },

    configureServer(server) {
      // GET /api/docs - List all documents (read from markdown files)
      server.middlewares.use(async (req, res, next) => {
        // Match /api/docs or /api/docs?... (no trailing path)
        const url = req.url?.split('?')[0];
        if (req.method !== 'GET' || url !== '/api/docs') {
          return next();
        }

        console.log('[docs-api] Reading all documents from markdown...');
        const docs = readAllDocs(docsDir);
        console.log(`[docs-api] Found ${docs.length} documents`);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(docs));
      });

      // GET /api/docs/:id - Get single document
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'GET' || !req.url?.startsWith('/api/docs/')) {
          return next();
        }

        const docId = decodeURIComponent(req.url.slice('/api/docs/'.length));

        // Skip if this is the list endpoint
        if (!docId) return next();

        const docType = getTypeFromId(docId);
        if (!docType) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Invalid document ID prefix: ${docId}` }));
          return;
        }

        const filePath = getDocPath(docsDir, docId, docType);

        if (!fs.existsSync(filePath)) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Document not found', id: docId }));
          return;
        }

        const doc = parseMarkdownFile(filePath);
        if (!doc) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Failed to parse document' }));
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(doc));
      });

      // POST /api/docs/:id - Save document to markdown
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'POST' || !req.url?.startsWith('/api/docs/')) {
          return next();
        }

        const docId = decodeURIComponent(req.url.slice('/api/docs/'.length));

        const docType = getTypeFromId(docId);
        if (!docType) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Invalid document ID prefix: ${docId}` }));
          return;
        }

        // Read request body
        let body = '';
        for await (const chunk of req) {
          body += chunk;
        }

        let doc: Document;
        try {
          doc = JSON.parse(body);
        } catch (err) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid JSON body' }));
          return;
        }

        // Validate document ID matches URL
        if (doc.id !== docId) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Document ID mismatch: URL=${docId}, body=${doc.id}` }));
          return;
        }

        // Serialize to markdown
        const markdown = serializeToMarkdown(doc);
        const filePath = getDocPath(docsDir, docId, docType);

        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Write file
        try {
          fs.writeFileSync(filePath, markdown, 'utf-8');
          console.log(`[docs-api] Saved: ${filePath}`);

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, path: filePath }));
        } catch (err) {
          console.error(`[docs-api] Failed to write: ${filePath}`, err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Failed to write file: ${err}` }));
        }
      });
    },
  };
}
