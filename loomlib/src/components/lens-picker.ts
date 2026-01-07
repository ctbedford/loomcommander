import type { LensId } from '../types.ts';
import { LENS_CONFIGS } from '../data/constellation-config.ts';

export interface LensPickerOptions {
  onSelect: (lensId: LensId) => void;
  onClose: () => void;
}

export class LensPicker {
  private container: HTMLElement;
  private options: LensPickerOptions;
  private selectedIndex = 0;
  private activeLens: LensId = 'default';
  private boundHandleKeydown: (e: KeyboardEvent) => void;

  constructor(container: HTMLElement, options: LensPickerOptions) {
    this.container = container;
    this.options = options;
    this.container.className = 'lens-picker';
    this.container.setAttribute('role', 'listbox');
    this.container.tabIndex = 0;

    this.boundHandleKeydown = this.handleKeydown.bind(this);
  }

  show(currentLens: LensId): void {
    this.activeLens = currentLens;
    const availableLenses = LENS_CONFIGS.filter(l => l.available);
    this.selectedIndex = availableLenses.findIndex(l => l.id === currentLens);
    if (this.selectedIndex === -1) this.selectedIndex = 0;

    this.render();
    this.container.classList.add('lens-picker--visible');

    // Use requestAnimationFrame to ensure visibility: visible is applied
    // before attempting focus. Without this, focus() silently fails because
    // elements with visibility: hidden cannot receive focus.
    requestAnimationFrame(() => {
      this.container.focus();
      this.container.addEventListener('keydown', this.boundHandleKeydown);
    });
  }

  hide(): void {
    this.container.classList.remove('lens-picker--visible');
    this.container.removeEventListener('keydown', this.boundHandleKeydown);
  }

  isVisible(): boolean {
    return this.container.classList.contains('lens-picker--visible');
  }

  private render(): void {
    const availableLenses = LENS_CONFIGS.filter(l => l.available);

    this.container.innerHTML = `
      <div class="lens-picker__header">
        <span class="lens-picker__title">Select Lens</span>
        <span class="lens-picker__hint">↑↓ navigate · Enter select · Esc close</span>
      </div>
      <div class="lens-picker__list">
        ${availableLenses.map((lens, i) => `
          <div
            class="lens-picker__item ${lens.id === this.activeLens ? 'lens-picker__item--active' : ''} ${i === this.selectedIndex ? 'lens-picker__item--selected' : ''}"
            data-lens="${lens.id}"
            data-index="${i}"
            role="option"
            aria-selected="${lens.id === this.activeLens}"
          >
            <span class="lens-picker__icon">${lens.icon}</span>
            <div class="lens-picker__content">
              <span class="lens-picker__name">${lens.name}</span>
              <span class="lens-picker__description">${lens.description}</span>
            </div>
            ${lens.id === this.activeLens ? '<span class="lens-picker__check">✓</span>' : ''}
          </div>
        `).join('')}
      </div>
    `;

    // Click handlers
    this.container.querySelectorAll('.lens-picker__item').forEach((item) => {
      item.addEventListener('click', () => {
        const lensId = item.getAttribute('data-lens') as LensId;
        this.options.onSelect(lensId);
      });
    });
  }

  private handleKeydown(e: KeyboardEvent): void {
    const availableLenses = LENS_CONFIGS.filter(l => l.available);

    switch (e.key) {
      case 'ArrowDown':
      case 'j':
        e.preventDefault();
        e.stopPropagation();
        this.selectedIndex = Math.min(this.selectedIndex + 1, availableLenses.length - 1);
        this.render();
        break;
      case 'ArrowUp':
      case 'k':
        e.preventDefault();
        e.stopPropagation();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.render();
        break;
      case 'Enter':
        e.preventDefault();
        e.stopPropagation();
        this.options.onSelect(availableLenses[this.selectedIndex].id);
        break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        this.options.onClose();
        break;
    }
  }

  destroy(): void {
    this.container.removeEventListener('keydown', this.boundHandleKeydown);
  }
}
