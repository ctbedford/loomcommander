/**
 * Etymon Domain Configuration
 *
 * Knowledge graph for philological/philosophical research.
 * This is the default domain.
 */

import type { ViewConfig } from './index.ts';

export interface EtymonDocumentType {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface EtymonStatus {
  id: string;
  label: string;
  position: number;
}

export interface EtymonConfig {
  id: string;
  name: string;
  description: string;

  types: Record<string, EtymonDocumentType>;
  statusProgression: string[];
  statuses: Record<string, EtymonStatus>;
  views: ViewConfig[];
}

export const etymonConfig: EtymonConfig = {
  id: 'etymon',
  name: 'Etymon',
  description: 'Philological and philosophical research graph',

  types: {
    framework: {
      id: 'framework',
      label: 'Framework',
      icon: '⚙', // toolkit uses ⚙, domain uses ▣
      color: '#7BA3C9',
    },
    instance: {
      id: 'instance',
      label: 'Instance',
      icon: '◧',
      color: '#C9A67B',
    },
    source: {
      id: 'source',
      label: 'Source',
      icon: '◈',
      color: '#7BC98A',
    },
    note: {
      id: 'note',
      label: 'Note',
      icon: '○',
      color: '#8A8A8A',
    },
    index: {
      id: 'index',
      label: 'Index',
      icon: '☰',
      color: '#C9C9C9',
    },
  },

  statusProgression: ['incubating', 'draft', 'verified', 'captured'],

  statuses: {
    incubating: {
      id: 'incubating',
      label: 'Incubating',
      position: 1,
    },
    draft: {
      id: 'draft',
      label: 'Draft',
      position: 2,
    },
    verified: {
      id: 'verified',
      label: 'Verified',
      position: 3,
    },
    captured: {
      id: 'captured',
      label: 'Captured',
      position: 4,
    },
  },

  // ─────────────────────────────────────────────────────────────────────
  // VIEWS - Full research view set
  // ─────────────────────────────────────────────────────────────────────
  views: [
    { id: 'list', name: 'List', shortcut: 'L', icon: '☰', default: true },
    { id: 'constellation', name: 'Constellation', shortcut: 'C', icon: '✧' },
    { id: 'deck', name: 'Deck', shortcut: 'D', icon: '◧' },
    { id: 'spatial', name: 'Spatial', shortcut: 'S', icon: '◌' },
    { id: 'flow', name: 'Flow', shortcut: 'F', icon: '↔' },
  ],
};

// Framework subtypes
export type FrameworkKind = 'toolkit' | 'domain';

export function getFrameworkIcon(kind: FrameworkKind | null): string {
  return kind === 'domain' ? '▣' : '⚙';
}

// Helper functions for etymon domain
export function getEtymonTypeIcon(type: string, frameworkKind?: FrameworkKind | null): string {
  if (type === 'framework') {
    return getFrameworkIcon(frameworkKind ?? null);
  }
  return etymonConfig.types[type]?.icon ?? '○';
}

export function getEtymonTypeColor(type: string): string {
  return etymonConfig.types[type]?.color ?? '#8A8A8A';
}

export function getEtymonStatusPosition(status: string): number {
  return etymonConfig.statuses[status]?.position ?? 0;
}

export function getEtymonStatusDots(status: string): string {
  const position = getEtymonStatusPosition(status);
  const total = etymonConfig.statusProgression.length;

  return Array(total)
    .fill('○')
    .map((_, i) => (i < position ? '●' : '○'))
    .join('');
}
