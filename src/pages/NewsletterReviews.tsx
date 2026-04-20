import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import Pagination from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { useNewsletterReviews, useAddNewsletterReview } from '@/hooks/useApi';
import {
  Star,
  Plus,
  MessageCircle,
  Loader2
} from 'lucide-react';

const NewsletterReviews = () => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Show 9 reviews per page (3x3 grid)

  const [reviewData, setReviewData] = useState({
    name: '',
    review: '',
    rating: 5,
    email: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: apiResponse = {}, isLoading, error } = useNewsletterReviews();
  const reviews = Array.isArray(apiResponse.data?.reviews) ? apiResponse.data.reviews : [];
  const addReviewMutation = useAddNewsletterReview();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Name validation
    if (!reviewData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (reviewData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!reviewData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Review validation
    if (!reviewData.review.trim()) {
      newErrors.review = 'Review is required';
    } else if (reviewData.review.trim().length > 200) {
      newErrors.review = 'Review must be 200 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setReviewData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addReviewMutation.mutateAsync({
        name: reviewData.name,
        email: reviewData.email,
        review: reviewData.review,
        rating: reviewData.rating,
      });

      setReviewData({
        name: '',
        review: '',
        rating: 5,
        email: ''
      });
      setErrors({});
      setIsReviewOpen(false); // Close dialog after submit

      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      });
    } catch (error) {
      toast({
        title: "Failed to submit review",
        description: "There was a problem submitting your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = reviews.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
        <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
    ));
  };

  if (isLoading) {
    return (
        <Layout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-lg">Loading reviews...</span>
              </div>
            </div>
          </div>
        </Layout>
    );
  }

  if (error) {
    return (
        <Layout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Error Loading Reviews</h1>
              <p className="text-muted-foreground mb-8">
                There was a problem loading the reviews. Please try again later.
              </p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        </Layout>
    );
  }

  return (
      <Layout>
        <SEOHead />
        {/* Header */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <MessageCircle className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl font-bold mb-4">
              Newsletter Reviews
            </h1>
            <p className="text-xl opacity-90 mb-8">
              See what our subscribers are saying about our newsletter
            </p>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">All Reviews</h2>
                <p className="text-muted-foreground">
                  {reviews.length} reviews from our subscribers
                </p>
              </div>
              <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share Your Experience</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="reviewName">Your Name</Label>
                      <Input
                          id="reviewName"
                          value={reviewData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your name"
                          className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="reviewEmail">Your Email</Label>
                      <Input
                          id="reviewEmail"
                          type="email"
                          value={reviewData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your@email.com"
                          className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <div className="flex items-center space-x-1 mt-2">
                        {Array.from({ length: 5 }, (_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setReviewData(prev => ({ ...prev, rating: i + 1 }))}
                                className="focus:outline-none"
                            >
                              <Star
                                  className={`h-5 w-5 ${
                                      i < reviewData.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                  }`}
                              />
                            </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reviewText">Your Review</Label>
                      <Textarea
                          id="reviewText"
                          value={reviewData.review}
                          onChange={(e) => handleInputChange('review', e.target.value)}
                          placeholder="Share your experience with our newsletter..."
                          rows={4}
                          className={submitted && errors.review ? 'border-red-500' : ''}
                          maxLength={200}
                      />
                      {submitted && errors.review && <p className="text-red-500 text-sm mt-1">{errors.review}</p>}
                      <div className="text-right text-xs text-muted-foreground mt-1">{reviewData.review.length}/200</div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                          'Submit Review'
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Reviews Grid */}
            {reviews.length > 0 ? (
                <>
                  {reviews.length <= 3 ? (
                    <div className="flex justify-center items-center gap-6">
                      {currentReviews.map((review: any) => (
                        <Card key={review.id} className="hover:shadow-medium transition-shadow w-80">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{review.name}</CardTitle>
                              <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4">
                              "{review.review.length > 150 ? review.review.slice(0, 150) + '...' : review.review}"
                            </p>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{review.date}</span>
                              <span>★ {review.rating}/5</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentReviews.map((review: any) => (
                        <Card key={review.id} className="hover:shadow-medium transition-shadow">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{review.name}</CardTitle>
                              <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4">
                              "{review.review.length > 150 ? review.review.slice(0, 150) + '...' : review.review}"
                            </p>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{review.date}</span>
                              <span>★ {review.rating}/5</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                      <div className="mt-12">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalItems={reviews.length}
                            itemsPerPage={itemsPerPage}
                        />
                      </div>
                  )}
                </>
            ) : (
                <div className="text-center py-16">
                  <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Be the first to share your experience with our newsletter!
                  </p>
                  <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Share Your Experience</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="reviewName">Your Name</Label>
                          <Input
                              id="reviewName"
                              value={reviewData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Enter your name"
                              className={errors.name ? 'border-red-500' : ''}
                          />
                          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                          <Label htmlFor="reviewEmail">Your Email</Label>
                          <Input
                              id="reviewEmail"
                              type="email"
                              value={reviewData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="your@email.com"
                              className={errors.email ? 'border-red-500' : ''}
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                          <Label htmlFor="rating">Rating</Label>
                          <div className="flex items-center space-x-1 mt-2">
                            {Array.from({ length: 5 }, (_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setReviewData(prev => ({ ...prev, rating: i + 1 }))}
                                    className="focus:outline-none"
                                >
                                  <Star
                                      className={`h-5 w-5 ${
                                          i < reviewData.rating
                                              ? 'text-yellow-400 fill-current'
                                              : 'text-gray-300'
                                      }`}
                                  />
                                </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="reviewText">Your Review</Label>
                          <Textarea
                              id="reviewText"
                              value={reviewData.review}
                              onChange={(e) => handleInputChange('review', e.target.value)}
                              placeholder="Share your experience with our newsletter..."
                              rows={4}
                              className={submitted && errors.review ? 'border-red-500' : ''}
                              maxLength={200}
                          />
                          {submitted && errors.review && <p className="text-red-500 text-sm mt-1">{errors.review}</p>}
                          <div className="text-right text-xs text-muted-foreground mt-1">{reviewData.review.length}/200</div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                              'Submit Review'
                          )}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
            )}
          </div>
        </section>
      </Layout>
  );
};

export default NewsletterReviews;