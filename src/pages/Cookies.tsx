import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Cookie, Settings, Shield, Eye, Target, BarChart, CheckCircle } from 'lucide-react';

const Cookies = () => {
  const { hasConsent, acceptCookies, declineCookies } = useCookieConsent();

  return (
    <Layout>
      <SEOHead />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Cookie className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 font-serif">Cookie Policy</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We believe in transparency. Here's everything you need to know about how we use cookies on How to Earning Money.
          </p>
          <div className="mt-6">
            <Badge variant={hasConsent ? "default" : "secondary"} className="text-sm">
              Cookie Status: {hasConsent ? "Accepted" : hasConsent === false ? "Declined" : "Not Set"}
            </Badge>
          </div>
        </div>

        {/* Cookie Management Card */}
        {hasConsent !== null && (
          <Card className="mb-12 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <p className="text-muted-foreground">
                    You can change your cookie preferences at any time. Current status: 
                    <span className="font-semibold ml-1">
                      {hasConsent ? "Cookies Accepted" : "Cookies Declined"}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={declineCookies}>
                    Decline All
                  </Button>
                  <Button onClick={acceptCookies}>
                    Accept All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What Are Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5" />
                  What Are Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Cookies are small text files that are stored on your computer or mobile device when you visit our website. 
                  They help us provide you with a better browsing experience by remembering your preferences and analyzing 
                  how you use our site.
                </p>
                <p>
                  Cookies cannot damage your device or files. They cannot access other files on your computer or carry 
                  viruses. Most websites use cookies to enhance user experience and functionality.
                </p>
              </CardContent>
            </Card>

            {/* Types of Cookies */}
            <Card>
              <CardHeader>
                <CardTitle>Types of Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Essential Cookies */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-success">Essential Cookies (Required)</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          These cookies are necessary for the website to function properly. They enable core functionality 
                          such as security, network management, and accessibility.
                        </p>
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">Always Active</Badge>
                        </div>
                        <ul className="mt-3 text-sm space-y-1">
                          <li>• Cookie consent preferences</li>
                          <li>• Session management</li>
                          <li>• Security and authentication</li>
                          <li>• Load balancing</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <BarChart className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-primary">Analytics Cookies (Optional)</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          These cookies help us understand how visitors interact with our website by collecting and 
                          reporting information anonymously.
                        </p>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">Your Choice</Badge>
                        </div>
                        <ul className="mt-3 text-sm space-y-1">
                          <li>• Page views and visitor counts</li>
                          <li>• Time spent on pages</li>
                          <li>• Popular content identification</li>
                          <li>• User journey analysis</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Preference Cookies */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Settings className="h-5 w-5 text-accent-blue mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-accent-blue">Preference Cookies (Optional)</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          These cookies remember your preferences and choices to provide a personalized experience.
                        </p>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">Your Choice</Badge>
                        </div>
                        <ul className="mt-3 text-sm space-y-1">
                          <li>• Language preferences</li>
                          <li>• Font size and display options</li>
                          <li>• Newsletter subscription status</li>
                          <li>• Content customization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Third-Party Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We may use third-party services that set their own cookies. These services help us provide 
                  better content and functionality:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-semibold text-sm">Google Analytics</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Website traffic and user behavior analysis
                    </p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-semibold text-sm">Font Providers</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Loading custom fonts for better typography
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Managing Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Managing Your Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  You have full control over cookies. Here are your options:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-sm">Browser Settings</h5>
                      <p className="text-sm text-muted-foreground">
                        Most browsers allow you to control cookies through their settings. You can block or delete cookies entirely.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-sm">Our Cookie Banner</h5>
                      <p className="text-sm text-muted-foreground">
                        Use our cookie consent banner to accept or decline optional cookies when you first visit.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-sm">This Page</h5>
                      <p className="text-sm text-muted-foreground">
                        Use the cookie preferences card at the top of this page to change your settings anytime.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 mt-4">
                  <p className="text-sm">
                    <strong>Note:</strong> Disabling essential cookies may affect website functionality. 
                    Some features may not work properly without them.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={acceptCookies}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept All Cookies
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={declineCookies}>
                  <Shield className="h-4 w-4 mr-2" />
                  Essential Only
                </Button>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have questions about our cookie policy, please contact us:
                </p>
                <Button asChild className="w-full">
                  <a href="mailto:howtoearningmoneyy@gmail.com">
                    Contact Us
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Last Updated */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Last updated: January 2024
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We may update this policy from time to time
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cookies;