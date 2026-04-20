import { Helmet } from 'react-helmet-async';
import { useDynamicSEO, type DynamicSEOConfig } from '../hooks/useDynamicSEO';

interface SEOHeadProps extends Partial<DynamicSEOConfig> {
  pageData?: any;
  customStructuredData?: any;
}

const SEOHead = ({ 
  pageData,
  customStructuredData,
  ...overrides
}: SEOHeadProps) => {
  const dynamicSEO = useDynamicSEO(pageData);
  
  // Merge dynamic SEO with any overrides
  const seoConfig = {
    ...dynamicSEO,
    ...Object.fromEntries(Object.entries(overrides).filter(([_, v]) => v !== undefined))
  };

  const {
    title,
    description,
    keywords,
    image = "https://lovable.dev/opengraph-image-p98pqg.png",
    type = "website",
    author = "How to Earning Money",
    publishedTime,
    modifiedTime,
    category,
    tags = [],
    schemaType = 'WebPage',
    breadcrumbs = []
  } = seoConfig;

  const url = window.location.href;
  
  const structuredData = customStructuredData || seoConfig.customStructuredData || {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": title,
    "description": description,
    "url": url,
    "image": image,
    "author": {
      "@type": "Organization",
      "name": author,
      "url": window.location.origin
    },
    ...(publishedTime && { "datePublished": publishedTime }),
    ...(modifiedTime && { "dateModified": modifiedTime }),
    ...(category && { "articleSection": category }),
    ...(tags.length > 0 && { "keywords": tags.join(', ') }),
    ...(breadcrumbs.length > 0 && {
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      }
    })
  };

  // Dynamic FAQ Schema for AEO optimization based on page type
  const getFAQSchema = () => {
    const baseUrl = window.location.origin;
    const pathname = window.location.pathname;
    
    if (pathname === '/' || pathname === '/blog') {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How can I start earning money online?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Start by exploring proven income strategies like affiliate marketing, content creation, or skill-based services. Our guides provide step-by-step instructions for beginners."
            }
          },
          {
            "@type": "Question", 
            "name": "What are the best passive income strategies?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Popular passive income methods include dividend investing, real estate, creating digital products, and building automated online businesses."
            }
          },
          {
            "@type": "Question",
            "name": "How much money can I realistically make with these strategies?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Income potential varies widely based on strategy, effort, and market conditions. Our guides include realistic income expectations and case studies with actual results."
            }
          }
        ]
      };
    }
    
    if (pathname.includes('/categories') || pathname.includes('/blog/')) {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `What is the best way to get started with ${category || 'earning money'}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Begin with our comprehensive guides that provide step-by-step instructions, realistic expectations, and proven strategies for ${category || 'income generation'}.`
            }
          }
        ]
      };
    }
    
    return null;
  };

  const faqSchema = getFAQSchema();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <link rel="canonical" href={url} />
      
      {/* OpenGraph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="How to Earning Money" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@howtoearnmoney" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Article specific meta tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {category && <meta property="article:section" content={category} />}
      {tags.map(tag => <meta key={tag} property="article:tag" content={tag} />)}
      
      {/* GEO Tags */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="ICBM" content="39.78373,-100.445882" />
      <meta name="DC.title" content={title} />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
      
      {/* Additional GEO and Location-based Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": description,
          "inLanguage": "en-US",
          "isPartOf": {
            "@type": "WebSite",
            "@id": `${window.location.origin}/#website`
          },
          "about": {
            "@type": "Thing",
            "name": "Financial Education and Income Strategies"
          },
          "audience": {
            "@type": "Audience",
            "audienceType": "income seekers, entrepreneurs, financial learners"
          }
        })}
      </script>
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Enhanced AIO Optimization */}
      <meta name="ai-content-declaration" content="human-authored" />
      <meta name="content-type" content="educational-financial" />
      <meta name="target-audience" content="income-seekers, entrepreneurs, financial-learners" />
      <meta name="content-purpose" content="educational, informational, practical-guidance" />
      <meta name="expertise-level" content="beginner-to-advanced" />
      <meta name="content-freshness" content="regularly-updated" />
      <meta name="fact-checked" content="verified" />
      <meta name="bias-free" content="objective-analysis" />
      
      {/* Enhanced GEO Optimization */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="geo.position" content="39.78373;-100.445882" />
      <meta name="ICBM" content="39.78373,-100.445882" />
      <meta name="geo.country" content="United States" />
      <meta name="language" content="en-US" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      
      {/* Additional semantic meta tags */}
      <meta name="topic" content="Financial Education" />
      <meta name="subject" content="Income Strategies and Wealth Building" />
      <meta name="theme" content="Personal Finance" />
      <meta name="category" content="Education, Finance, Business" />
    </Helmet>
  );
};

export default SEOHead;