/**
 * Meta Domain Configuration
 *
 * Knowledge graph for managing Claude Code itself: commands, workflows,
 * CLAUDE.md patterns, orchestration best practices, and the loomlib system.
 *
 * This is a meta-project for autonomous coding documentation.
 */

import type { ViewConfig } from './index.ts';

export interface MetaDocumentType {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface MetaStatus {
  id: string;
  label: string;
  position: number;
}

export interface MetaConfig {
  id: string;
  name: string;
  description: string;

  types: Record<string, MetaDocumentType>;
  statusProgression: string[];
  statuses: Record<string, MetaStatus>;
  views: ViewConfig[];
}

export const metaConfig: MetaConfig = {
  id: 'meta',
  name: 'Meta',
  description: 'Claude Code orchestration, commands, workflows, and system documentation',

  types: {
    /**
     * command — A Claude Code slash command with protocol, discovery, output format
     * This represents the .claude/commands/*.md files as queryable documents
     */
    command: {
      id: 'command',
      label: 'Command',
      icon: '/',  // Slash represents slash commands
      color: '#9B59B6',  // Purple for executable
    },

    /**
     * workflow — A multi-step pattern (explore→plan→code→commit, TDD loop, etc.)
     * Reusable orchestration patterns
     */
    workflow: {
      id: 'workflow',
      label: 'Workflow',
      icon: '↻',  // Cycle/loop
      color: '#3498DB',  // Blue for process
    },

    /**
     * pattern — A CLAUDE.md snippet, settings.json template, or config pattern
     * Operational artifacts that configure Claude Code behavior
     */
    pattern: {
      id: 'pattern',
      label: 'Pattern',
      icon: '⎔',  // Grid/template
      color: '#2ECC71',  // Green for configuration
    },

    /**
     * failure-mode — A documented failure pattern and its fix
     * Context contamination, permission friction, iteration cliff, etc.
     */
    'failure-mode': {
      id: 'failure-mode',
      label: 'Failure Mode',
      icon: '⚠',  // Warning
      color: '#E74C3C',  // Red for danger
    },

    /**
     * audit — A system health check or coverage report
     * Command catalog gaps, domain coverage, telos alignment metrics
     */
    audit: {
      id: 'audit',
      label: 'Audit',
      icon: '◉',  // Target/scan
      color: '#F39C12',  // Orange for assessment
    },

    /**
     * operation — A one-off orchestration task
     * "Migrate all commands to new format" or "Audit permission patterns"
     */
    operation: {
      id: 'operation',
      label: 'Operation',
      icon: '⚡',  // Lightning for action
      color: '#1ABC9C',  // Teal for execution
    },

    /**
     * index — Collection/catalog of related documents
     * Same as etymon domain
     */
    index: {
      id: 'index',
      label: 'Index',
      icon: '☰',
      color: '#C9C9C9',
    },
  },

  // Status progression for meta documents
  // Different from etymon — emphasizes operational lifecycle
  statusProgression: ['draft', 'testing', 'stable', 'archived'],

  statuses: {
    /**
     * draft — Under development, not yet validated
     */
    draft: {
      id: 'draft',
      label: 'Draft',
      position: 1,
    },

    /**
     * testing — Being validated (command is run, workflow is tried)
     */
    testing: {
      id: 'testing',
      label: 'Testing',
      position: 2,
    },

    /**
     * stable — Validated and in use
     */
    stable: {
      id: 'stable',
      label: 'Stable',
      position: 3,
    },

    /**
     * archived — No longer active (superseded, deprecated)
     */
    archived: {
      id: 'archived',
      label: 'Archived',
      position: 4,
    },
  },

  // ─────────────────────────────────────────────────────────────────────
  // VIEWS - System documentation focused
  // ─────────────────────────────────────────────────────────────────────
  views: [
    { id: 'list', name: 'List', shortcut: 'L', icon: '☰', default: true },
    { id: 'deck', name: 'Catalog', shortcut: 'D', icon: '◧' },
    { id: 'constellation', name: 'Graph', shortcut: 'C', icon: '✧' },
  ],
};

// Helper functions for meta domain
export function getMetaTypeIcon(type: string): string {
  return metaConfig.types[type]?.icon ?? '○';
}

export function getMetaTypeColor(type: string): string {
  return metaConfig.types[type]?.color ?? '#8A8A8A';
}

export function getMetaStatusPosition(status: string): number {
  return metaConfig.statuses[status]?.position ?? 0;
}

export function getMetaStatusDots(status: string): string {
  const position = getMetaStatusPosition(status);
  const total = metaConfig.statusProgression.length;

  return Array(total)
    .fill('○')
    .map((_, i) => (i < position ? '●' : '○'))
    .join('');
}
