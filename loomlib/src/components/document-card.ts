import type { Document } from '../types.ts';
import { getDocumentIcon, getDocumentColor } from '../types.ts';
import { relativeTime } from '../utils/time.ts';

export interface DocumentCardOptions {
  onClick?: (doc: Document) => void;
  showLineage?: boolean;
  compact?: boolean;
}

export function createDocumentCard(
  doc: Document,
  parentDocs: Document[] = [],
  options: DocumentCardOptions = {}
): HTMLElement {
  const { onClick, showLineage = true, compact = false } = options;

  const card = document.createElement('div');
  card.className = `doc-card ${compact ? 'doc-card--compact' : ''}`;
  card.dataset.id = doc.id;
  card.dataset.type = doc.type;
  card.dataset.status = doc.status;

  // Type icon
  const icon = document.createElement('span');
  icon.className = 'doc-card__icon';
  icon.textContent = getDocumentIcon(doc);
  icon.style.color = getDocumentColor(doc);
  card.appendChild(icon);

  // Content area
  const content = document.createElement('div');
  content.className = 'doc-card__content';

  // Title
  const title = document.createElement('div');
  title.className = 'doc-card__title';
  title.textContent = doc.title || 'Untitled';
  content.appendChild(title);

  // Lineage badge (for instances/notes)
  if (showLineage && parentDocs.length > 0) {
    const lineage = document.createElement('div');
    lineage.className = 'doc-card__lineage';
    const parentNames = parentDocs.map((p) => p.title || 'Untitled').join(', ');
    lineage.textContent = `⤴ ${parentNames}`;
    content.appendChild(lineage);
  }

  // Type/kind badge
  if (!compact) {
    const badge = document.createElement('div');
    badge.className = 'doc-card__badge';
    if (doc.type === 'framework' && doc.framework_kind) {
      badge.textContent = doc.framework_kind;
    } else {
      badge.textContent = doc.type;
    }
    content.appendChild(badge);
  }

  card.appendChild(content);

  // Timestamp
  const time = document.createElement('div');
  time.className = 'doc-card__time';
  time.textContent = relativeTime(doc.modifiedAt);
  card.appendChild(time);

  // Status glow for incubating
  if (doc.status === 'incubating') {
    card.classList.add('doc-card--incubating');
  }

  // Click handler
  if (onClick) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => onClick(doc));
  }

  return card;
}

// Create a skeleton card for loading state
export function createSkeletonCard(): HTMLElement {
  const card = document.createElement('div');
  card.className = 'doc-card doc-card--skeleton';

  card.innerHTML = `
    <span class="doc-card__icon doc-card__skeleton-icon"></span>
    <div class="doc-card__content">
      <div class="doc-card__skeleton-title"></div>
      <div class="doc-card__skeleton-badge"></div>
    </div>
    <div class="doc-card__skeleton-time"></div>
  `;

  return card;
}

// Render skeleton cards for loading state
export function renderSkeletonList(container: HTMLElement, count = 5): void {
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    container.appendChild(createSkeletonCard());
  }
}

// Render a list of cards
export function renderCardList(
  container: HTMLElement,
  docs: Document[],
  allDocs: Document[],
  onClick?: (doc: Document) => void
): void {
  container.innerHTML = '';

  const docMap = new Map(allDocs.map((d) => [d.id, d]));

  for (const doc of docs) {
    // Get parent documents for lineage display
    const parentDocs: Document[] = [];
    for (const fwId of doc.framework_ids) {
      const fw = docMap.get(fwId);
      if (fw) parentDocs.push(fw);
    }
    if (doc.source_id) {
      const source = docMap.get(doc.source_id);
      if (source) parentDocs.push(source);
    }

    const card = createDocumentCard(doc, parentDocs, { onClick });
    container.appendChild(card);
  }
}
