import { Link } from 'react-router-dom';
import { DollarSign, Mail, Search, FileText, Shield, Cookie, TrendingUp, Star } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="site-footer" className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <img
                  src="/lovable-uploads/64653eaf-8b5f-435a-89a0-7092298c8d05.png"
                  alt="How to Earning Money"
                  className="h-16 w-auto sm:h-24 sm:w-auto object-contain max-w-full"
                  loading="lazy"
                  decoding="async"
              />

            </Link>
            <p className="text-sm opacity-90 mb-4 max-w-md">
              Discover practical ways to increase your income with thoroughly researched guides,
              honest reviews, and proven strategies. Built by someone passionate about financial education.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4" />
              <span>howtoearningmoneyy@gmail.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="opacity-90 hover:opacity-100 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blog" className="opacity-90 hover:opacity-100 transition-opacity">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/categories" className="opacity-90 hover:opacity-100 transition-opacity">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="opacity-90 hover:opacity-100 transition-opacity">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="opacity-90 hover:opacity-100 transition-opacity">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search" className="opacity-90 hover:opacity-100 transition-opacity flex items-center">
                  Search Articles
                </Link>
              </li>
              <li>
                <Link to="/newsletter" className="opacity-90 hover:opacity-100 transition-opacity">
                  Newsletter Signup
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="opacity-90 hover:opacity-100 transition-opacity flex items-center">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/newsletter-reviews" className="opacity-90 hover:opacity-100 transition-opacity flex items-center">
                  Newsletter Reviews
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="opacity-90 hover:opacity-100 transition-opacity">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start items-center space-x-4 text-xs">
              <Link to="/privacy" className="opacity-90 hover:opacity-100 transition-opacity flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                Privacy Policy
              </Link>
              <Link to="/terms" className="opacity-90 hover:opacity-100 transition-opacity flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                Terms & Disclaimer
              </Link>
              <Link to="/cookies" className="opacity-90 hover:opacity-100 transition-opacity flex items-center">
                <Cookie className="h-3 w-3 mr-1" />
                Cookie Policy
              </Link>
              <Link to="/sitemap" className="opacity-90 hover:opacity-100 transition-opacity flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                Sitemap
              </Link>
            </div>
            <p className="text-xs opacity-90">
              © {currentYear} How to Earning Money. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
