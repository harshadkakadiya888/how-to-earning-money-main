import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export interface DynamicSEOConfig {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  tags?: string[];
  schemaType?: 'Article' | 'WebPage' | 'Organization' | 'Person';
  breadcrumbs?: { name: string; url: string }[];
  customStructuredData?: any;
}

export const useDynamicSEO = (pageData?: any): DynamicSEOConfig => {
  const location = useLocation();
  const pathname = location.pathname;
  const searchParams = new URLSearchParams(location.search);

  return useMemo(() => {
    const baseUrl = window.location.origin;
    const currentUrl = `${baseUrl}${pathname}`;

    // Default SEO config
    const defaultConfig: DynamicSEOConfig = {
      title: "How to Earning Money - Your Guide to Financial Success",
      description: "Discover practical strategies to increase your income with proven guides, honest reviews, and real success stories.",
      keywords: "earning money, financial success, income strategies, online business, passive income",
      image: "https://lovable.dev/opengraph-image-p98pqg.png",
      type: "website",
      author: "How to Earning Money",
      schemaType: 'WebPage',
      breadcrumbs: []
    };

    // Dynamic SEO based on route
    if (pathname === '/') {
      return {
        ...defaultConfig,
        title: "How to Earning Money - Master Financial Success | Proven Income Strategies",
        description: "Master proven income strategies with comprehensive guides, success stories, and expert reviews. Learn passive income, side hustles, investing tips, and wealth building techniques from real experts.",
        keywords: "earning money, passive income, side hustles, online business, investing, financial freedom, make money online, income strategies, wealth building, financial education",
        schemaType: 'WebPage',
        customStructuredData: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "How to Earning Money",
          "url": baseUrl,
          "description": "Your complete guide to financial success and income strategies",
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        }
      };
    }

    if (pathname === '/blog') {
      const categoryParam = searchParams.get('category');
      const searchParam = searchParams.get('search');
      
      let title = "Money-Making Blog | Proven Income Strategies & Financial Guides";
      let description = "Explore comprehensive guides on earning money online, passive income strategies, side hustles, investing tips, and wealth building. Updated regularly with proven methods.";
      let keywords = "money making blog, income strategies, financial guides, passive income, side hustles, online business, investing tips";

      if (categoryParam) {
        title = `${pageData?.categoryName || 'Category'} Articles | Money-Making Strategies`;
        description = `Discover proven ${pageData?.categoryName?.toLowerCase() || 'income'} strategies with step-by-step guides, expert tips, and real success stories.`;
        keywords = `${pageData?.categoryName?.toLowerCase() || 'income'} strategies, earn money, financial guides, ${pageData?.categoryName?.toLowerCase() || 'income'} tips`;
      }

      if (searchParam) {
        title = `Search Results: ${searchParam} | How to Earning Money`;
        description = `Find articles about ${searchParam} - comprehensive guides and strategies to help you earn money.`;
        keywords = `${searchParam}, earning money, income strategies, financial guides`;
      }

      return {
        ...defaultConfig,
        title,
        description,
        keywords,
        schemaType: 'WebPage',
        breadcrumbs: [
          { name: 'Home', url: baseUrl },
          { name: 'Blog', url: currentUrl }
        ]
      };
    }

    if (pathname.startsWith('/blog/') && pageData) {
      // Individual blog post
      const post = pageData;
      return {
        ...defaultConfig,
        title: `${post.title} | How to Earning Money`,
        description: post.excerpt || post.description || defaultConfig.description,
        keywords: post.tags?.join(', ') || `${post.category?.name?.toLowerCase() || 'earning money'}, income strategies, financial guides`,
        image: post.imageUrl || post.image || defaultConfig.image,
        type: "article",
        publishedTime: post.publishedAt || post.createdAt,
        modifiedTime: post.updatedAt,
        category: post.category?.name,
        tags: post.tags || [],
        schemaType: 'Article',
        breadcrumbs: [
          { name: 'Home', url: baseUrl },
          { name: 'Blog', url: `${baseUrl}/blog` },
          { name: post.title, url: currentUrl }
        ],
        customStructuredData: {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.excerpt || post.description,
          "image": post.imageUrl || post.image,
          "datePublished": post.publishedAt || post.createdAt,
          "dateModified": post.updatedAt,
          "author": {
            "@type": "Person",
            "name": post.author || "How to Earning Money",
            "url": `${baseUrl}/about`
          },
          "publisher": {
            "@type": "Organization",
            "name": "How to Earning Money",
            "url": baseUrl,
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/favicon.ico`
            }
          },
          "articleSection": post.category?.name,
          "keywords": post.tags?.join(', '),
          "wordCount": post.content?.length || 0,
          "readingTime": post.readTime || "5 min read"
        }
      };
    }

    if (pathname === '/categories') {
      return {
        ...defaultConfig,
        title: "Money-Making Categories | Browse Income Strategies by Topic",
        description: "Browse comprehensive income strategies organized by category. Find the perfect money-making method that matches your skills, interests, and available time.",
        keywords: "income categories, money making methods, financial strategies, passive income, side hustles, online business categories, earning opportunities",
        schemaType: 'WebPage',
        breadcrumbs: [
          { name: 'Home', url: baseUrl },
          { name: 'Categories', url: currentUrl }
        ]
      };
    }

    if (pathname.startsWith('/categories/')) {
      const categorySlug = pathname.split('/')[2];
      const categoryName = pageData?.name || categorySlug.replace(/-/g, ' ');
      
      return {
        ...defaultConfig,
        title: `${categoryName} Strategies | How to Earn Money`,
        description: `Discover proven ${categoryName.toLowerCase()} strategies to increase your income. Comprehensive guides, tips, and real success stories.`,
        keywords: `${categoryName.toLowerCase()}, earning money, income strategies, ${categoryName.toLowerCase()} tips, financial guides`,
        schemaType: 'WebPage',
        breadcrumbs: [
          { name: 'Home', url: baseUrl },
          { name: 'Categories', url: `${baseUrl}/categories` },
          { name: categoryName, url: currentUrl }
        ]
      };
    }

    if (pathname === '/about') {
      return {
        ...defaultConfig,
        title: "About How to Earning Money | Your Trusted Financial Guide",
        description: "Learn about How to Earning Money - an independent finance blog dedicated to sharing practical income strategies, honest reviews, and proven methods for financial success.",
        keywords: "about how to earning money, financial blog, income strategies, money making guide, financial education, wealth building",
        schemaType: 'Organization',
        breadcrumbs: [
          { name: 'Home', url: baseUrl },
          { name: 'About', url: currentUrl }
        ],
        customStructuredData: {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "How to Earning Money",
          "url": baseUrl,
          "description": "Independent finance blog providing practical income strategies and financial education",
          "foundingDate": "2024",
          "areaServed": "Worldwide",
          "knowsAbout": ["Income Strategies", "Passive Income", "Side Hustles", "Online Business", "Financial Education"],
          "sameAs": []
        }
      };
    }

    if (pathname === '/contact') {
      return {
        ...defaultConfig,
        title: "Contact Us | How to Earning Money - Get Financial Guidance",
        description: "Get in touch with How to Earning Money for questions about income strategies, suggestions for content, or to share your success story.",
        keywords: "contact how to earning money, financial questions, income strategy help, money making support",
        schemaType: 'WebPage',
        breadcrumbs: [
          { name: 'Home', url: baseUrl },
          { name: 'Contact', url: currentUrl }
        ]
      };
    }

    if (pathname === '/search') {
      const searchQuery = searchParams.get('q') || '';
      return {
        ...defaultConfig,
        title: searchQuery ? `Search Results: ${searchQuery} | How to Earning Money` : "Search Financial Guides | How to Earning Money",
        description: searchQuery 
          ? `Find articles about ${searchQuery} - comprehensive guides and strategies to help you earn money.`
          : "Search our comprehensive database of money-making strategies, financial guides, and income opportunities.",
        keywords: searchQuery ? `${searchQuery}, earning money, search` : "search financial guides, find income strategies, money making search",
        schemaType: 'WebPage',
        breadcrumbs: [
          { name: 'Home', url: baseUrl },
          { name: 'Search', url: currentUrl }
        ]
      };
    }

    if (pathname === '/newsletter') {
      return {
        ...defaultConfig,
        title: "Financial Newsletter | Weekly Money-Making Tips & Strategies",
        description: "Subscribe to our weekly newsletter for exclusive income strategies, financial tips, and money-making opportunities delivered to your inbox.",
        keywords: "financial newsletter, money making tips, income strategies newsletter, weekly financial advice",
        schemaType: 'WebPage',
        breadcrumbs: [
          { name: 'Home', url: baseUrl },
          { name: 'Newsletter', url: currentUrl }
        ]
      };
    }

    if (pathname === '/success-stories') {
      return {
        ...defaultConfig,
        title: "Success Stories | Real People, Real Income Results",
        description: "Read inspiring success stories from people who transformed their finances using our strategies. Real results, real people, real income growth.",
        keywords: "success stories, income success, financial transformation, money making results, real earnings",
        schemaType: 'WebPage',
        breadcrumbs: [
          { name: 'Home', url: baseUrl },
          { name: 'Success Stories', url: currentUrl }
        ]
      };
    }

    if (pathname === '/privacy') {
      return {
        ...defaultConfig,
        title: "Privacy Policy | How to Earning Money",
        description: "Learn how How to Earning Money protects your privacy and handles your personal information.",
        keywords: "privacy policy, data protection, how to earning money privacy",
        schemaType: 'WebPage',
        breadcrumbs: [
          { name: 'Home', url: baseUrl },
          { name: 'Privacy Policy', url: currentUrl }
        ]
      };
    }

    if (pathname === '/terms') {
      return {
        ...defaultConfig,
        title: "Terms of Service | How to Earning Money",
        description: "Read the terms of service for using How to Earning Money website and services.",
        keywords: "terms of service, website terms, how to earning money terms",
        schemaType: 'WebPage',
        breadcrumbs: [
          { name: 'Home', url: baseUrl },
          { name: 'Terms of Service', url: currentUrl }
        ]
      };
    }

    if (pathname === '/cookies') {
      return {
        ...defaultConfig,
        title: "Cookie Policy | How to Earning Money",
        description: "Learn about how How to Earning Money uses cookies to improve your browsing experience.",
        keywords: "cookie policy, website cookies, how to earning money cookies",
        schemaType: 'WebPage',
        breadcrumbs: [
          { name: 'Home', url: baseUrl },
          { name: 'Cookie Policy', url: currentUrl }
        ]
      };
    }

    if (pathname === '/sitemap') {
      return {
        ...defaultConfig,
        title: "Sitemap | How to Earning Money Website Navigation",
        description: "Browse the complete sitemap of How to Earning Money to find all our income strategies, guides, and financial resources.",
        keywords: "sitemap, website navigation, how to earning money pages",
        schemaType: 'WebPage',
        breadcrumbs: [
          { name: 'Home', url: baseUrl },
          { name: 'Sitemap', url: currentUrl }
        ]
      };
    }

    // 404 page
    if (pathname === '*' || pathname.includes('404')) {
      return {
        ...defaultConfig,
        title: "Page Not Found | How to Earning Money",
        description: "The page you're looking for doesn't exist. Explore our income strategies and financial guides instead.",
        keywords: "page not found, 404, how to earning money",
        schemaType: 'WebPage'
      };
    }

    return defaultConfig;
  }, [pathname, searchParams, pageData]);
};