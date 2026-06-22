// IMPORTANT: Keep this file separate from lib/content.ts
// lib/content.ts uses `fs` (Node-only). This file is safe to import in client components.
export function resolveImage(value: string): string {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value;
  }
  return `/assets/${value}`;
}
