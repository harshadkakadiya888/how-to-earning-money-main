import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Home, 
  BookOpen, 
  Info, 
  Mail, 
  Search, 
  Newspaper,
  Shield,
  FileText,
  Cookie,
  Grid3X3
} from 'lucide-react';
import { useBlogPosts, useCategories } from '@/hooks/useApi';

const Sitemap = () => {
  const sitePages = [
    { name: 'Home', url: '/', icon: Home, description: 'Main landing page with featured content' },
    { name: 'Blog', url: '/blog', icon: BookOpen, description: 'All articles about earning money' },
    { name: 'Categories', url: '/categories', icon: Grid3X3, description: 'Browse articles by category' },
    { name: 'About', url: '/about', icon: Info, description: 'Learn about our mission and team' },
    { name: 'Contact', url: '/contact', icon: Mail, description: 'Get in touch with us' },
    { name: 'Search', url: '/search', icon: Search, description: 'Search articles and content' },
    { name: 'Newsletter', url: '/newsletter', icon: Newspaper, description: 'Subscribe to our newsletter' },
  ];

  const legalPages = [
    { name: 'Privacy Policy', url: '/privacy', icon: Shield, description: 'How we protect your privacy' },
    { name: 'Terms of Service', url: '/terms', icon: FileText, description: 'Terms and conditions' },
    { name: 'Cookie Policy', url: '/cookies', icon: Cookie, description: 'How we use cookies' },
  ];

  // Fetch data from API
  const { data: apiResponse = {} } = useBlogPosts();
  const blogPosts = Array.isArray((apiResponse as any)?.data?.blogs) ? (apiResponse as any).data.blogs : [];
  const { data: categories = [] } = useCategories();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <SEOHead />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Sitemap</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find all pages and content on How to Earning Money. Navigate easily to any section of our website.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Pages */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold flex items-center">
                <Home className="h-6 w-6 mr-2" />
                Main Pages
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sitePages.map((page) => {
                  const IconComponent = page.icon;
                  return (
                    <div key={page.url} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <IconComponent className="h-5 w-5 mt-0.5 text-primary" />
                      <div className="flex-1">
                        <Link 
                          to={page.url} 
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {page.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {page.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Legal Pages */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                Legal Pages
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {legalPages.map((page) => {
                  const IconComponent = page.icon;
                  return (
                    <div key={page.url} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <IconComponent className="h-5 w-5 mt-0.5 text-primary" />
                      <div className="flex-1">
                        <Link 
                          to={page.url} 
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {page.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {page.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold flex items-center">
                <Grid3X3 className="h-6 w-6 mr-2" />
                Categories
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/blog?category=${category._id}`}
                    className="p-3 rounded-lg hover:bg-muted/50 transition-colors text-sm font-medium hover:text-primary"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Articles */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold flex items-center">
                <BookOpen className="h-6 w-6 mr-2" />
                Recent Articles
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {blogPosts.slice(0, 8).map((post) => (
                  <div key={post._id} className="flex items-start justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <Link 
                        to={`/blog/${post._id}`} 
                        className="font-medium hover:text-primary transition-colors line-clamp-2"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {post.category.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(post.publishDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link 
                  to="/blog" 
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View all articles →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Total pages: {sitePages.length + legalPages.length + blogPosts.length + categories.length}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Sitemap;