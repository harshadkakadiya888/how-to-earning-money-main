import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import BlogCard from '@/components/blog/BlogCard';
import Pagination from '@/components/ui/pagination';
import { useBlogPosts, useCategories } from '@/hooks/useApi';
import { Search, Filter, Grid, List, Loader2 } from 'lucide-react';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const query = useQuery();
  const navigate = useNavigate();
  const selectedCategory = query.get('category') || 'all';

  // Remove selectedCategory state and useEffect hooks

  // Update URL when category filter changes
  const handleCategoryChange = (category: string) => {
    const newQuery = new URLSearchParams();
    if (category !== 'all') {
      newQuery.set('category', category);
    }
    const newPath = `/blog${newQuery.toString() ? `?${newQuery.toString()}` : ''}`;
    navigate(newPath, { replace: true });
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Fetch data from API
  const { data: apiResponse = {}, isLoading: isLoadingPosts, error: postsError } = useBlogPosts({
    page: currentPage,
    limit: itemsPerPage,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchTerm || undefined,
    sort: sortBy
  });

  let postsList = Array.isArray((apiResponse as any)?.data?.blogs) ? (apiResponse as any).data.blogs : [];
  const pagination = (apiResponse as any)?.pagination || {};
  const totalPages = pagination.pages || 1;
  const { data: categories = [], isLoading: isLoadingCategories, error: categoriesError } = useCategories();

  const categoriesList = Array.isArray(categories) ? categories : [];

  // Client-side sorting if API doesn't handle it
  if (sortBy === 'alphabetical') {
    postsList = [...postsList].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === 'latest') {
    postsList = [...postsList].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const selectedCategoryObj = categoriesList.find(cat => cat._id === selectedCategory);

  // Reset to first page when filters change (except category, which is handled in handleCategoryChange)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
      <Layout>
        <SEOHead pageData={{ categoryName: selectedCategoryObj?.name }} />

        {/* Header */}
        <section className="bg-secondary/30 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                {selectedCategoryObj ? selectedCategoryObj.name : 'All Blog Posts'}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {selectedCategoryObj
                    ? `Explore all articles in the "${selectedCategoryObj.name}" category.`
                    : 'Discover proven ways to earn money online, side hustles, investing, and more.'}
              </p>
            </div>
          </div>
        </section>

        {/* Back to All Categories Button */}
        {selectedCategory !== 'all' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-2">
              <Button variant="outline" asChild>
                <Link to="/categories">
                  ← Back to All Categories
                </Link>
              </Button>
            </div>
        )}

        {/* Search and Filters */}
        <section className="py-8 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                      placeholder="Search articles, topics, strategies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoriesList.map(category => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                {/* Results count */}
                <div className="text-sm text-muted-foreground">
                  {pagination.total || 0} article{(pagination.total || 0) !== 1 ? 's' : ''} found
                  {selectedCategory !== 'all' && ` in ${categoriesList.find(c => c._id === selectedCategory)?.name}`}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoadingPosts ? (
                <div className="text-center py-16">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="text-lg">Loading articles...</span>
                  </div>
                </div>
            ) : postsError ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-semibold mb-2">Error loading articles</h3>
                  <p className="text-muted-foreground mb-4">
                    Please try again later
                  </p>
                  <Button onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
            ) : postsList.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <Button onClick={() => {
                    setSearchTerm('');
                    handleCategoryChange('all');
                  }}>
                    Clear Filters
                  </Button>
                </div>
            ) : (
                <>
                  <div className={viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                      : 'space-y-6'
                  }>
                    {postsList.map((post) => (
                        <BlogCard
                            key={post._id}
                            post={post}
                            variant={viewMode === 'list' ? 'compact' : 'default'}
                        />
                    ))}
                  </div>
                  {/* Pagination */}
                  <div className="mt-12">
                    <Pagination
                        currentPage={pagination.page || 1}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalItems={pagination.total || 0}
                        itemsPerPage={pagination.limit || itemsPerPage}
                    />
                  </div>
                </>
            )}
          </div>
        </section>

        {/* Categories CTA */}
        <section className="py-16 bg-secondary/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Looking for Something Specific?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Browse our organized categories to find exactly what you need to boost your income.
            </p>
            <Button size="lg" asChild>
              <Link to="/categories">
                Browse All Categories
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
  );
};

export default Blog;
