const EMAIL_KEY = 'blog_reader_email';

const CLIENT_KEY = 'blog_client_id';

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function getOrCreateDeviceClientId(): string {
  let cid = localStorage.getItem(CLIENT_KEY);
  if (!cid) {
    cid =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `cid-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(CLIENT_KEY, cid);
  }
  return cid;
}

/**
 * Stable id for the Django `PostLike.client_id` field. When an email is set,
 * we use `email:…` so one like per post per address; otherwise a device id.
 */
export function getReaderClientId(): string {
  const email = getReaderEmail();
  if (email) {
    return `email:${email.toLowerCase()}`;
  }
  return getOrCreateDeviceClientId();
}

export function getReaderEmail(): string | null {
  const v = localStorage.getItem(EMAIL_KEY);
  if (!v) return null;
  const t = v.trim();
  return t ? t.toLowerCase() : null;
}

export function setReaderEmail(email: string): void {
  const t = email.trim().toLowerCase();
  if (!isValidEmail(t)) {
    throw new Error('Invalid email');
  }
  localStorage.setItem(EMAIL_KEY, t);
}

export { isValidEmail };
