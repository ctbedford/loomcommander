/**
 * Build-time script: Generates seed-data.ts from markdown files.
 *
 * Reads all markdown files in loomlib/docs/, parses YAML frontmatter,
 * validates against Document schema, and generates src/data/seed-data.ts.
 *
 * Usage: npx tsx scripts/generate-seed.ts
 */

import matter from 'gray-matter';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'fs/promises';

// Types matching src/types.ts
type DocumentType = 'source' | 'note' | 'framework' | 'instance' | 'index';
type FrameworkKind = 'toolkit' | 'domain';
type DocumentStatus = 'incubating' | 'draft' | 'verified' | 'captured';

interface SeedDoc {
  id: string;
  title: string;
  type: DocumentType;
  framework_kind: FrameworkKind | null;
  perspective: string | null;
  framework_ids: string[];
  source_id: string | null;
  output: string | null;
  status: DocumentStatus;
  tags: string[];
  content: string;
}

interface ValidationError {
  file: string;
  errors: string[];
}

// ID prefix validation
const ID_PREFIXES: Record<DocumentType, string> = {
  framework: 'fw-',
  instance: 'inst-',
  note: 'note-',
  source: 'src-',
  index: 'idx-',
};

// Valid enum values
const VALID_TYPES: DocumentType[] = ['source', 'note', 'framework', 'instance', 'index'];
const VALID_STATUSES: DocumentStatus[] = ['incubating', 'draft', 'verified', 'captured'];
const VALID_FRAMEWORK_KINDS: FrameworkKind[] = ['toolkit', 'domain'];

// Files to exclude
const EXCLUDED_FILES = ['aesthetic-invariants.md'];

function validateDocument(filePath: string, data: Record<string, unknown>, content: string): { doc: SeedDoc | null; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!data.id || typeof data.id !== 'string') {
    errors.push('Missing or invalid "id" field');
  }
  if (!data.title || typeof data.title !== 'string') {
    errors.push('Missing or invalid "title" field');
  }
  if (!data.type || !VALID_TYPES.includes(data.type as DocumentType)) {
    errors.push(`Invalid "type" field: ${data.type}. Must be one of: ${VALID_TYPES.join(', ')}`);
  }
  if (!data.status || !VALID_STATUSES.includes(data.status as DocumentStatus)) {
    errors.push(`Invalid "status" field: ${data.status}. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  // ID prefix validation
  if (data.id && data.type && VALID_TYPES.includes(data.type as DocumentType)) {
    const expectedPrefix = ID_PREFIXES[data.type as DocumentType];
    if (!String(data.id).startsWith(expectedPrefix)) {
      errors.push(`ID "${data.id}" should start with "${expectedPrefix}" for type "${data.type}"`);
    }
  }

  // framework_kind validation
  if (data.type === 'framework') {
    if (!data.framework_kind || !VALID_FRAMEWORK_KINDS.includes(data.framework_kind as FrameworkKind)) {
      errors.push(`Framework must have "framework_kind" set to "toolkit" or "domain"`);
    }
  } else if (data.framework_kind !== null && data.framework_kind !== undefined) {
    // Non-frameworks should have null framework_kind
    if (data.framework_kind !== null) {
      errors.push(`Non-framework documents should have "framework_kind: null"`);
    }
  }

  // Array fields
  if (data.framework_ids !== undefined && !Array.isArray(data.framework_ids)) {
    errors.push('"framework_ids" must be an array');
  }
  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    errors.push('"tags" must be an array');
  }

  if (errors.length > 0) {
    return { doc: null, errors };
  }

  // Build document
  const doc: SeedDoc = {
    id: String(data.id),
    title: String(data.title),
    type: data.type as DocumentType,
    framework_kind: data.type === 'framework' ? (data.framework_kind as FrameworkKind) : null,
    perspective: data.perspective != null ? String(data.perspective) : null,
    framework_ids: Array.isArray(data.framework_ids) ? data.framework_ids.map(String) : [],
    source_id: data.source_id != null ? String(data.source_id) : null,
    output: data.output != null ? String(data.output) : null,
    status: data.status as DocumentStatus,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    content: content.trim(),
  };

  return { doc, errors: [] };
}

function escapeTemplateString(str: string): string {
  // Escape backticks and ${} in template literals
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`;
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return `[${value.map(v => `'${String(v).replace(/'/g, "\\'")}'`).join(', ')}]`;
  }
  return String(value);
}

