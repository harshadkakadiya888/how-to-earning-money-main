import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import BlogCard from '@/components/blog/BlogCard';
import NewsletterModal from '@/components/ui/newsletter-modal';
import SuccessStoriesSlider from '../components/SuccessStoriesSlider';
import type { SuccessStory } from '../lib/api';
import {
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  Star,
  Search,
  ArrowRight,
  Target,
  Award,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useBlogPosts, useCategories, useSuccessStories } from '@/hooks/useApi';
import {useState} from "react";

const Index = () => {
  const { data: apiResponse = {} as { data?: { blogs?: any[] } }, isLoading } = useBlogPosts();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  // Ensure blogPosts and categories are always arrays
  const posts = Array.isArray(apiResponse.data?.blogs) ? apiResponse.data.blogs : [];
  const categoriesList = Array.isArray(categories) ? categories : [];
  const featuredPosts = posts.filter(post => post.featured).slice(0, 2);
  const latestPosts = posts.slice(0, 6);

  // Fetch success stories
  const { data: successStoriesData = {} as { data?: { successStories?: SuccessStory[] } } } = useSuccessStories({ limit: 6 });
  const stories = Array.isArray(successStoriesData.data?.successStories) ? successStoriesData.data.successStories : [];
  const [showAllCategories, setShowAllCategories] = useState(false);

// Calculate which categories to display
  const displayedCategories = showAllCategories
      ? categoriesList
      : categoriesList.slice(0, 6);

  return (
    <Layout>
      <SEOHead />
      {/* Hero Section */}
      <section id="hero" className="hero-gradient relative py-24 lg:py-32 overflow-hidden">
        {/* Background using your gradient system */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary-hover to-primary-dark"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:24px_24px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground mb-8 tracking-tight">
              Master the Art of
              <span className="block text-accent-blue mt-2">Earning Money</span>
            </h1>

            <p className="text-xl text-primary-foreground/90 mb-6 max-w-3xl mx-auto leading-relaxed font-body">
              Proven strategies, honest reviews, and step-by-step guides to increase your income.
            </p>

            <p className="text-accent-blue font-semibold mb-12 font-heading">
              No scams, just real results from someone passionate about financial education.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link to={"/blog"} className="bg-accent-blue text-white font-heading font-semibold px-8 py-3 rounded-md hover:opacity-90 transition-all duration-200 shadow-medium">
                Explore Guides →
              </Link>
              <Link to={"/newsletter"} className="border border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground font-heading font-semibold px-8 py-3 rounded-md hover:bg-primary-foreground/20 hover:border-primary-foreground/50 transition-all duration-200">
                join Free Newsletter →
              </Link>
            </div>

            {/* Commented out stats boxes - uncomment when you have real numbers
      <div className="mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-card/5 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:border-accent-blue/50 hover:bg-card/10 transition-all duration-300 h-32 flex flex-col justify-center shadow-soft">
              <div className="text-3xl font-bold text-primary-foreground mb-2 group-hover:text-accent-blue transition-colors duration-300">100+</div>
              <h3 className="text-base font-heading font-semibold text-primary-foreground/90 mb-1">Detailed Guides</h3>
            </div>
            <div className="group bg-card/5 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:border-accent-blue/50 hover:bg-card/10 transition-all duration-300 h-32 flex flex-col justify-center shadow-soft">
                <div className="text-3xl font-bold text-primary-foreground mb-2 group-hover:text-accent-blue transition-colors duration-300">0</div>
                <h3 className="text-base font-heading font-semibold text-primary-foreground/90 mb-1">Scams Promise</h3>
            </div>
            <div className="group bg-card/5 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:border-accent-blue/50 hover:bg-card/10 transition-all duration-300 h-32 flex flex-col justify-center shadow-soft">
                <div className="text-3xl font-bold text-primary-foreground mb-2 group-hover:text-accent-blue transition-colors duration-300">100%</div>
                <h3 className="text-base font-heading font-semibold text-primary-foreground/90 mb-1">Honest Reviews</h3>
            </div>
            <div className="group bg-card/5 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:border-accent-blue/50 hover:bg-card/10 transition-all duration-300 h-32 flex flex-col justify-center shadow-soft">
                <div className="text-3xl font-bold text-primary-foreground mb-2 group-hover:text-accent-blue transition-colors duration-300">2K+</div>
                <h3 className="text-base font-heading font-semibold text-primary-foreground/90 mb-1">Newsletter Subscribers</h3>
            </div>
          </div>
        </div>
      </div>
      */}

            {/* Feature Highlights Section */}
            <div className="mt-16">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Feature 1 - Comprehensive Guides */}
                  <div className="group bg-card/5 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:border-accent-blue/50 hover:bg-card/10 transition-all duration-300 shadow-soft">
                    <div className="w-12 h-12 bg-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-blue/30 transition-colors duration-300">
                      <svg className="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-primary-foreground mb-2">Step-by-Step Guides</h3>
                    <p className="text-sm text-primary-foreground/70 font-body">Detailed tutorials that walk you through every money-making strategy</p>
                  </div>

                  {/* Feature 2 - No Scam Promise */}
                  <div className="group bg-card/5 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:border-accent-blue/50 hover:bg-card/10 transition-all duration-300 shadow-soft">
                    <div className="w-12 h-12 bg-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-blue/30 transition-colors duration-300">
                      <svg className="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-primary-foreground mb-2">Scam-Free Zone</h3>
                    <p className="text-sm text-primary-foreground/70 font-body">No get-rich-quick schemes - just proven methods that deliver real results</p>
                  </div>

                  {/* Feature 3 - Honest Reviews */}
                  <div className="group bg-card/5 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:border-accent-blue/50 hover:bg-card/10 transition-all duration-300 shadow-soft">
                    <div className="w-12 h-12 bg-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-blue/30 transition-colors duration-300">
                      <svg className="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-primary-foreground mb-2">Honest Reviews</h3>
                    <p className="text-sm text-primary-foreground/70 font-body">Transparent reviews with real pros and cons</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* Categories Section */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Explore Money‑Making Categories</h2>
            <p className="text-muted-foreground">
              Pick a lane that fits your skills and time—then dive into curated guides.
            </p>
          </div>

          {isLoadingCategories ? (
              // Skeletons that mimic the final image layout
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="relative overflow-hidden rounded-xl bg-muted/60 animate-pulse h-56">
                      <div className="absolute inset-0 bg-gradient-to-t from-muted to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="h-6 w-2/3 bg-muted rounded mb-3" />
                        <div className="h-4 w-24 bg-muted rounded" />
                      </div>
                    </div>
                ))}
              </div>
          ) : (
              <>
                {/* Image-first, interactive cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoriesList.slice(0, 6).map((category) => (
                      <Link
                          key={category.slug}
                          to={`/blog?category=${category._id}`}
                          className="group relative block overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {/* Background image */}
                        <div className="relative h-56 w-full">
                          <img
                              src={category.image}
                              alt={category.name}
                              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                              loading="lazy"
                          />
                          {/* Gradient overlays for legibility + depth */}
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-90" />
                          <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>

                        {/* Content layer */}
                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-white text-lg font-semibold tracking-tight">
                              {category.name}
                            </h3>

                          </div>

                          {/* Hover CTA row */}
                          <div className="mt-2 flex items-center text-white/80 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                            <span className="text-sm">Explore</span>
                            <svg
                                className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>

                        {/* Subtle 3D hover lift */}
                        <div className="absolute inset-0 rounded-xl ring-1 ring-black/0 group-hover:ring-black/5 transition" />
                      </Link>
                  ))}
                </div>

                {/* View All */}
                {categoriesList.length > 6 && (
                    <div className="text-center mt-10">
                      <Button asChild size="lg" className="px-8">
                        <Link to="/categories">
                          View All Categories
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                )}
              </>
          )}
        </div>
      </section>


      {/* Featured Articles */}
      {/*<section className="py-20">*/}
      {/*  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">*/}
      {/*    <div className="flex items-center justify-between mb-12">*/}
      {/*      <div>*/}
      {/*        <h2 className="text-3xl font-bold mb-2">Featured Articles</h2>*/}
      {/*        <p className="text-muted-foreground">Must-read guides that deliver real results</p>*/}
      {/*      </div>*/}
      {/*      <Button variant="outline" asChild>*/}
      {/*        <Link to="/blog">View All Articles</Link>*/}
      {/*      </Button>*/}
      {/*    </div>*/}

      {/*    {isLoading ? (*/}
      {/*      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">*/}
      {/*        {[1, 2].map((i) => (*/}
      {/*          <Card key={i} className="animate-pulse">*/}
      {/*            <div className="h-48 bg-muted rounded-t-lg"></div>*/}
      {/*            <CardContent className="p-6">*/}
      {/*              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>*/}
      {/*              <div className="h-4 bg-muted rounded w-full mb-2"></div>*/}
      {/*              <div className="h-4 bg-muted rounded w-2/3"></div>*/}
      {/*            </CardContent>*/}
      {/*          </Card>*/}
      {/*        ))}*/}
      {/*      </div>*/}
      {/*    ) : (*/}
      {/*      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">*/}
      {/*        {featuredPosts.map((post) => (*/}
      {/*          <BlogCard key={post._id} post={post} variant="featured" />*/}
      {/*        ))}*/}
      {/*      </div>*/}
      {/*    )}*/}
      {/*  </div>*/}
      {/*</section>*/}

      {/* Latest Articles */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Latest Money-Making Strategies</h2>
            <p className="text-xl text-muted-foreground">
              Fresh insights and proven methods to boost your income
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/blog">
                View All Articles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <SuccessStoriesSlider />

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of readers who get actionable money-making strategies delivered to their inbox every week.
          </p>
          <NewsletterModal
            trigger={
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Get Free Weekly Tips
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            }
          />
        </div>
      </section>
    </Layout>
  );
};

export default Index;
