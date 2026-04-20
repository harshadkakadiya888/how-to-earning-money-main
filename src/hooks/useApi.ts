import { useMemo } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { blogApi, categoryApi, BlogPost, Category, newsletterApi, successStoriesApi, contactApi, SuccessStoriesResponse, ContactFormData, BlogPostsResponse, CategoriesResponse } from '@/lib/api';
import {
  buildBlogListPage,
  fetchBlogsPerCategoryBundle,
  fetchDjangoPostDetailBundle,
  fetchDjangoPostList,
} from '@/lib/djangoBlog';

// Blog API hooks — Django: GET /api/posts/ (single fetch, filter/paginate client-side)
export const useBlogPosts = (params?: { page?: number; limit?: number; category?: string; search?: string; sort?: string }) => {
  const q = useQuery({
    queryKey: ['django-blog-posts'],
    queryFn: fetchDjangoPostList,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const shaped = useMemo(
    () => buildBlogListPage(q.data ?? [], params),
    [q.data, params?.page, params?.limit, params?.category, params?.search, params?.sort]
  );

  return { ...q, data: shaped };
};

export const useBlogPost = (id: string) => {
  return useQuery({
    queryKey: ['blog-post', id],
    queryFn: () => blogApi.getById(id),
    enabled: !!id && id !== 'undefined',
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useBlogPostsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['blog-posts', 'category', category],
    queryFn: () => blogApi.getByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    select: (data: BlogPostsResponse) => data.data.blogs, // Extract blogs array
  });
};

export const useBlogPostBySlug = (slug: string) => {
  const { data: response } = useBlogPosts();
  const allPosts = response?.data?.blogs || [];
  
  const post = allPosts.find((post: any) => post.slug === slug);
  
  return {
    data: post,
    isLoading: false,
    error: !post && slug ? new Error('Post not found') : null
  };
};

export const useBlogWithCommentsBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['django-blog-with-comments', slug],
    queryFn: () => fetchDjangoPostDetailBundle(slug),
    enabled: !!slug,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Category API hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    select: (data: CategoriesResponse) => data.data.categories, // Extract categories array
  });
};

export const useCategory = (slug: string) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoryApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
}; 

export const useNewsletterReviews = () => {
  return useQuery({
    queryKey: ['newsletter-reviews'],
    queryFn: () => newsletterApi.getReviews(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

export const useAddNewsletterReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: { rating: number; name: string; review: string; email: string }) => 
      newsletterApi.addReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-reviews'] });
    },
  });
}; 

// Success Stories API hooks
export const useSuccessStories = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ['success-stories', params],
    queryFn: () => successStoriesApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSubmitSuccessStory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: {
      fullName: string;
      email: string;
      monthlyIncomeBefore: number;
      monthlyIncomeNow: number;
      timeToTransform: string;
      primaryStrategyUsed: string;
      journey: string;
      publishPermission: boolean;
    }) => successStoriesApi.submit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['success-stories'] });
    },
  });
};

// Contact API hooks
export const useSubmitContact = () => {
  return useMutation({
    mutationFn: (payload: ContactFormData) => contactApi.submit(payload),
  });
}; 

// Fetch 3 blogs per category from backend
export const useBlogsPerCategory = () => {
  return useQuery({
    queryKey: ['django-blogs-per-category'],
    queryFn: () => fetchBlogsPerCategoryBundle(),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}; 