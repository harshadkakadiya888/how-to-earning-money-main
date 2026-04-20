import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye, Users, Mail, Database, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const Privacy = () => {
  return (
    <Layout>
      <SEOHead />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 font-serif">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <div className="mt-6">
            <Badge variant="outline" className="text-sm">
              Last Updated: January 1, 2024
            </Badge>
          </div>
        </div>

        {/* Privacy Summary */}
        <Card className="mb-12 border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Privacy at a Glance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <Lock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <strong>Minimal Data Collection</strong>
                <p className="text-green-700 mt-1">We only collect what's necessary to provide our services.</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <strong>No Sale of Data</strong>
                <p className="text-green-700 mt-1">We never sell your personal information to third parties.</p>
              </div>
              <div className="text-center">
                <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <strong>Full Transparency</strong>
                <p className="text-green-700 mt-1">Clear information about what we collect and why.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-primary">Information You Provide to Us</h4>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary/20 pl-4">
                      <h5 className="font-medium mb-1">Newsletter Subscriptions</h5>
                      <p className="text-sm text-muted-foreground">
                        When you subscribe to our newsletter, we collect your email address and optionally your name.
                      </p>
                    </div>
                    <div className="border-l-4 border-primary/20 pl-4">
                      <h5 className="font-medium mb-1">Contact Forms</h5>
                      <p className="text-sm text-muted-foreground">
                        When you contact us, we collect your name, email address, and any information you choose to provide in your message.
                      </p>
                    </div>
                    <div className="border-l-4 border-primary/20 pl-4">
                      <h5 className="font-medium mb-1">Comments and Reviews</h5>
                      <p className="text-sm text-muted-foreground">
                        If you submit comments, reviews, or success stories, we collect the content you provide and any associated contact information.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-primary">Information Automatically Collected</h4>
                  <div className="space-y-4">
                    <div className="border-l-4 border-accent-blue/20 pl-4">
                      <h5 className="font-medium mb-1">Website Analytics</h5>
                      <p className="text-sm text-muted-foreground">
                        We use analytics tools to understand how visitors use our website, including pages visited, time spent, and general location (country/city).
                      </p>
                    </div>
                    <div className="border-l-4 border-accent-blue/20 pl-4">
                      <h5 className="font-medium mb-1">Technical Information</h5>
                      <p className="text-sm text-muted-foreground">
                        Browser type, device information, IP address, and referring website for security and optimization purposes.
                      </p>
                    </div>
                    <div className="border-l-4 border-accent-blue/20 pl-4">
                      <h5 className="font-medium mb-1">Cookies and Tracking</h5>
                      <p className="text-sm text-muted-foreground">
                        We use cookies to improve your experience and remember your preferences. See our Cookie Policy for details.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold mb-3 text-success">Primary Uses</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                        <span>Send newsletter updates and valuable content</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                        <span>Respond to your inquiries and support requests</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                        <span>Improve our website content and user experience</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                        <span>Analyze website performance and visitor behavior</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-3 text-primary">Security & Legal</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-primary mt-0.5" />
                        <span>Protect against spam and abuse</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-primary mt-0.5" />
                        <span>Comply with legal obligations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-primary mt-0.5" />
                        <span>Maintain website security and integrity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-primary mt-0.5" />
                        <span>Investigate and prevent fraudulent activity</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Information Sharing and Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-red-800 mb-2">We Do NOT Sell Your Data</h5>
                      <p className="text-sm text-red-700">
                        We do not sell, trade, or otherwise transfer your personal information to third parties for marketing purposes.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Limited Sharing Scenarios</h4>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-2">Service Providers</h5>
                      <p className="text-sm text-muted-foreground">
                        We may share information with trusted service providers who help us operate our website (email services, analytics, hosting). 
                        These providers are contractually bound to protect your information.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-2">Legal Requirements</h5>
                      <p className="text-sm text-muted-foreground">
                        We may disclose information if required by law, court order, or to protect our rights and safety.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium mb-2">Business Transfers</h5>
                      <p className="text-sm text-muted-foreground">
                        In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the transaction.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Data Security and Retention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Security Measures</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-sm mb-1">Encryption</h5>
                      <p className="text-xs text-muted-foreground">All data transmission is encrypted using SSL/TLS</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-sm mb-1">Access Controls</h5>
                      <p className="text-xs text-muted-foreground">Limited access to personal data on a need-to-know basis</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-sm mb-1">Regular Monitoring</h5>
                      <p className="text-xs text-muted-foreground">Continuous monitoring for security threats and vulnerabilities</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-sm mb-1">Data Minimization</h5>
                      <p className="text-xs text-muted-foreground">We collect and retain only necessary information</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Data Retention</h4>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      <strong>Newsletter Data:</strong> Retained until you unsubscribe or request deletion
                    </p>
                    <p>
                      <strong>Contact Inquiries:</strong> Retained for 2 years for customer service purposes
                    </p>
                    <p>
                      <strong>Analytics Data:</strong> Anonymized and retained for up to 26 months
                    </p>
                    <p>
                      <strong>Comments/Reviews:</strong> Retained indefinitely unless you request removal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Your Privacy Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-sm">Access Your Data</h5>
                        <p className="text-xs text-muted-foreground">Request a copy of your personal information</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-sm">Correct Information</h5>
                        <p className="text-xs text-muted-foreground">Update or correct inaccurate data</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-sm">Delete Your Data</h5>
                        <p className="text-xs text-muted-foreground">Request removal of your personal information</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-sm">Unsubscribe</h5>
                        <p className="text-xs text-muted-foreground">Opt out of marketing communications anytime</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-sm">Data Portability</h5>
                        <p className="text-xs text-muted-foreground">Receive your data in a portable format</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-sm">Object to Processing</h5>
                        <p className="text-xs text-muted-foreground">Object to certain types of data processing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Services */}
            <Card>
              <CardHeader>
                <CardTitle>Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Our website may use third-party services that have their own privacy policies:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-semibold text-sm">Google Analytics</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Website analytics and user behavior tracking
                    </p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-semibold text-sm">Email Service Providers</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Newsletter delivery and email communication
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  We encourage you to review the privacy policies of any third-party services you interact with through our site.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Privacy Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/cookies">
                    <FileText className="h-4 w-4 mr-2" />
                    Cookie Settings
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="mailto:howtoearningmoneyy@gmail.com?subject=Data Request">
                    <Database className="h-4 w-4 mr-2" />
                    Request My Data
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="mailto:howtoearningmoneyy@gmail.com?subject=Delete My Data">
                    <Lock className="h-4 w-4 mr-2" />
                    Delete My Data
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Privacy Questions?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have questions about this privacy policy or your data:
                </p>
                <Button asChild className="w-full">
                  <a href="mailto:howtoearningmoneyy@gmail.com">
                    Contact Us
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Policy Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  We may update this privacy policy from time to time. We'll notify you of significant changes.
                </p>
                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    Version 1.0 - January 2024
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;