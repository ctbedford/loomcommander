/**
 * Minimal markdown to HTML converter.
 * Supports: headings, bold, italic, code, links, lists, paragraphs, tables.
 */

type Alignment = 'left' | 'center' | 'right';

function parseTableRow(row: string): string[] {
  // Split by | and trim, ignoring leading/trailing empty cells
  const cells = row.split('|').map(c => c.trim());
  // Remove empty first/last elements from leading/trailing pipes
  if (cells[0] === '') cells.shift();
  if (cells[cells.length - 1] === '') cells.pop();
  return cells;
}

function parseAlignments(separatorRow: string): Alignment[] {
  const cells = parseTableRow(separatorRow);
  return cells.map(cell => {
    const trimmed = cell.replace(/-+/g, '-');
    if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
    if (trimmed.endsWith(':')) return 'right';
    return 'left';
  });
}

function isSeparatorRow(row: string): boolean {
  const cells = parseTableRow(row);
  return cells.length > 0 && cells.every(cell => /^:?-+:?$/.test(cell));
}

function parseTable(lines: string[], startIndex: number): { html: string; consumed: number } | null {
  // Need at least 2 lines (header + separator)
  if (startIndex + 1 >= lines.length) return null;

  const headerLine = lines[startIndex];
  const separatorLine = lines[startIndex + 1];

  // Must start with | and have valid separator
  if (!headerLine.trim().startsWith('|')) return null;
  if (!isSeparatorRow(separatorLine)) return null;

  const headers = parseTableRow(headerLine);
  const alignments = parseAlignments(separatorLine);

  // Collect body rows
  const bodyRows: string[][] = [];
  let consumed = 2;

  for (let i = startIndex + 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('|')) break;
    bodyRows.push(parseTableRow(line));
    consumed++;
  }

  // Build HTML
  const alignAttr = (i: number) => {
    const align = alignments[i] || 'left';
    return align !== 'left' ? ` align="${align}"` : '';
  };

  let html = '<table>\n<thead>\n<tr>';
  headers.forEach((h, i) => {
    html += `<th${alignAttr(i)}>${parseInline(h)}</th>`;
  });
  html += '</tr>\n</thead>\n<tbody>\n';

  bodyRows.forEach(row => {
    html += '<tr>';
    row.forEach((cell, i) => {
      html += `<td${alignAttr(i)}>${parseInline(cell)}</td>`;
    });
    html += '</tr>\n';
  });

  html += '</tbody>\n</table>';

  return { html, consumed };
}

function parseInline(text: string): string {
  return text
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Code (must come before other inline formatting)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

export function markdownToHtml(markdown: string): string {
  const lines = markdown.split('\n');
  const html: string[] = [];
  let inList = false;
  let paragraph: string[] = [];
  let i = 0;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      html.push(`<p>${parseInline(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };

  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line: flush paragraph
    if (trimmed === '') {
      flushParagraph();
      closeList();
      i++;
      continue;
    }

    // Table: check if this starts a table block
    if (trimmed.startsWith('|')) {
      const table = parseTable(lines, i);
      if (table) {
        flushParagraph();
        closeList();
        html.push(table.html);
        i += table.consumed;
        continue;
      }
    }

    // Heading
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${parseInline(headingMatch[2])}</h${level}>`);
      i++;
      continue;
    }

    // List item
    const listMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${parseInline(listMatch[1])}</li>`);
      i++;
      continue;
    }

    // Regular text: accumulate into paragraph
    paragraph.push(trimmed);
    i++;
  }

  // Flush remaining content
  flushParagraph();
  closeList();

  return html.join('\n');
}
