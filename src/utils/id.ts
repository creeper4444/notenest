export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Older browsers / non-secure local network origins may not expose randomUUID.
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
