import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useSuccessStories, useSubmitSuccessStory } from '@/hooks/useApi';
import { Link } from 'react-router-dom';
import {
  Star,
  Quote,
  DollarSign,
  TrendingUp,
  Plus,
  User,
  MessageCircle,
  Target,
  X,
  Send,
  MoreHorizontal,
  Eye,
  Clock
} from 'lucide-react';

const SuccessStoriesSlider = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    monthlyIncomeBefore: 0,
    monthlyIncomeNow: 0,
    timeToTransform: '',
    primaryStrategyUsed: '',
    journey: '',
    publishPermission: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  // Fetch success stories from API
  const { data: successStoriesData, isLoading } = useSuccessStories({ limit: 6 });
  const submitStoryMutation = useSubmitSuccessStory();

  const successStories = successStoriesData?.data.successStories || [];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Monthly Income Now validation
    if (!formData.monthlyIncomeNow || formData.monthlyIncomeNow <= 0) {
      newErrors.monthlyIncomeNow = 'Current monthly income is required';
    }

    // Time to Transform validation
    if (!formData.timeToTransform) {
      newErrors.timeToTransform = 'Please select a timeframe';
    }

    // Primary Strategy validation
    if (!formData.primaryStrategyUsed) {
      newErrors.primaryStrategyUsed = 'Please select your primary strategy';
    }

    // Journey validation
    if (!formData.journey.trim()) {
      newErrors.journey = 'Your success story is required';
    } else if (formData.journey.trim().length < 50) {
      newErrors.journey = 'Please provide more details (at least 50 characters)';
    }

    // Permission validation
    if (!formData.publishPermission) {
      newErrors.publishPermission = 'You must give permission to publish your story';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      await submitStoryMutation.mutateAsync(formData);

      toast({
        title: "Success story submitted!",
        description: "Thank you for sharing your journey. We'll review and may contact you for clarification.",
      });

      setFormData({
        fullName: '',
        email: '',
        monthlyIncomeBefore: 0,
        monthlyIncomeNow: 0,
        timeToTransform: '',
        primaryStrategyUsed: '',
        journey: '',
        publishPermission: false
      });
      setErrors({});

      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: "Failed to submit story",
        description: "There was a problem submitting your story. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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

  return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 font-heading">Real Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 font-body">
              See how our guides have helped real people transform their financial lives.
              These are genuine testimonials from our community members.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                  onClick={() => setIsFormOpen(true)}
                  className="font-heading"
              >
                <Plus className="mr-2 h-4 w-4" />
                Share Your Story
              </Button>

              <Button
                  variant="outline"
                  className="font-heading"
                  asChild
              >
                <Link to="/success-stories">
                  <Eye className="mr-2 h-4 w-4" />
                  View All Stories
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
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
            ) : successStories.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold mb-2">No stories yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to share your success story and inspire others!
                  </p>
                </div>
            ) : (
                <>
                  {/* Show centered cards for less than 3 stories (desktop only) */}
                  <div className="hidden md:block">
                    {successStories.length < 3 ? (
                        <div className={`grid gap-8 justify-center ${
                            successStories.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                                successStories.length === 2 ? 'grid-cols-2 max-w-4xl mx-auto' : ''
                        }`}>
                          {successStories.map((story) => (
                              <Card key={story._id} className="h-full hover:shadow-lg transition-shadow duration-300 border border-border">
                                <CardContent className="p-6">
                                  {/* Header with avatar and basic info */}
                                  <div className="flex items-start space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-semibold text-sm font-heading">
                                {getInitials(story.fullName)}
                              </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold text-foreground font-heading">{story.fullName}</h3>
                                      <p className="text-sm text-muted-foreground font-body">
                                        {new Date(story.createdAt).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric'
                                        })}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Income and method badges */}
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="default" className="text-xs font-body">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      {formatCurrency(story.monthlyIncomeNow)}/month
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs font-body">
                                      <Target className="h-3 w-3 mr-1" />
                                      {getStrategyCategory(story.primaryStrategyUsed)}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs font-body">
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
                                {story.monthlyIncomeBefore > 0 ? Math.round((story.monthlyIncomeNow - story.monthlyIncomeBefore) / story.monthlyIncomeBefore * 100) : 0}%
                              </span>
                                    </div>
                                  </div>

                                  {/* Story content */}
                                  <div className="relative mb-4">
                                    <Quote className="absolute -top-1 -left-1 h-4 w-4 text-primary/40" />
                                    <p className="text-sm leading-relaxed text-muted-foreground pl-4 font-body line-clamp-4">
                                      {story.journey}
                                    </p>
                                  </div>

                                  {/* Strategy used */}
                                  <div className="text-xs text-muted-foreground font-body">
                                    <strong>Strategy:</strong> {story.primaryStrategyUsed}
                                  </div>
                                </CardContent>
                              </Card>
                          ))}
                        </div>
                    ) : (
                        <Carousel
                            opts={{
                              align: "start",
                              loop: true,
                            }}
                            className="w-full"
                        >
                          <CarouselContent className="-ml-1">
                            {successStories.map((story) => (
                                <CarouselItem key={story._id} className="pl-1 md:basis-1/2 lg:basis-1/3">
                                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 border border-border">
                                    <CardContent className="p-6">
                                      {/* Header with avatar and basic info */}
                                      <div className="flex items-start space-x-3 mb-4">
                                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white font-semibold text-sm font-heading">
                                    {getInitials(story.fullName)}
                                  </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h3 className="font-semibold text-foreground font-heading">{story.fullName}</h3>
                                          <p className="text-sm text-muted-foreground font-body">
                                            {new Date(story.createdAt).toLocaleDateString('en-US', {
                                              month: 'short',
                                              day: 'numeric',
                                              year: 'numeric'
                                            })}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Income and method badges */}
                                      <div className="flex flex-wrap gap-2 mb-4">
                                        <Badge variant="default" className="text-xs font-body">
                                          <DollarSign className="h-3 w-3 mr-1" />
                                          {formatCurrency(story.monthlyIncomeNow)}/month
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs font-body">
                                          <Target className="h-3 w-3 mr-1" />
                                          {getStrategyCategory(story.primaryStrategyUsed)}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs font-body">
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
                                    {story.monthlyIncomeBefore > 0 ? Math.round((story.monthlyIncomeNow - story.monthlyIncomeBefore) / story.monthlyIncomeBefore * 100) : 0}%
                                  </span>
                                        </div>
                                      </div>

                                      {/* Story content */}
                                      <div className="relative mb-4">
                                        <Quote className="absolute -top-1 -left-1 h-4 w-4 text-primary/40" />
                                        <p className="text-sm leading-relaxed text-muted-foreground pl-4 font-body line-clamp-4">
                                          {story.journey}
                                        </p>
                                      </div>

                                      {/* Strategy used */}
                                      <div className="text-xs text-muted-foreground font-body">
                                        <strong>Strategy:</strong> {story.primaryStrategyUsed}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="absolute -left-12 top-1/2 transform -translate-y-1/2" />
                          <CarouselNext className="absolute -right-12 top-1/2 transform -translate-y-1/2" />
                        </Carousel>
                    )}
                  </div>

                  {/* Always show slider on mobile */}
                  <div className="block md:hidden">
                    <Carousel
                        opts={{
                          align: "start",
                          loop: true,
                        }}
                        className="w-full"
                    >
                      <CarouselContent className="-ml-1">
                        {successStories.map((story) => (
                            <CarouselItem key={story._id} className="pl-1 basis-full">
                              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border border-border">
                                <CardContent className="p-6">
                                  {/* Your existing card content exactly as it was */}
                                  <div className="flex items-start space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-sm font-heading">
                                  {getInitials(story.fullName)}
                                </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold text-foreground font-heading">{story.fullName}</h3>
                                      <p className="text-sm text-muted-foreground font-body">
                                        {new Date(story.createdAt).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric'
                                        })}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="default" className="text-xs font-body">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      {formatCurrency(story.monthlyIncomeNow)}/month
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs font-body">
                                      <Target className="h-3 w-3 mr-1" />
                                      {getStrategyCategory(story.primaryStrategyUsed)}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs font-body">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {story.timeToTransform}
                                    </Badge>
                                  </div>

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
                                  {story.monthlyIncomeBefore > 0 ? Math.round((story.monthlyIncomeNow - story.monthlyIncomeBefore) / story.monthlyIncomeBefore * 100) : 0}%
                                </span>
                                    </div>
                                  </div>

                                  <div className="relative mb-4">
                                    <Quote className="absolute -top-1 -left-1 h-4 w-4 text-primary/40" />
                                    <p className="text-sm leading-relaxed text-muted-foreground pl-4 font-body line-clamp-4">
                                      {story.journey}
                                    </p>
                                  </div>

                                  <div className="text-xs text-muted-foreground font-body">
                                    <strong>Strategy:</strong> {story.primaryStrategyUsed}
                                  </div>
                                </CardContent>
                              </Card>
                            </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="absolute -left-8 top-1/2 transform -translate-y-1/2" />
                      <CarouselNext className="absolute -right-8 top-1/2 transform -translate-y-1/2" />
                    </Carousel>
                  </div>
                </>
            )}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4 font-body">
              Join thousands of success stories. Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="font-heading" asChild>
                <Link to="/success-stories">
                  <Eye className="mr-2 h-4 w-4" />
                  View All Stories
                </Link>
              </Button>
              <Button className="font-heading" asChild>
                <Link to="/blog">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Explore Our Guides
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Success Story Form Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-white">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold mb-3 text-gray-900">Share Your Success Story</DialogTitle>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Help inspire others by sharing your income transformation journey. Your story could motivate someone to start their own path to financial freedom!
                  </p>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-8 pt-4">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <User className="h-5 w-5" style={{ color: '#113155' }} />
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="Your full name"
                          required
                          className="pr-10 border-gray-300 focus:border-[#113155] focus:ring-[#113155]/20 rounded-md"
                      />
                      {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
                      <MoreHorizontal className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="border-gray-300 focus:border-[#113155] focus:ring-[#113155]/20 rounded-md"
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Income Transformation Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="h-5 w-5" style={{ color: '#113155' }} />
                  <h3 className="text-lg font-semibold text-gray-900">Income Transformation</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncomeBefore" className="text-sm font-medium text-gray-700">
                      Monthly Income Before
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                          id="monthlyIncomeBefore"
                          type="number"
                          value={formData.monthlyIncomeBefore}
                          onChange={(e) => handleInputChange('monthlyIncomeBefore', parseInt(e.target.value) || 0)}
                          className="pl-8 border-gray-300 focus:border-[#113155] focus:ring-[#113155]/20 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncomeNow" className="text-sm font-medium text-gray-700">
                      Monthly Income Now *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                          id="monthlyIncomeNow"
                          type="number"
                          value={formData.monthlyIncomeNow}
                          onChange={(e) => handleInputChange('monthlyIncomeNow', parseInt(e.target.value) || 0)}
                          className="pl-8 border-gray-300 focus:border-[#113155] focus:ring-[#113155]/20 rounded-md"
                          required
                      />
                      {errors.monthlyIncomeNow && <p className="text-sm text-red-500 mt-1">{errors.monthlyIncomeNow}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeToTransform" className="text-sm font-medium text-gray-700">
                    Time to Transform *
                  </Label>
                  <Select value={formData.timeToTransform} onValueChange={(value) => handleInputChange('timeToTransform', value)}>
                    <SelectTrigger className="border-gray-300 focus:border-[#113155] focus:ring-[#113155]/20 rounded-md">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3 months">3 months</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="12 months">12 months</SelectItem>
                      <SelectItem value="18 months">18 months</SelectItem>
                      <SelectItem value="24 months">24 months</SelectItem>
                      <SelectItem value="3+ years">3+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.timeToTransform && <p className="text-sm text-red-500 mt-1">{errors.timeToTransform}</p>}
                </div>
              </div>

              {/* Strategy & Method Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="h-5 w-5" style={{ color: '#113155' }} />
                  <h3 className="text-lg font-semibold text-gray-900">Strategy & Method</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryStrategyUsed" className="text-sm font-medium text-gray-700">
                    Primary Strategy Used *
                  </Label>
                  <Select value={formData.primaryStrategyUsed} onValueChange={(value) => handleInputChange('primaryStrategyUsed', value)}>
                    <SelectTrigger className="border-gray-300 focus:border-[#113155] focus:ring-[#113155]/20 rounded-md">
                      <SelectValue placeholder="Select your main strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Freelancing on Upwork">Freelancing on Upwork</SelectItem>
                      <SelectItem value="Freelancing on Fiverr">Freelancing on Fiverr</SelectItem>
                      <SelectItem value="Blogging & Content Creation">Blogging & Content Creation</SelectItem>
                      <SelectItem value="Digital Products">Digital Products</SelectItem>
                      <SelectItem value="Affiliate Marketing">Affiliate Marketing</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="Dropshipping">Dropshipping</SelectItem>
                      <SelectItem value="Investing">Investing</SelectItem>
                      <SelectItem value="Consulting">Consulting</SelectItem>
                      <SelectItem value="Online Courses">Online Courses</SelectItem>
                      <SelectItem value="Online Tutoring">Online Tutoring</SelectItem>
                      <SelectItem value="Virtual Assistant">Virtual Assistant</SelectItem>
                      <SelectItem value="Social Media Management">Social Media Management</SelectItem>
                      <SelectItem value="YouTube Content Creation">YouTube Content Creation</SelectItem>
                      <SelectItem value="Podcasting">Podcasting</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.primaryStrategyUsed && <p className="text-sm text-red-500 mt-1">{errors.primaryStrategyUsed}</p>}
                </div>
              </div>

              {/* Your Success Story Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <MessageCircle className="h-5 w-5" style={{ color: '#113155' }} />
                  <h3 className="text-lg font-semibold text-gray-900">Your Success Story</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="journey" className="text-sm font-medium text-gray-700">
                    Tell us your journey *
                  </Label>
                  <Textarea
                      id="journey"
                      value={formData.journey}
                      onChange={(e) => handleInputChange('journey', e.target.value)}
                      placeholder="Share your journey in detail: What challenges did you face? Which specific guides or strategies helped you? What advice would you give to someone starting out? Be specific about your results and timeline..."
                      rows={6}
                      required
                      className="resize-none border-gray-300 focus:border-[#113155] focus:ring-[#113155]/20 rounded-md"
                  />
                  {errors.journey && <p className="text-sm text-red-500 mt-1">{errors.journey}</p>}
                  <p className="text-sm text-gray-500 mt-2">
                    Include: challenges faced, specific strategies used, timeline, key learnings, and advice for others
                  </p>
                </div>
              </div>

              {/* Permissions and Privacy */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                      id="publishPermission"
                      checked={formData.publishPermission}
                      onCheckedChange={(checked) => handleInputChange('publishPermission', checked)}
                      className="mt-1"
                  />
                  <div className="space-y-2">
                    <Label htmlFor="publishPermission" className="text-sm font-medium text-gray-700">
                      I give permission to publish my story on the website to inspire others
                    </Label>
                    <p className="text-sm text-gray-500">
                      Your email address will never be shared publicly. We may contact you for clarification or follow-up questions.
                    </p>
                  </div>
                </div>
                {errors.publishPermission && <p className="text-sm text-red-500 mt-1">{errors.publishPermission}</p>}
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    disabled={submitStoryMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex-1 flex items-center gap-2 text-white"
                    style={{ backgroundColor: '#113155' }}
                    disabled={submitStoryMutation.isPending}
                >
                  {submitStoryMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                  ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Share My Story
                      </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </section>
  );
};

export default SuccessStoriesSlider;