function generateSeedDataTs(docs: SeedDoc[]): string {
  // Sort: frameworks first, then indexes, sources, instances
  const typeOrder: Record<DocumentType, number> = {
    framework: 0,
    index: 1,
    source: 2,
    instance: 3,
    note: 4,
  };

  const sorted = [...docs].sort((a, b) => {
    const typeCompare = typeOrder[a.type] - typeOrder[b.type];
    if (typeCompare !== 0) return typeCompare;
    // Within same type, sort by status (verified first) then by id
    const statusOrder = { verified: 0, draft: 1, incubating: 2, captured: 3 };
    const statusCompare = statusOrder[a.status] - statusOrder[b.status];
    if (statusCompare !== 0) return statusCompare;
    return a.id.localeCompare(b.id);
  });

  const docStrings = sorted.map(doc => {
    return `  {
    id: ${formatValue(doc.id)},
    title: ${formatValue(doc.title)},
    type: ${formatValue(doc.type)},
    framework_kind: ${formatValue(doc.framework_kind)},
    perspective: ${formatValue(doc.perspective)},
    framework_ids: ${formatValue(doc.framework_ids)},
    source_id: ${formatValue(doc.source_id)},
    output: ${formatValue(doc.output)},
    status: ${formatValue(doc.status)},
    tags: ${formatValue(doc.tags)},
    content: \`${escapeTemplateString(doc.content)}\`,
  }`;
  });

  return `// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// Generated by: npx tsx scripts/generate-seed.ts
// Source: loomlib/docs/**/*.md

import type { Document } from '../types.ts';

type SeedDoc = Omit<Document, 'createdAt' | 'modifiedAt'>;

export const seedData: SeedDoc[] = [
${docStrings.join(',\n')},
];
`;
}

async function main() {
  const docsDir = path.join(import.meta.dirname, '..', 'docs');
  const outputPath = path.join(import.meta.dirname, '..', 'src', 'data', 'seed-data.ts');

  // Find all markdown files
  const pattern = path.join(docsDir, '**', '*.md');
  const files: string[] = [];

  for await (const file of glob(pattern)) {
    const basename = path.basename(file);
    if (EXCLUDED_FILES.includes(basename)) {
      console.log(`EXCLUDE: ${basename}`);
      continue;
    }
    files.push(file);
  }

  console.log(`Found ${files.length} markdown files\n`);

  const docs: SeedDoc[] = [];
  const validationErrors: ValidationError[] = [];
  const seenIds = new Set<string>();

  for (const file of files) {
    const relativePath = path.relative(docsDir, file);
    const raw = fs.readFileSync(file, 'utf-8');

    let parsed;
    try {
      parsed = matter(raw);
    } catch (err) {
      validationErrors.push({
        file: relativePath,
        errors: [`Failed to parse frontmatter: ${err}`],
      });
      continue;
    }

    const { doc, errors } = validateDocument(relativePath, parsed.data, parsed.content);

    if (errors.length > 0) {
      validationErrors.push({ file: relativePath, errors });
      continue;
    }

    if (doc) {
      // Check for duplicate IDs
      if (seenIds.has(doc.id)) {
        validationErrors.push({
          file: relativePath,
          errors: [`Duplicate ID: ${doc.id}`],
        });
        continue;
      }
      seenIds.add(doc.id);
      docs.push(doc);
      console.log(`OK: ${relativePath} (${doc.id})`);
    }
  }

  // Report errors
  if (validationErrors.length > 0) {
    console.error('\n=== VALIDATION ERRORS ===\n');
    for (const { file, errors } of validationErrors) {
      console.error(`${file}:`);
      for (const err of errors) {
        console.error(`  - ${err}`);
      }
    }
    console.error(`\n${validationErrors.length} file(s) with errors. Aborting.\n`);
    process.exit(1);
  }

  // Generate output
  const output = generateSeedDataTs(docs);
  fs.writeFileSync(outputPath, output, 'utf-8');

  console.log(`\n=== SUCCESS ===`);
  console.log(`Generated: ${outputPath}`);
  console.log(`Documents: ${docs.length}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
