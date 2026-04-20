import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import BlogCard from '@/components/blog/BlogCard';
import Pagination from '@/components/ui/pagination';
import { useBlogPosts } from '@/hooks/useApi';
import { Search as SearchIcon, Filter, X, Loader2 } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Show 12 items per page

  // Fetch blog posts from API
  const { data: apiResponse, isLoading } = useBlogPosts();
  const blogPosts = Array.isArray((apiResponse as any)?.data?.blogs) ? (apiResponse as any).data.blogs : [];

  // Get all unique tags from posts
  const allTags = Array.from(new Set(blogPosts.flatMap((post: any) => post.tags || [])));

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    } else {
      setResults(blogPosts);
    }
  }, [searchParams, blogPosts]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedTags]);

  const performSearch = (searchTerm: string) => {
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      if (!searchTerm.trim()) {
        setResults(blogPosts);
      } else {
        const filtered = blogPosts.filter((post: any) => {
          const searchLower = searchTerm.toLowerCase();
          const matchesText = 
            post.title.toLowerCase().includes(searchLower) ||
            post.excerpt.toLowerCase().includes(searchLower) ||
            post.content.toLowerCase().includes(searchLower) ||
            post.category.name.toLowerCase().includes(searchLower) ||
            (post.tags || []).some(tag => tag.toLowerCase().includes(searchLower));
          
          const matchesTags = selectedTags.length === 0 || 
            selectedTags.some(tag => (post.tags || []).includes(tag));
          
          return matchesText && matchesTags;
        });
        setResults(filtered);
      }
      setIsSearching(false);
    }, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      performSearch(query);
    }
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    performSearch(query);
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedTags([]);
    setSearchParams({});
    setResults(blogPosts);
  };

  // Pagination logic
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const popularSearches = [
    'passive income',
    'side hustles',
    'freelancing',
    'blogging',
    'investing',
    'online business'
  ];

  return (
    <Layout>
      <SEOHead />
      {/* Header */}
      <section className="bg-secondary/30 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Search Articles</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find exactly what you're looking for with our comprehensive search
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles, topics, strategies..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={isSearching}>
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>
          </form>

          {/* Popular Searches */}
          {!query && (
            <div className="mt-8">
              <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularSearches.map((search) => (
                  <Button
                    key={search}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery(search);
                      setSearchParams({ q: search });
                      performSearch(search);
                    }}
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Filters */}
      {allTags.length > 0 && (
        <section className="py-8 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by tags:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                 {allTags.slice(0, 10).map((tag: string) => (
                   <Badge
                     key={tag}
                     variant={selectedTags.includes(tag) ? "default" : "outline"}
                     className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                     onClick={() => handleTagToggle(tag)}
                   >
                     {tag}
                   </Badge>
                 ))}
                
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Search Results</h2>
              {query && (
                <p className="text-muted-foreground">
                  Results for "{query}"
                </p>
              )}
            </div>
            
            {results.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </div>
            )}
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="text-center py-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-lg">Loading articles...</span>
              </div>
            </div>
          ) : results.length === 0 && !isSearching ? (
            <div className="text-center py-16">
              <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6">
                Try different keywords or remove some filters
              </p>
              <div className="space-y-2">
                <p className="font-medium">Suggestions:</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Check your spelling</li>
                  <li>• Try more general terms</li>
                  <li>• Use different keywords</li>
                  <li>• Remove tag filters</li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentResults.map((post: any) => (
                  <BlogCard
                    key={post._id}
                    post={post}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={results.length}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Search Tips */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Search Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Use Specific Keywords</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Try "passive income" instead of "money"</li>
                <li>• Use "freelancing" for remote work content</li>
                <li>• Search "investing" for financial advice</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Filter by Tags</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Click tags to filter results</li>
                <li>• Combine multiple tags for precise results</li>
                <li>• Clear filters to see all articles</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Search;