/**
 * Reliable Unsplash CDN fallbacks when API image is missing or fails to load.
 * Keep in sync with Django `CATEGORY_IMAGE_FALLBACK_POOLS` where possible.
 */
const DEFAULT_BLOG_IMAGE =
  'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a';

const BY_CATEGORY_KEYWORD: { test: (n: string) => boolean; url: string }[] = [
  {
    test: (n) => /\bpassive\b/.test(n) || n.includes('passive income'),
    url: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d',
  },
  {
    test: (n) => n.includes('earn money') || n.includes('money') && n.includes('earn'),
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
  },
  {
    test: (n) => /\bai\b/.test(n) || n.includes('artificial'),
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
  },
  {
    test: (n) => n.includes('tech') || n.includes('software'),
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  },
  {
    test: (n) => n.includes('freelanc') || n.includes('remote work'),
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
  },
  {
    test: (n) => n.includes('finance') || n.includes('invest'),
    url: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d',
  },
  {
    test: (n) => n.includes('health') || n.includes('wellness'),
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
  },
  {
    test: (n) => n.includes('market'),
    url: 'https://images.unsplash.com/photo-1551434678-e076c223a692',
  },
];

export function getCategoryBlogImageFallback(categoryName: string | undefined | null): string {
  const n = (categoryName || '').trim().toLowerCase();
  if (!n) return DEFAULT_BLOG_IMAGE;
  for (const row of BY_CATEGORY_KEYWORD) {
    if (row.test(n)) return row.url;
  }
  if (n.includes('business')) {
    return 'https://images.unsplash.com/photo-1507679799987-c73779587ccf';
  }
  return DEFAULT_BLOG_IMAGE;
}

export function isLikelyValidImageUrl(src: string | undefined | null): boolean {
  const s = (src || '').trim();
  return s.startsWith('https://') || s.startsWith('http://');
}
