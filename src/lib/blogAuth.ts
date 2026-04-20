/**
 * JWT access token for authenticated blog actions (likes).
 * Store the token from Django SimpleJWT (`access` field) after login, e.g.:
 * localStorage.setItem('access', '<token>');
 */
const KEYS = ["access", "blog_access_token"];

export function getBlogAccessToken(): string | null {
  for (const k of KEYS) {
    const v = localStorage.getItem(k);
    if (v && v.trim()) {
      return v.trim();
    }
  }
  return null;
}

export function authHeaders(): Record<string, string> {
  const t = getBlogAccessToken();
  if (!t) {
    return {};
  }
  return { Authorization: `Bearer ${t}` };
}
