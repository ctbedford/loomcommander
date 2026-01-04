import { Document } from '../library/db';
import { relativeTime } from '../library/time';

function getTitle(doc: Document): string {
  const firstLine = doc.content.split('\n').find(line => line.trim());
  return firstLine?.trim() || 'Untitled';
}

function fuzzyMatch(text: string, query: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  let queryIndex = 0;
  for (const char of lowerText) {
    if (char === lowerQuery[queryIndex]) {
      queryIndex++;
      if (queryIndex === lowerQuery.length) return true;
    }
  }
  return queryIndex === lowerQuery.length;
}

export class CommandPalette {
  private overlay: HTMLElement;
  private search: HTMLInputElement;
  private list: HTMLElement;
  private docs: Document[] = [];
  private filteredDocs: Document[] = [];
  private selectedIndex = 0;
  private onSelect: (id: string | null) => void;

  constructor(container: HTMLElement, onSelect: (id: string | null) => void) {
    this.onSelect = onSelect;

    this.overlay = document.createElement('div');
    this.overlay.className = 'palette-overlay';
    this.overlay.innerHTML = `
      <div class="palette">
        <input type="text" class="palette-search" placeholder="Search documents..." />
        <div class="palette-list"></div>
      </div>
    `;

    this.search = this.overlay.querySelector('.palette-search') as HTMLInputElement;
    this.list = this.overlay.querySelector('.palette-list') as HTMLElement;

    this.search.addEventListener('input', () => this.filter());
    this.search.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    container.appendChild(this.overlay);
  }

  open(docs: Document[], _currentId: string | null): void {
    this.docs = docs;
    this.search.value = '';
    this.filter();
    this.overlay.classList.add('visible');
    this.search.focus();
  }

  close(): void {
    this.overlay.classList.remove('visible');
  }

  isOpen(): boolean {
    return this.overlay.classList.contains('visible');
  }

  private filter(): void {
    const query = this.search.value.trim();
    if (!query) {
      this.filteredDocs = this.docs;
    } else {
      this.filteredDocs = this.docs.filter(doc => {
        const title = getTitle(doc);
        return fuzzyMatch(title, query) || fuzzyMatch(doc.content, query);
      });
    }
    this.selectedIndex = 0;
    this.render();
  }

  private render(): void {
    this.list.innerHTML = '';

    if (this.filteredDocs.length === 0 && this.search.value.trim()) {
      const empty = document.createElement('div');
      empty.className = 'palette-empty';
      empty.textContent = 'No documents found';
      this.list.appendChild(empty);
    }

    this.filteredDocs.forEach((doc, index) => {
      const item = document.createElement('div');
      item.className = 'palette-item';
      if (index === this.selectedIndex) {
        item.classList.add('selected');
      }

      const title = document.createElement('span');
      title.className = 'palette-item-title';
      title.textContent = getTitle(doc);

      const time = document.createElement('span');
      time.className = 'palette-item-time';
      time.textContent = relativeTime(doc.modifiedAt);

      item.appendChild(title);
      item.appendChild(time);

      item.addEventListener('click', () => {
        this.close();
        this.onSelect(doc.id);
      });

      item.addEventListener('mouseenter', () => {
        this.selectedIndex = index;
        this.updateSelection();
      });

      this.list.appendChild(item);
    });

    // "New document" option at bottom
    const newItem = document.createElement('div');
    newItem.className = 'palette-item';
    const newDocIndex = this.filteredDocs.length;
    if (this.selectedIndex === newDocIndex) {
      newItem.classList.add('selected');
    }

    const newTitle = document.createElement('span');
    newTitle.className = 'palette-item-title palette-item-new';
    newTitle.textContent = 'New document';
    newItem.appendChild(newTitle);

    newItem.addEventListener('click', () => {
      this.close();
      this.onSelect(null);
    });

    newItem.addEventListener('mouseenter', () => {
      this.selectedIndex = newDocIndex;
      this.updateSelection();
    });

    this.list.appendChild(newItem);
  }

  private updateSelection(): void {
    const items = this.list.querySelectorAll('.palette-item');
    items.forEach((item, i) => {
      item.classList.toggle('selected', i === this.selectedIndex);
    });
  }

  private handleKeydown(e: KeyboardEvent): void {
    const maxIndex = this.filteredDocs.length; // includes "new doc" option

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, maxIndex);
        this.updateSelection();
        this.scrollToSelected();
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.updateSelection();
        this.scrollToSelected();
        break;

      case 'Enter':
        e.preventDefault();
        this.close();
        if (this.selectedIndex < this.filteredDocs.length) {
          this.onSelect(this.filteredDocs[this.selectedIndex].id);
        } else {
          this.onSelect(null); // new document
        }
        break;

      case 'Escape':
        e.preventDefault();
        this.close();
        break;
    }
  }

  private scrollToSelected(): void {
    const items = this.list.querySelectorAll('.palette-item');
    const selected = items[this.selectedIndex] as HTMLElement | undefined;
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }
}
