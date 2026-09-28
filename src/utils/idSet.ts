/** Pure toggle used by both saved-trail and hiked-trail state: add if absent, remove if present. */
export function toggleId(ids: ReadonlySet<string>, id: string): Set<string> {
  const next = new Set(ids);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return next;
}
