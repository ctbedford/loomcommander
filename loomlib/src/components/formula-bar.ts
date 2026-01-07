import type { Document, ProductionFormula } from '../types.ts';
import { getDocumentIcon } from '../types.ts';

/**
 * Formula Bar - Displays the production formula for an instance document
 *
 * Shows: ◧ INTEREST = ⚙ Etymon Method + ▣ Oikonomia vs Chrematistics
 */
export class FormulaBar {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.className = 'formula-bar';
  }

  update(focusDoc: Document | null, formula: ProductionFormula | null): void {
    if (!focusDoc || !formula) {
      this.container.classList.remove('formula-bar--visible');
      return;
    }

    // Only show for instances (they have production formulas)
    if (focusDoc.type !== 'instance') {
      this.container.classList.remove('formula-bar--visible');
      return;
    }

    const parts: string[] = [];

    // Toolkits (blue)
    for (const toolkit of formula.toolkits) {
      parts.push(`<span class="formula-bar__toolkit">⚙ ${this.escapeHtml(toolkit.title)}</span>`);
    }

    // Domains (purple)
    for (const domain of formula.domains) {
      parts.push(`<span class="formula-bar__domain">▣ ${this.escapeHtml(domain.title)}</span>`);
    }

    // Source (green)
    if (formula.source) {
      parts.push(`<span class="formula-bar__source">◈ ${this.escapeHtml(formula.source.title)}</span>`);
    }

    if (parts.length === 0) {
      this.container.classList.remove('formula-bar--visible');
      return;
    }

    const icon = getDocumentIcon(focusDoc);
    this.container.innerHTML = `
      <span class="formula-bar__focus">${icon} ${this.escapeHtml(focusDoc.title)}</span>
      <span class="formula-bar__equals">=</span>
      <span class="formula-bar__parts">${parts.join(' <span class="formula-bar__plus">+</span> ')}</span>
    `;
    this.container.classList.add('formula-bar--visible');
  }

  hide(): void {
    this.container.classList.remove('formula-bar--visible');
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
