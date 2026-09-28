import type { DifficultyFilter, Trail } from '@/types/trail';

export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function matchesQuery(trail: Trail, query: string): boolean {
  const normalized = normalizeQuery(query);
  if (normalized.length === 0) return true;
  return trail.name.toLowerCase().includes(normalized);
}

export function matchesDifficulty(trail: Trail, filter: DifficultyFilter): boolean {
  return filter === 'All' || trail.difficulty === filter;
}

export function filterTrails(
  trails: Trail[],
  query: string,
  difficultyFilter: DifficultyFilter
): Trail[] {
  return trails.filter(
    (trail) => matchesQuery(trail, query) && matchesDifficulty(trail, difficultyFilter)
  );
}
