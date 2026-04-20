import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { useSuccessStories } from '@/hooks/useApi';
import { 
  Star, 
  Quote, 
  DollarSign, 
  Search,
  TrendingUp,
  Clock,
  Target,
  User
} from 'lucide-react';

const SuccessStories = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error } = useSuccessStories({
    page,
    limit: 12,
    search: debouncedSearch
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStrategyCategory = (strategy: string) => {
    const categories = {
      'Freelancing': 'Freelancing',
      'Upwork': 'Freelancing',
      'Fiverr': 'Freelancing',
      'Blogging': 'Content Creation',
      'Content Creation': 'Content Creation',
      'Digital Products': 'Digital Products',
      'Affiliate Marketing': 'Affiliate Marketing',
      'E-commerce': 'E-commerce',
      'Dropshipping': 'E-commerce',
      'Investing': 'Investing',
      'Consulting': 'Consulting',
      'Online Courses': 'Education',
      'Tutoring': 'Education',
      'Virtual Assistant': 'Services',
      'Social Media': 'Content Creation',
      'YouTube': 'Content Creation',
      'Podcasting': 'Content Creation'
    };

    for (const [key, category] of Object.entries(categories)) {
      if (strategy.toLowerCase().includes(key.toLowerCase())) {
        return category;
      }
    }
    return 'Other';
  };

  if (error) {
    return (
      <Layout>
        <SEOHead />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Error Loading Success Stories</h1>
            <p className="text-muted-foreground">
              There was an error loading the success stories. Please try again later.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead />
      {/* Header */}
      <section className="bg-secondary/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Success Stories</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real stories from real people who transformed their financial lives using the strategies 
            and guides from our platform. Be inspired by their journeys.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Stats */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, strategy, or story..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {data && (
                <div className="text-sm text-muted-foreground">
                  Showing {data.results} of {data.pagination.total} stories
                </div>
              )}
            </div>

            {/* Stats */}
            {data && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{data.pagination.total}</div>
                    <div className="text-sm text-muted-foreground">Total Stories</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {data.data.successStories.length > 0 
                        ? Math.round(data.data.successStories.reduce((acc, story) => acc + story.monthlyIncomeNow, 0) / data.data.successStories.length)
                        : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Monthly Income</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {data.data.successStories.length > 0 
                        ? Math.round(data.data.successStories.reduce((acc, story) => acc + story.monthlyIncomeNow, 0) / data.data.successStories.reduce((acc, story) => acc + story.monthlyIncomeBefore, 0) * 100)
                        : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Income Increase</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {data.data.successStories.length > 0 
                        ? new Set(data.data.successStories.map(story => getStrategyCategory(story.primaryStrategyUsed))).size
                        : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Different Strategies</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Stories Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-12 h-12 bg-muted rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : data?.data.successStories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No stories found</h3>
              <p className="text-muted-foreground">
                {search ? 'Try adjusting your search terms.' : 'Be the first to share your success story!'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {data?.data.successStories.map((story) => (
                  <Card key={story._id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      {/* Header with avatar and basic info */}
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {getInitials(story.fullName)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground">{story.fullName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(story.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Income and strategy badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="default" className="text-xs">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {formatCurrency(story.monthlyIncomeNow)}/month
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Target className="h-3 w-3 mr-1" />
                          {getStrategyCategory(story.primaryStrategyUsed)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {story.timeToTransform}
                        </Badge>
                      </div>

                      {/* Income transformation */}
                      <div className="mb-4 p-3 bg-secondary/30 rounded-lg">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Before:</span>
                          <span className="font-medium">{formatCurrency(story.monthlyIncomeBefore)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">After:</span>
                          <span className="font-medium text-green-600">{formatCurrency(story.monthlyIncomeNow)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="text-muted-foreground">Increase:</span>
                          <span className="font-medium text-green-600">
                            {Math.round((story.monthlyIncomeNow - story.monthlyIncomeBefore) / story.monthlyIncomeBefore * 100)}%
                          </span>
                        </div>
                      </div>

                      {/* Story content */}
                      <div className="relative mb-4">
                        <Quote className="absolute -top-1 -left-1 h-4 w-4 text-primary/40" />
                        <p className="text-sm leading-relaxed text-muted-foreground pl-4 line-clamp-4">
                          {story.journey}
                        </p>
                      </div>

                      {/* Strategy used */}
                      <div className="text-xs text-muted-foreground">
                        <strong>Strategy:</strong> {story.primaryStrategyUsed}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

                             {/* Pagination */}
               {data && data.pagination.pages > 1 && (
                 <Pagination
                   currentPage={page}
                   totalPages={data.pagination.pages}
                   onPageChange={setPage}
                   totalItems={data.pagination.total}
                   itemsPerPage={data.pagination.limit}
                   className="mt-8"
                 />
               )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default SuccessStories; 