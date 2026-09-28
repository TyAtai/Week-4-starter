/**
 * Derives the Profile screen's "trails hiked" count from hiked-trail state,
 * rather than storing it as a separate fixture number that could drift out
 * of sync with the actual hiked set.
 */
export function countHikedTrails(hikedIds: ReadonlySet<string> | readonly string[]): number {
  return hikedIds instanceof Set ? hikedIds.size : new Set(hikedIds).size;
}
