import axios, { isAxiosError } from 'axios';
import { apiUrl, usesDjangoApi } from './apiBase';

// Legacy / third-party APIs (newsletter, success stories, etc.)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Types
export interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishDate: string;
  readTime: string;
  author: string;
  featured?: boolean;
  imageUrl?: string;
  tags: string[];
}

export interface BlogPostsResponse {
  status: string;
  results: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: {
    blogs: BlogPost[];
  };
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  count: number;
  slug: string;
}

export interface CategoriesResponse {
  status: string;
  results: number;
  data: {
    categories: Category[];
  };
}

export interface SuccessStory {
  _id: string;
  fullName: string;
  email: string;
  monthlyIncomeBefore: number;
  monthlyIncomeNow: number;
  timeToTransform: string;
  primaryStrategyUsed: string;
  journey: string;
  publishPermission: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SuccessStoriesResponse {
  status: string;
  results: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: {
    successStories: SuccessStory[];
  };
}

export interface ContactFormData {
  fullName: string;
  emailAddress: string;
  subject: string;
  message: string;
}

// API Functions
export const blogApi = {
  // Get all blog posts
  getAll: async (params = {}): Promise<BlogPostsResponse> => {
    if (!API_BASE_URL) {
      throw new Error('API_BASE_URL is not configured. Please set VITE_API_BASE_URL in your .env file');
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  // Get a single blog post by ID
  getById: async (id: string): Promise<BlogPost> => {
    if (!API_BASE_URL) {
      throw new Error('API_BASE_URL is not configured. Please set VITE_API_BASE_URL in your .env file');
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  },

  // Get blog posts by category
  getByCategory: async (category: string): Promise<BlogPostsResponse> => {
    if (!API_BASE_URL) {
      throw new Error('API_BASE_URL is not configured. Please set VITE_API_BASE_URL in your .env file');
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/blog`, { params: { category } });
      return response.data;
    } catch (error) {
      console.error('Error fetching blog posts by category:', error);
      throw error;
    }
  },

  getBySlugWithComments: async (slug: string) => {
    if (!API_BASE_URL) {
      throw new Error('API_BASE_URL is not configured. Please set VITE_API_BASE_URL in your .env file');
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog by slug:', error);
      throw error;
    }
  },

  getBlogsPerCategory: async () => {
    if (!API_BASE_URL) {
      throw new Error('API_BASE_URL is not configured. Please set VITE_API_BASE_URL in your .env file');
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/per-category`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs per category:', error);
      throw error;
    }
  }
};

export const categoryApi = {
  // Get all categories
  getAll: async (): Promise<CategoriesResponse> => {
    if (usesDjangoApi()) {
      const response = await axios.get<{ categories: Category[] }>(apiUrl('/api/categories/'));
      const raw = Array.isArray(response.data.categories) ? response.data.categories : [];
      const categories = raw.map((c) => ({
        ...c,
        description: (c as Category).description ?? '',
        count: (c as Category).count ?? 0,
      }));
      return {
        status: 'ok',
        results: categories.length,
        data: { categories },
      };
    }

    if (!API_BASE_URL) {
      throw new Error('API_BASE_URL is not configured. Please set VITE_API_URL or VITE_API_BASE_URL in your .env file');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get a single category by slug
  getBySlug: async (slug: string): Promise<Category> => {
    if (!API_BASE_URL) {
      throw new Error('API_BASE_URL is not configured. Please set VITE_API_BASE_URL in your .env file');
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }
};

/** Parses Django/DRF validation errors from newsletter subscribe failures. */
export function getNewsletterSubscribeError(err: unknown): string {
  if (isAxiosError(err) && err.response?.data && typeof err.response.data === 'object') {
    const d = err.response.data as Record<string, unknown>;
    const emailErr = d.email;
    if (Array.isArray(emailErr) && emailErr[0]) return String(emailErr[0]);
    if (typeof emailErr === 'string') return emailErr;
    if (typeof d.detail === 'string') return d.detail;
    if (Array.isArray(d.non_field_errors) && d.non_field_errors[0]) return String(d.non_field_errors[0]);
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong. Please try again.';
}

// Newsletter API
export const newsletterApi = {
  subscribe: async (payload: { email: string }) => {
    const body = { email: payload.email.trim() };

    if (usesDjangoApi()) {
      const response = await axios.post<{ detail?: string }>(
        apiUrl('/api/newsletter/'),
        body,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    }

    if (!API_BASE_URL) {
      throw new Error('API_BASE_URL is not configured. Please set VITE_API_URL or VITE_API_BASE_URL in your .env file');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/newsletter`, {
        name: 'Subscriber',
        email: body.email,
        interestedCategories: [] as string[],
      });
      return response.data;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  },

  getReviews: async () => {
    if (usesDjangoApi()) {
      const response = await axios.get(apiUrl('/api/newsletter-reviews/'), {
        params: { page: 1, limit: 200, search: '' },
      });
      return response.data;
    }
    if (!API_BASE_URL) {
      throw new Error('API_BASE_URL is not configured. Please set VITE_API_URL or VITE_API_BASE_URL in your .env file');
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/newsletter-reviews`);
      return response.data;
    } catch (error) {
      console.error('Error fetching newsletter reviews:', error);
      throw error;
    }
  },

  addReview: async (payload: { rating: number; name: string; review: string; email: string }) => {
    const body = {
      name: payload.name.trim(),
      email: payload.email.trim(),
      rating: payload.rating,
      review: payload.review.trim(),
    };
    if (usesDjangoApi()) {
      const response = await axios.post(apiUrl('/api/newsletter-reviews/'), body, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    }
    if (!API_BASE_URL) {
      throw new Error('API_BASE_URL is not configured. Please set VITE_API_URL or VITE_API_BASE_URL in your .env file');
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/newsletter-reviews`, body);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },
};

// Comment API
export const commentApi = {
  addComment: async (blogId: string, payload: { name: string; email: string; comment: string; rating: number }) => {
    if (usesDjangoApi()) {
      const response = await axios.post(
        apiUrl(`/api/posts/${blogId}/comments/`),
        {
          post: String(blogId),
          name: payload.name,
          email: payload.email || '',
          comment: payload.comment,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    }
    if (!API_BASE_URL) {
      throw new Error('VITE_API_URL is not configured');
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/comment/${blogId}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error posting comment:', error);
      throw error;
    }
  },
  addReply: async (commentId: string, payload: { name: string; email: string; reply: string; rating: number }) => {
    if (usesDjangoApi()) {
      throw new Error('Comment replies are not supported by the Django blog API.');
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/comment-replies/${commentId}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error posting comment reply:', error);
      throw error;
    }
  },
}; 

// Success Stories API
export const successStoriesApi = {
  // Get all success stories with pagination
  getAll: async (params?: { page?: number; limit?: number; search?: string }): Promise<SuccessStoriesResponse> => {
    if (!API_BASE_URL) {
      throw new Error('API_BASE_URL is not configured. Please set VITE_API_BASE_URL in your .env file');
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/success-stories`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching success stories:', error);
      throw error;
    }
  },

  // Submit a new success story
  submit: async (payload: {
    fullName: string;
    email: string;
    monthlyIncomeBefore: number;
    monthlyIncomeNow: number;
    timeToTransform: string;
    primaryStrategyUsed: string;
    journey: string;
    publishPermission: boolean;
  }): Promise<any> => {
    if (!API_BASE_URL) {
      throw new Error('API_BASE_URL is not configured. Please set VITE_API_BASE_URL in your .env file');
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/success-stories`, payload);
      return response.data;
    } catch (error) {
      console.error('Error submitting success story:', error);
      throw error;
    }
  }
};

// Contact API
export const contactApi = {
  // Submit contact form
  submit: async (payload: ContactFormData): Promise<any> => {
    const body = {
      fullName: payload.fullName.trim(),
      emailAddress: payload.emailAddress.trim(),
      subject: payload.subject.trim(),
      message: payload.message.trim(),
    };

    if (usesDjangoApi()) {
      const response = await axios.post(apiUrl('/api/contact/'), body, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    }

    if (!API_BASE_URL) {
      throw new Error('API_BASE_URL is not configured. Please set VITE_API_URL or VITE_API_BASE_URL in your .env file');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/contact`, body);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },
};