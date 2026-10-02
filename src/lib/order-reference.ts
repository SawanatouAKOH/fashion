export function createOrderReference() {
  const randomPart = globalThis.crypto?.randomUUID?.().replace(/-/g, "").slice(0, 8).toUpperCase()
    ?? Math.random().toString(36).slice(2, 10).toUpperCase();

  return `CMD-${Date.now().toString(36).toUpperCase()}-${randomPart}`;
}

export function formatOrderReference(id: string) {
  return id.startsWith("CMD-") ? id : `CMD-${id.slice(-8).toUpperCase()}`;
}