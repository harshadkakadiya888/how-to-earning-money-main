import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { List, ChevronRight } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}

interface DynamicTOCProps {
  className?: string;
  rootSelector?: string;
  headingSelector?: string;
}

const DynamicTOC = ({ 
  className = '', 
  rootSelector = 'main', 
  headingSelector = 'h1, h2, h3, h4, h5, h6' 
}: DynamicTOCProps) => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Generate unique ID for heading elements
  const generateId = useCallback((text: string, index: number): string => {
    const baseId = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    return baseId || `heading-${index}`;
  }, []);

  // Scan and generate TOC items
  const generateTOC = useCallback(() => {
    const rootElement = document.querySelector(rootSelector);
    if (!rootElement) return;

    const headings = rootElement.querySelectorAll(headingSelector) as NodeListOf<HTMLElement>;
    const items: TOCItem[] = [];

    headings.forEach((heading, index) => {
      const text = heading.textContent?.trim() || '';
      if (!text) return;

      // Assign ID if not present
      if (!heading.id) {
        heading.id = generateId(text, index);
      }

      // Add ARIA label for accessibility
      heading.setAttribute('aria-label', text);

      const level = parseInt(heading.tagName.charAt(1));
      items.push({
        id: heading.id,
        text,
        level,
        element: heading
      });
    });

    setTocItems(items);
  }, [rootSelector, headingSelector, generateId]);

  // Scroll spy functionality
  const updateActiveSection = useCallback(() => {
    if (tocItems.length === 0) return;

    const scrollPosition = window.scrollY + 100; // Offset for fixed headers

    // Find the current active section
    let activeItem: TOCItem | null = null;
    
    for (let i = tocItems.length - 1; i >= 0; i--) {
      const item = tocItems[i];
      const element = document.getElementById(item.id);
      if (element && element.offsetTop <= scrollPosition) {
        activeItem = item;
        break;
      }
    }

    if (activeItem) {
      setActiveId(activeItem.id);
    }
  }, [tocItems]);

  // Smooth scroll to section
  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Update URL hash without triggering scroll
      history.replaceState(null, '', `#${id}`);
    }
  }, []);

  // Initialize TOC on component mount and content changes
  useEffect(() => {
    generateTOC();
    
    // Re-generate TOC when content changes (e.g., dynamic content)
    const observer = new MutationObserver(() => {
      generateTOC();
    });

    const rootElement = document.querySelector(rootSelector);
    if (rootElement) {
      observer.observe(rootElement, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    return () => observer.disconnect();
  }, [generateTOC, rootSelector]);

  // Set up scroll listener
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveSection(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateActiveSection]);

  // Handle URL hash on page load
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && tocItems.some(item => item.id === hash)) {
      setTimeout(() => scrollToHeading(hash), 100);
    }
  }, [tocItems, scrollToHeading]);

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className={`table-of-contents ${className}`}>
      <Card className="sticky top-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <List className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">Table of Contents</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <nav aria-label="Table of contents">
            <ol className="space-y-1 counter-reset-[toc-counter]">
              {tocItems.map((item) => {
                const isActive = activeId === item.id;
                const indentLevel = Math.max(0, item.level - 1);
                
                return (
                  <li 
                    key={item.id}
                    className={`counter-increment-[toc-counter] ${indentLevel > 0 ? `ml-${indentLevel * 4}` : ''}`}
                    style={{ marginLeft: `${indentLevel * 1}rem` }}
                  >
                    <button
                      onClick={() => scrollToHeading(item.id)}
                      className={`
                        w-full text-left text-sm py-2 px-3 rounded-md transition-all duration-200
                        flex items-center group hover:bg-muted/50
                        ${isActive 
                          ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary' 
                          : 'text-muted-foreground hover:text-foreground'
                        }
                      `}
                      aria-label={`Go to section: ${item.text}`}
                    >
                      <div className="flex items-center w-full">
                        {isActive && (
                          <ChevronRight className="h-3 w-3 mr-2 text-primary" />
                        )}
                        <span className={`${isActive ? '' : 'ml-5'} line-clamp-2 text-left leading-tight`}>
                          {item.text}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </CardContent>
      </Card>

      <style dangerouslySetInnerHTML={{
        __html: `
          .counter-reset-toc-counter {
            counter-reset: toc-counter;
          }
          .counter-increment-toc-counter {
            counter-increment: toc-counter;
          }
          .counter-increment-toc-counter::before {
            content: counter(toc-counter) '. ';
            font-weight: 500;
            color: hsl(var(--muted-foreground));
            margin-right: 0.5rem;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `
      }} />
    </div>
  );
};

export default DynamicTOC;