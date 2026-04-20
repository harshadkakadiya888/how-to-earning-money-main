import { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'htmoney_cookie_consent';
const ANALYTICS_CONSENT_KEY = 'htmoney_analytics_consent';
const PREFERENCE_CONSENT_KEY = 'htmoney_preference_consent';

export const useCookieConsent = () => {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean>(false);
  const [preferenceConsent, setPreferenceConsent] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const analytics = localStorage.getItem(ANALYTICS_CONSENT_KEY);
    const preference = localStorage.getItem(PREFERENCE_CONSENT_KEY);
    
    if (consent) {
      setHasConsent(consent === 'accepted');
      setAnalyticsConsent(analytics === 'true');
      setPreferenceConsent(preference === 'true');
    } else {
      setShowBanner(true);
    }
  }, []);

  // Load Google Analytics only if consent given
  useEffect(() => {
    if (analyticsConsent) {
      // Load Google Analytics
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      script.async = true;
      document.head.appendChild(script);

      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      (window as any).gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID', {
        cookie_flags: 'SameSite=None;Secure'
      });
    }
  }, [analyticsConsent]);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    localStorage.setItem(ANALYTICS_CONSENT_KEY, 'true');
    localStorage.setItem(PREFERENCE_CONSENT_KEY, 'true');
    setHasConsent(true);
    setAnalyticsConsent(true);
    setPreferenceConsent(true);
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    localStorage.setItem(ANALYTICS_CONSENT_KEY, 'false');
    localStorage.setItem(PREFERENCE_CONSENT_KEY, 'false');
    setHasConsent(false);
    setAnalyticsConsent(false);
    setPreferenceConsent(false);
    setShowBanner(false);
  };

  const acceptSelected = (analytics: boolean, preference: boolean) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    localStorage.setItem(ANALYTICS_CONSENT_KEY, analytics.toString());
    localStorage.setItem(PREFERENCE_CONSENT_KEY, preference.toString());
    setHasConsent(true);
    setAnalyticsConsent(analytics);
    setPreferenceConsent(preference);
    setShowBanner(false);
  };

  return {
    hasConsent,
    showBanner,
    analyticsConsent,
    preferenceConsent,
    acceptCookies,
    declineCookies,
    acceptSelected,
  };
};