import api from "@/services/api";
import { apiUrl } from "./apiBase";

/** Shape returned by Django `PostSerializer.to_representation` */
export type DjangoPostRaw = {
  id: number;
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  author: string;
  read_time: string;
  category: { id: number; _id: string; name: string; slug: string };
  tags: string[] | string | unknown;
  article_summary: string;
  articleSummary?: string;
  faqs: { question: string; answer: string }[];
  created_at: string | null;
  status?: string;
  views_count?: number;
  likes_count?: number;
  liked_by_me?: boolean;
};

function flattenTagTokens(tokens: string[]): string[] {
  const out: string[] = [];
  for (let t of tokens) {
    t = t.trim();
    if (!t || t === "[]" || t === "{}" || t === '""') continue;
    if (t.startsWith("[") && t.endsWith("]")) {
      try {
        const inner = JSON.parse(t) as unknown;
        if (Array.isArray(inner)) {
          out.push(...flattenTagTokens(inner.map((x) => String(x))));
          continue;
        }
        if (typeof inner === "string" && inner.trim()) {
          out.push(...flattenTagTokens([inner.trim()]));
          continue;
        }
      } catch {
        /* keep as literal tag below */
      }
    }
    out.push(t);
  }
  return out;
}

export function coerceTagsFromApi(raw: unknown): string[] {
  let base: string[] = [];
  if (Array.isArray(raw)) {
    base = raw.map((x) => String(x).trim()).filter(Boolean);
  } else if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return [];
    try {
      const parsed = JSON.parse(s) as unknown;
      if (Array.isArray(parsed)) {
        base = parsed.map((x) => String(x).trim()).filter(Boolean);
      } else if (typeof parsed === "string" && parsed.trim()) {
        base = [parsed.trim()];
      } else {
        base = [s];
      }
    } catch {
      if (s.includes(",")) {
        base = s.split(",").map((t) => t.trim()).filter(Boolean);
      } else {
        base = [s];
      }
    }
  }
  return flattenTagTokens(base);
}

export type BlogPostsListEnvelope = {
  status: string;
  results: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: {
    blogs: ReturnType<typeof normalizePostForCard>[];
  };
};

export function normalizePostForCard(p: DjangoPostRaw) {
  const createdAt = p.created_at || new Date().toISOString();
  const readTime = (p.read_time || "1 min").trim();
  return {
    _id: p._id,
    id: String(p.id),
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || "",
    content: p.content,
    category: p.category,
    createdAt,
    readTime,
    author: p.author || "",
    featured_image: p.featured_image,
    imageUrl: p.featured_image || undefined,
    image: p.featured_image || undefined,
    tags: coerceTagsFromApi(p.tags),
  };
}

export function normalizePostForDetail(p: DjangoPostRaw) {
  const base = normalizePostForCard(p);
  const createdAt = p.created_at || new Date().toISOString();
  return {
    ...base,
    createdAt,
    updatedAt: createdAt,
    articleSummary: p.article_summary || p.articleSummary || "",
    faqs: Array.isArray(p.faqs) ? p.faqs : [],
    likes_count: typeof p.likes_count === "number" ? p.likes_count : 0,
    liked_by_me: Boolean(p.liked_by_me),
  };
}

export async function fetchDjangoPostList(): Promise<DjangoPostRaw[]> {
  const res = await api.get<{ posts: DjangoPostRaw[] }>(apiUrl("/api/posts/"));
  return Array.isArray(res.data.posts) ? res.data.posts : [];
}

export async function fetchDjangoPostBySlug(slug: string): Promise<DjangoPostRaw> {
  const res = await api.get<DjangoPostRaw>(
    apiUrl(`/api/posts/${encodeURIComponent(slug)}/`)
  );
  return res.data;
}

export async function fetchDjangoComments(postId: number | string) {
  const res = await api.get<{ comments: Record<string, unknown>[] }>(
    apiUrl(`/api/posts/${postId}/comments/`)
  );
  const list = Array.isArray(res.data.comments) ? res.data.comments : [];
  return list.map((c) => ({
    ...c,
    _id: String((c as { _id?: string })._id ?? (c as { id?: number }).id ?? ""),
    id: String((c as { id?: number }).id ?? ""),
    rating: typeof (c as { rating?: number }).rating === "number" ? (c as { rating: number }).rating : 5,
    content: (c as { comment?: string }).comment ?? "",
    author: (c as { name?: string }).name ?? "User",
  }));
}

export async function fetchDjangoPostDetailBundle(slug: string) {
  const post = await fetchDjangoPostBySlug(slug);
  const comments = await fetchDjangoComments(post.id);
  return {
    data: {
      blog: normalizePostForDetail(post),
      comments,
    },
  };
}

export function buildBlogListPage(
  posts: DjangoPostRaw[],
  params?: { page?: number; limit?: number; category?: string; search?: string; sort?: string }
): BlogPostsListEnvelope {
  const normalized = posts.map(normalizePostForCard);
  let list = [...normalized];

  const category = params?.category;
  if (category && category !== "all") {
    list = list.filter(
      (b) =>
        b.category._id === category ||
        String(b.category.id) === category ||
        b.category.slug === category
    );
  }

  const q = params?.search?.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
        (b.content && b.content.toLowerCase().includes(q))
    );
  }

  if (params?.sort === "alphabetical") {
    list.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const page = params?.page && params.page > 0 ? params.page : 1;
  const limit = params?.limit && params.limit > 0 ? params.limit : 12;
  const start = (page - 1) * limit;
  const slice = list.slice(start, start + limit);
  const pages = Math.max(1, Math.ceil(list.length / limit));

  return {
    status: "ok",
    results: slice.length,
    pagination: {
      page,
      limit,
      total: list.length,
      pages,
    },
    data: { blogs: slice },
  };
}

export type BlogsPerCategoryRow = {
  categoryId: string;
  category: string;
  totalBlogs: number;
  blogs: ReturnType<typeof normalizePostForCard>[];
};

export async function fetchBlogsPerCategoryBundle(): Promise<{ data: BlogsPerCategoryRow[] }> {
  const [catsRes, postsRes] = await Promise.all([
    api.get<{ categories: { id: number; _id: string; name: string; slug: string }[] }>(
      apiUrl("/api/categories/")
    ),
    api.get<{ posts: DjangoPostRaw[] }>(apiUrl("/api/posts/")),
  ]);

  const categories = Array.isArray(catsRes.data.categories) ? catsRes.data.categories : [];
  const posts = Array.isArray(postsRes.data.posts) ? postsRes.data.posts : [];

  const rows: BlogsPerCategoryRow[] = categories.map((cat) => {
    const inCat = posts.filter((p) => p.category.id === cat.id);
    const blogs = inCat.map(normalizePostForCard).slice(0, 6);
    return {
      categoryId: cat._id,
      category: cat.name,
      totalBlogs: inCat.length,
      blogs,
    };
  });

  return { data: rows };
}
