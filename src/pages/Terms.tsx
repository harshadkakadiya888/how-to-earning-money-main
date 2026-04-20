import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, FileText, Shield, DollarSign, Mail, Scale, CheckCircle, Info } from 'lucide-react';

const Terms = () => {
  return (
    <Layout>
      <SEOHead />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 font-serif">Terms & Disclaimer</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Please read these terms carefully before using How to Earning Money. By accessing our site, you agree to be bound by these terms.
          </p>
          <div className="mt-6">
            <Badge variant="outline" className="text-sm">
              Effective Date: January 1, 2024
            </Badge>
          </div>
        </div>

        {/* Important Disclaimer Alert */}
        <Card className="mb-12 border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-5 w-5" />
              Important Legal Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Educational Content:</strong> All information is for educational purposes only, not financial advice.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>No Guarantees:</strong> Results may vary based on individual effort and market conditions.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Professional Advice:</strong> Consult qualified professionals for specific financial decisions.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Due Diligence:</strong> Always conduct your own research before making financial decisions.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Terms of Use */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Terms of Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">1. Acceptance of Terms</h4>
                  <p className="text-muted-foreground">
                    By accessing and using How to Earning Money ("the Site"), you accept and agree to be bound by the terms 
                    and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">2. Website Usage</h4>
                  <div className="space-y-2 text-muted-foreground">
                    <p>You may use our website for lawful purposes only. You agree not to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Use the site in any way that violates applicable laws or regulations</li>
                      <li>Attempt to gain unauthorized access to our systems</li>
                      <li>Interfere with or disrupt the site's functionality</li>
                      <li>Copy, reproduce, or distribute content without permission</li>
                      <li>Use automated tools to access or collect data from the site</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">3. Intellectual Property</h4>
                  <p className="text-muted-foreground">
                    All content on this website, including text, graphics, logos, images, and software, is the property of 
                    How to Earning Money and is protected by copyright and intellectual property laws. You may not reproduce, 
                    distribute, or create derivative works without express written permission.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">4. User-Generated Content</h4>
                  <p className="text-muted-foreground">
                    If you submit comments, reviews, or other content to our site, you grant us a non-exclusive, royalty-free 
                    license to use, modify, and distribute that content. You are responsible for ensuring your content does not 
                    violate any laws or third-party rights.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">5. Privacy and Data</h4>
                  <p className="text-muted-foreground">
                    Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and 
                    protect your information. By using our site, you consent to our data practices as described in our Privacy Policy.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Financial Disclaimer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-red-800 mb-2">Not Financial Advice</h5>
                      <p className="text-sm text-red-700">
                        The information provided on this website is for educational and informational purposes only. 
                        It should not be considered as professional financial, investment, or legal advice.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Income Claims and Results</h4>
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      <strong>No Guarantee of Results:</strong> Any income figures, earnings statements, or examples shown 
                      are estimates only and should not be considered as guarantees. Your results will vary and depend on 
                      many factors including but not limited to your background, experience, and work ethic.
                    </p>
                    <p>
                      <strong>Risk Disclaimer:</strong> All business endeavors and investments carry inherent risks of loss. 
                      You should not invest money that you cannot afford to lose. Past performance does not guarantee future results.
                    </p>
                    <p>
                      <strong>Individual Results:</strong> Success stories and testimonials are individual experiences and may 
                      not reflect typical results. Results may vary significantly between individuals.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Professional Consultation</h4>
                  <p className="text-muted-foreground">
                    Before making any financial decisions, we strongly recommend consulting with qualified financial advisors, 
                    accountants, or legal professionals who can provide personalized advice based on your specific situation.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Affiliate Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Affiliate Relationships & Monetization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-800 mb-2">Transparency Statement</h5>
                  <p className="text-sm text-blue-700">
                    We believe in full transparency about how we monetize this website and any potential conflicts of interest.
                  </p>
                </div>
                
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">Affiliate Links</h5>
                    <p>
                      Some links on this website are affiliate links, meaning we may earn a commission if you make a purchase 
                      through these links at no additional cost to you. We only recommend products and services we genuinely 
                      believe in and have researched thoroughly.
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">Sponsored Content</h5>
                    <p>
                      Occasionally, we may publish sponsored content or paid reviews. All sponsored content will be clearly 
                      marked as such. Sponsored relationships do not influence our honest opinions and recommendations.
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">Independence</h5>
                    <p>
                      Despite affiliate relationships, we maintain editorial independence. Our reviews and recommendations 
                      are based on thorough research and honest evaluation, not compensation received.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  To the fullest extent permitted by law, How to Earning Money shall not be liable for any direct, indirect, 
                  incidental, special, consequential, or punitive damages arising from your use of this website or any content therein.
                </p>
                
                <div className="space-y-2 text-muted-foreground">
                  <p>This includes but is not limited to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Financial losses from following advice or recommendations</li>
                    <li>Business losses or lost profits</li>
                    <li>Data loss or system downtime</li>
                    <li>Third-party actions or content</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Changes to These Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated 
                  effective date. Your continued use of the website after changes are posted constitutes acceptance of the modified terms.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/privacy">
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/cookies">
                    <FileText className="h-4 w-4 mr-2" />
                    Cookie Policy
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Legal Questions?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have questions about these terms, please contact us:
                </p>
                <Button asChild className="w-full">
                  <a href="mailto:howtoearningmoneyy@gmail.com">
                    Contact Us
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                    <span>Educational content only</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                    <span>No guaranteed results</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                    <span>Transparent affiliate disclosure</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                    <span>Consult professionals</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;