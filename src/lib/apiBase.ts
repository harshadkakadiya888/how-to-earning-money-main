/**
 * Public Django API origin (no trailing slash), e.g. http://127.0.0.1:8000
 * Prefer VITE_API_URL; VITE_API_BASE_URL is supported for older configs.
 */
export function getViteApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "";
  return typeof raw === "string" ? raw.replace(/\/$/, "") : "";
}

/** True when blog/categories/comments should hit Django. */
export function usesDjangoApi(): boolean {
  if (getViteApiBaseUrl() !== "") {
    return true;
  }
  // Dev: same-origin /api/* is proxied to Django in vite.config.ts
  if (import.meta.env.DEV) {
    return true;
  }
  return false;
}

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const base = getViteApiBaseUrl();
  if (!base) {
    if (!import.meta.env.DEV && p.startsWith("/api/")) {
      console.error(
        "Django API base URL is not configured. Set VITE_API_URL in Vercel to your deployed backend (https://...).",
      );
    }
    return p;
  }
  return `${base.replace(/\/$/, "")}${p}`;
}
