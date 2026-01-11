/**
 * Ops Domain Configuration
 *
 * Operational product development domain. The CTO/Product Director layer
 * that orchestrates Claude Code execution across codebases.
 *
 * Core insight: Context orchestration drives output quality.
 * This domain operationalizes the brief→survey→plan→task workflow.
 */

import type { ViewConfig } from './index.ts';

export interface OpsDocumentType {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export interface OpsStatus {
  id: string;
  label: string;
  position: number;
}

export interface OpsConfig {
  id: string;
  name: string;
  description: string;

  types: Record<string, OpsDocumentType>;
  statusProgression: string[];
  statuses: Record<string, OpsStatus>;
  views: ViewConfig[];
}

export const opsConfig: OpsConfig = {
  id: 'ops',
  name: 'Ops',
  description: 'Operational product development across codebases',

  types: {
    /**
     * project — A tracked codebase
     * Container for all work in a specific repository
     */
    project: {
      id: 'project',
      label: 'Project',
      icon: '◇',
      color: '#5D9CEC', // Blue for container
      description: 'Tracked codebase with path, CLAUDE.md, health status',
    },

    /**
     * brief — What to build (Product Director function)
     * Requirements, user stories, success criteria
     */
    brief: {
      id: 'brief',
      label: 'Brief',
      icon: '◈',
      color: '#A37ACC', // Purple for product
      description: 'What to build, why, and success criteria',
    },

    /**
     * survey — Understanding before changing
     * Read-only codebase exploration, architecture docs
     */
    survey: {
      id: 'survey',
      label: 'Survey',
      icon: '◧',
      color: '#48CFAD', // Teal for research
      description: 'Codebase understanding before implementation',
    },

    /**
     * plan — How to build it (CTO function)
     * Implementation approach, files to change, approved before coding
     */
    plan: {
      id: 'plan',
      label: 'Plan',
      icon: '▣',
      color: '#FFCE54', // Yellow for strategy
      description: 'Implementation approach, requires approval',
    },

    /**
     * task — Atomic work unit
     * Single commit scope, clear done criteria
     */
    task: {
      id: 'task',
      label: 'Task',
      icon: '□',
      color: '#4FC1E9', // Light blue for action
      description: 'Atomic work unit, single commit scope',
    },

    /**
     * decision — Why we chose X over Y (ADR-style)
     * Trade-offs documented, alternatives considered
     */
    decision: {
      id: 'decision',
      label: 'Decision',
      icon: '⊕',
      color: '#ED5565', // Red for important
      description: 'ADR-style decision record with trade-offs',
    },

    /**
     * retro — What we learned after shipping
     * Post-mortem, lessons, pattern candidates
     */
    retro: {
      id: 'retro',
      label: 'Retro',
      icon: '↺',
      color: '#AC92EC', // Light purple for reflection
      description: 'Retrospective after shipping',
    },

    /**
     * pattern — Extracted reusable approach
     * From retros, code patterns, process patterns
     */
    pattern: {
      id: 'pattern',
      label: 'Pattern',
      icon: '⚙',
      color: '#A0D468', // Green for reusable
      description: 'Extracted reusable approach from experience',
    },

    /**
     * checkpoint — Context preservation for 20-turn cliff
     * State externalization, resume point
     */
    checkpoint: {
      id: 'checkpoint',
      label: 'Checkpoint',
      icon: '⏸',
      color: '#F6BB42', // Orange for pause
      description: 'Context snapshot for session resume',
    },

    /**
     * index — Collection of related documents
     * Same as other domains
     */
    index: {
      id: 'index',
      label: 'Index',
      icon: '☰',
      color: '#C9C9C9',
      description: 'Curated collection of documents',
    },
  },

  // Status progression for ops documents
  // Emphasizes approval workflow
  statusProgression: ['draft', 'approved', 'active', 'completed', 'archived'],

  statuses: {
    /**
     * draft — Under development, not yet approved
     */
    draft: {
      id: 'draft',
      label: 'Draft',
      position: 1,
    },

    /**
     * approved — Ready to execute (for briefs, plans)
     */
    approved: {
      id: 'approved',
      label: 'Approved',
      position: 2,
    },

    /**
     * active — Currently being worked on
     */
    active: {
      id: 'active',
      label: 'Active',
      position: 3,
    },

    /**
     * completed — Done, shipped
     */
    completed: {
      id: 'completed',
      label: 'Completed',
      position: 4,
    },

    /**
     * archived — No longer active (superseded, deprecated)
     */
    archived: {
      id: 'archived',
      label: 'Archived',
      position: 5,
    },
  },

  // ─────────────────────────────────────────────────────────────────────
  // VIEWS - Domain-specific view configuration
  // ─────────────────────────────────────────────────────────────────────
  views: [
    {
      id: 'list',
      name: 'List',
      shortcut: 'L',
      icon: '☰',
      default: true,
    },
    {
      id: 'kanban',
      name: 'Workflow',
      shortcut: 'K',
      icon: '▣',
    },
    {
      id: 'deck',
      name: 'Board',
      shortcut: 'D',
      icon: '◧',
    },
  ],
};

// Task-specific statuses (subset used for tasks)
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'verified';

// Helper functions for ops domain
export function getOpsTypeIcon(type: string): string {
  return opsConfig.types[type]?.icon ?? '○';
}

export function getOpsTypeColor(type: string): string {
  return opsConfig.types[type]?.color ?? '#8A8A8A';
}

export function getOpsStatusPosition(status: string): number {
  return opsConfig.statuses[status]?.position ?? 0;
}

export function getOpsStatusDots(status: string): string {
  const position = getOpsStatusPosition(status);
  const total = opsConfig.statusProgression.length;

  return Array(total)
    .fill('○')
    .map((_, i) => (i < position ? '●' : '○'))
    .join('');
}

/**
 * Get the workflow phase for a document type
 * Useful for view organization
 */
export function getOpsWorkflowPhase(type: string): 'define' | 'research' | 'execute' | 'learn' | 'organize' {
  switch (type) {
    case 'project':
    case 'brief':
      return 'define';
    case 'survey':
      return 'research';
    case 'plan':
    case 'task':
      return 'execute';
    case 'decision':
    case 'retro':
    case 'pattern':
      return 'learn';
    case 'checkpoint':
    case 'index':
      return 'organize';
    default:
      return 'organize';
  }
}
