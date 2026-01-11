/**
 * Domain Configuration Index
 *
 * Each domain configures how documents are displayed and organized.
 */

export { etymonConfig, getEtymonTypeIcon, getEtymonTypeColor, getEtymonStatusDots } from './etymon.ts';
export { studioConfig, getStudioTypeIcon, getStudioTypeColor, getStudioStatusDots } from './studio.ts';

import { etymonConfig } from './etymon.ts';
import { studioConfig } from './studio.ts';
import { getCurrentDomain } from '../../types.ts';

// Domain registry
const domains = {
  etymon: etymonConfig,
  studio: studioConfig,
} as const;

export type DomainId = keyof typeof domains;

/**
 * Get configuration for the current domain
 */
export function getCurrentDomainConfig() {
  const domainId = getCurrentDomain() as DomainId;
  return domains[domainId] ?? domains.etymon;
}

/**
 * Get configuration for a specific domain
 */
export function getDomainConfig(domainId: string) {
  return domains[domainId as DomainId] ?? domains.etymon;
}

/**
 * List all available domains
 */
export function listDomains() {
  return Object.entries(domains).map(([id, config]) => ({
    id,
    name: config.name,
    description: config.description,
  }));
}
