import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import { 
  Target, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Shield, 
  AlertTriangle,
  Mail,
  ArrowRight
} from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <SEOHead />
      {/* Header */}
      <section className="bg-secondary/30 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">About How to Earning Money</h1>
          <p className="text-xl text-muted-foreground">
            Your trusted guide to practical income strategies and financial growth
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Our Mission */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <Target className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed mb-6">
                How to Earn Money is an independent finance blog created to help people discover practical ways to increase their income. 
                This isn't a company or agency—it's a personal resource built by someone passionate about financial education and sharing real strategies that work.
              </p>
              <p className="text-lg leading-relaxed">
                Every article is thoroughly researched and based on real experiences, market trends, and proven methods. 
                We believe in transparency and honesty—if something doesn't work, we'll tell you. If it does work, we'll show you exactly how to implement it.
              </p>
            </div>
          </div>

          {/* What You'll Find Here */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">What You'll Find Here:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="h-5 w-5 text-success mr-2" />
                    <h3 className="font-semibold">Step-by-step guides for starting online businesses</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Comprehensive tutorials that walk you through building profitable online ventures from scratch.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Users className="h-5 w-5 text-success mr-2" />
                    <h3 className="font-semibold">Freelancing tips and platform reviews</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Honest reviews of freelancing platforms and strategies to build a successful freelance career.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-5 w-5 text-success mr-2" />
                    <h3 className="font-semibold">Passive income strategies and case studies</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Real examples and detailed analysis of passive income methods that actually generate money.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="h-5 w-5 text-success mr-2" />
                    <h3 className="font-semibold">Investment advice for beginners</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Simple, actionable investment strategies designed for people just starting their wealth-building journey.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Target className="h-5 w-5 text-success mr-2" />
                    <h3 className="font-semibold">Side hustle ideas and success stories</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Proven side hustle opportunities with real success stories and income potential breakdowns.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Our Approach and Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Our Approach and Values:</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Practical Focus:</h3>
                  <p className="text-muted-foreground">
                    Every strategy is actionable and tested in real-world scenarios.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Shield className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Honest Reviews:</h3>
                  <p className="text-muted-foreground">
                    We provide unbiased reviews of platforms, tools, and opportunities.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <TrendingUp className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Proven Results:</h3>
                  <p className="text-muted-foreground">
                    All recommendations are based on actual results and performance data.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Users className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Community Focus:</h3>
                  <p className="text-muted-foreground">
                    We encourage reader interaction and share community success stories.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Disclaimer */}
          <Card className="border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Important Disclaimer</h3>
              </div>
              <div className="space-y-4 text-yellow-800 dark:text-yellow-200">
                <div>
                  <strong>Information Only:</strong> Only for informational use, not legal/financial advice.
                </div>
                <div>
                  <strong>No Guarantees:</strong> No guarantees of success—depends on effort, skill, and market.
                </div>
                <div>
                  <strong>Do Your Research:</strong> Always research/consult professionals before financial decisions.
                </div>
                <div>
                  <strong>Affiliate Links:</strong> Some links may be affiliate links (may earn commission at no extra cost to user for genuine recommendations).
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Financial Journey?</h3>
            <p className="text-lg text-muted-foreground mb-8">
              Have questions or want to share your success story? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Get in Touch
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/blog">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Start Reading
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;