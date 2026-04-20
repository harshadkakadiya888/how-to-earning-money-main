import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { useToast } from '@/hooks/use-toast';
import {
  Mail,
  CheckCircle,
  Star,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Shield,
  Plus
} from 'lucide-react';
import { NewsletterSubscribeForm } from '@/components/NewsletterSubscribeForm';
import { useAddNewsletterReview } from '@/hooks/useApi';
import { useNewsletterReviews } from '@/hooks/useApi';
import { Link } from 'react-router-dom';

const Newsletter = () => {
  const [reviewData, setReviewData] = useState({
    name: '',
    review: '',
    rating: 5,
    email: ''
  });
  const [reviewErrors, setReviewErrors] = useState<{[key: string]: string}>({});
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const { toast } = useToast();
  const addReviewMutation = useAddNewsletterReview();
  const { data: reviewsApiResponse = {}, isLoading: isLoadingReviews, error: reviewsError } = useNewsletterReviews();
  const reviews = Array.isArray(reviewsApiResponse.data?.reviews) ? reviewsApiResponse.data.reviews : [];

  const validateReviewForm = () => {
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
    } else if (reviewData.review.trim().length < 10) {
      newErrors.review = 'Review must be at least 10 characters';
    }

    setReviewErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewInputChange = (field: string, value: string) => {
    setReviewData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (reviewErrors[field]) {
      setReviewErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateReviewForm()) {
      toast({
        title: "Please fix the errors",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

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
      setReviewErrors({});
      setIsReviewOpen(false);

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
    }
  };

  return (
      <Layout>
        <SEOHead/>
        {/* Header */}
        <section
            className="hero-gradient bg-gradient-to-b from-primary via-primary-hover to-primary-dark text-primary-foreground py-20">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Mail className="h-20 w-20 mx-auto mb-4 opacity-95"/>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Join 10,000+ Money Makers
            </h1>
            <p className="text-lg sm:text-xl font-medium leading-relaxed mb-8 opacity-90">
              Get exclusive income strategies, market insights, and proven methods delivered to your inbox every week.
            </p>
            <div
                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-base font-medium opacity-90">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-400"/>
                <span>100% Free</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-300"/>
                <span>No Spam</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-300"/>
                <span>Weekly Updates</span>
              </div>
            </div>
          </div>
        </section>


        {/* Benefits Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What You'll Get</h2>
              <p className="text-xl text-muted-foreground">
                Exclusive content and strategies not available anywhere else
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-success"/>
                    Weekly Strategy Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Detailed analysis of one money-making strategy each week, with step-by-step implementation guides.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-success"/>
                    Income Opportunity Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Be the first to know about new platforms, programs, and opportunities as they emerge.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-success"/>
                    Community Success Stories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Real results from subscribers who've implemented our strategies, with exact numbers and methods.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-success"/>
                    Exclusive Tools & Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Free templates, calculators, and checklists to help you implement strategies faster.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-success"/>
                    Scam Alerts & Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Stay protected with our alerts about fraudulent schemes and too-good-to-be-true offers.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-success"/>
                    Market Trend Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Weekly insights on market changes that affect your income potential and investment decisions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Newsletter Signup Form */}
        <section className="py-16 bg-secondary/30">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  Start Your Financial Transformation Today
                </CardTitle>
                <p className="text-center text-muted-foreground">
                  Join thousands of subscribers who are already building their wealth
                </p>
              </CardHeader>
              <CardContent>
                <NewsletterSubscribeForm
                  className="gap-6"
                  submitLabel="Join the Community"
                  loadingLabel="Subscribing…"
                />
                <p className="text-xs text-muted-foreground text-center mt-4">
                  We respect your privacy. Unsubscribe at any time. No spam, just valuable content.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">
                What Our Subscribers Say
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/newsletter-reviews">View All Reviews</Link>
                </Button>
                <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2"/>
                      Add Review
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
                            onChange={(e) => handleReviewInputChange('name', e.target.value)}
                            placeholder="Enter your name"
                            required
                        />
                        {reviewErrors.name && <p className="text-red-500 text-sm mt-1">{reviewErrors.name}</p>}
                      </div>
                      <div>
                        <Label htmlFor="reviewEmail">Your Email</Label>
                        <Input
                            id="reviewEmail"
                            type="email"
                            value={reviewData.email}
                            onChange={(e) => handleReviewInputChange('email', e.target.value)}
                            placeholder="your@email.com"
                            required
                        />
                        {reviewErrors.email && <p className="text-red-500 text-sm mt-1">{reviewErrors.email}</p>}
                      </div>
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <div className="flex items-center space-x-1 mt-2">
                          {Array.from({length: 5}, (_, i) => (
                              <button
                                  key={i}
                                  type="button"
                                  onClick={() => setReviewData(prev => ({...prev, rating: i + 1}))}
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
                            onChange={(e) => handleReviewInputChange('review', e.target.value)}
                            placeholder="Share your experience with our newsletter..."
                            rows={4}
                            required
                        />
                        {reviewErrors.review && <p className="text-red-500 text-sm mt-1">{reviewErrors.review}</p>}
                      </div>
                      <Button type="submit" className="w-full">
                        Submit Review
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {isLoadingReviews ? (
                <div className="col-span-2 text-center py-8">Loading reviews...</div>
              ) : reviewsError ? (
                <div className="col-span-2 text-center py-8 text-destructive">Failed to load reviews.</div>
              ) : reviews.length === 0 ? (
                <div className="col-span-2 text-center py-8">No reviews yet.</div>
              ) : (
                reviews.slice(0, 2).map((review: any, idx: number) => (
                  <Card key={review.id || idx}>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {Array.from({length: 5}, (_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}/>
                        ))}
                      </div>
                      <blockquote className="text-muted-foreground italic mb-4">
                        "{review.review}"
                      </blockquote>
                      <cite className="font-semibold">— {review.name}</cite>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>
      </Layout>
  );
};

export default Newsletter;