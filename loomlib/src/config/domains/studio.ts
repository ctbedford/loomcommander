/**
 * Studio Domain Configuration
 *
 * Content creation knowledge graph for video/audio/written content.
 */

export interface StudioDocumentType {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface StudioStatus {
  id: string;
  label: string;
  position: number;
}

export interface StudioConfig {
  id: string;
  name: string;
  description: string;

  types: Record<string, StudioDocumentType>;
  statusProgression: string[];
  statuses: Record<string, StudioStatus>;
}

export const studioConfig: StudioConfig = {
  id: 'studio',
  name: 'Studio',
  description: 'Content creation knowledge graph',

  types: {
    idea: {
      id: 'idea',
      label: 'Idea',
      icon: '💡',
      color: '#FFD700',
    },
    source: {
      id: 'source',
      label: 'Source',
      icon: '📚',
      color: '#7BC98A',
    },
    research: {
      id: 'research',
      label: 'Research',
      icon: '🔍',
      color: '#7BA3C9',
    },
    script: {
      id: 'script',
      label: 'Script',
      icon: '📝',
      color: '#C9A67B',
    },
    asset: {
      id: 'asset',
      label: 'Asset',
      icon: '🎬',
      color: '#9B59B6',
    },
    template: {
      id: 'template',
      label: 'Template',
      icon: '⚙',
      color: '#3498DB',
    },
    series: {
      id: 'series',
      label: 'Series',
      icon: '📁',
      color: '#C9C9C9',
    },
  },

  statusProgression: ['draft', 'ready', 'used'],

  statuses: {
    draft: {
      id: 'draft',
      label: 'Draft',
      position: 1,
    },
    ready: {
      id: 'ready',
      label: 'Ready',
      position: 2,
    },
    used: {
      id: 'used',
      label: 'Used',
      position: 3,
    },
  },
};

// Helper functions for studio domain
export function getStudioTypeIcon(type: string): string {
  return studioConfig.types[type]?.icon ?? '○';
}

export function getStudioTypeColor(type: string): string {
  return studioConfig.types[type]?.color ?? '#8A8A8A';
}

export function getStudioStatusPosition(status: string): number {
  return studioConfig.statuses[status]?.position ?? 0;
}

export function getStudioStatusDots(status: string): string {
  const position = getStudioStatusPosition(status);
  const total = studioConfig.statusProgression.length;

  return Array(total)
    .fill('○')
    .map((_, i) => (i < position ? '●' : '○'))
    .join('');
}
