import { Button } from './button';
import { Card, CardContent } from './card';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Cookie, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
  const { showBanner, acceptCookies, declineCookies } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">We use cookies to enhance your experience</h3>
                  <p className="text-sm text-muted-foreground">
                    We use essential cookies for site functionality and analytics cookies to understand how you use our site. 
                    By continuing, you agree to our use of cookies.
                  </p>
                  <div className="mt-2">
                    <Link to="/cookies" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                      <Settings className="h-3 w-3" />
                      Cookie Settings
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <Button 
                  variant="outline" 
                  onClick={declineCookies}
                  className="w-full sm:w-auto"
                >
                  Decline
                </Button>
                <Button 
                  onClick={acceptCookies}
                  className="w-full sm:w-auto"
                >
                  Accept All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CookieBanner;