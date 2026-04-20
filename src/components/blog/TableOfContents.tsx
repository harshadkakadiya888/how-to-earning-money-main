import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { List } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  hasFaqs?: boolean;
  mode?: 'mobile' | 'desktop' | 'auto';
}

const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const DEFAULT_TOP = 96; // pixels (top-24)
const STOP_MARGIN = 16; // gap above related section

const TableOfContents = ({ content, hasFaqs = false, mode = 'auto' }: TableOfContentsProps) => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [topPx, setTopPx] = useState<number>(DEFAULT_TOP);
  const fixedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.getElementById('blog-content');
    if (!root) return setTocItems([]);

    const headings: TOCItem[] = [];
    const elements = root.querySelectorAll('h1, h2');
    elements.forEach((el) => {
      const text = el.textContent?.trim() || '';
      if (!text) return;
      const id = el.id || slugify(text);
      const level = Number(el.tagName.substring(1));
      headings.push({ id, text, level });
    });

    if (hasFaqs) headings.push({ id: 'faq-section', text: 'Frequently Asked Questions', level: 2 });
    headings.push({ id: 'comments-section', text: 'Comments', level: 2 });

    setTocItems(headings);
  }, [content, hasFaqs]);

  useEffect(() => {
    const onScroll = () => {
      const stopRelated = document.querySelector('#related-section') as HTMLElement | null;
      const stopFooter = document.querySelector('#site-footer') as HTMLElement | null;
      const cardHeight = fixedRef.current?.getBoundingClientRect().height || 0;

      const relatedTop = stopRelated ? stopRelated.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
      const footerTop = stopFooter ? stopFooter.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
      const nearestStopTop = Math.min(relatedTop, footerTop);

      const maxTopBeforeOverlap = nearestStopTop - cardHeight - STOP_MARGIN;
      const nextTop = Math.min(DEFAULT_TOP, maxTopBeforeOverlap);
      setTopPx(nextTop);

      // Active section highlight
      const ids = tocItems.map((i) => i.id);
      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 110) current = id;
      }
      if (current) setActiveId(current);
    };
    const onResize = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [tocItems]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
  };

  if (tocItems.length === 0) return null;

  const ListUI = () => (
    <nav>
      <ul className="space-y-2">
        {tocItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToId(item.id)}
              className={`group relative w-full text-left text-sm py-1.5 pl-3 pr-2 rounded transition-colors ${
                item.level === 1 ? 'font-semibold' : ''
              } ${
                activeId === item.id
                  ? 'text-primary font-medium bg-primary/5 before:content-["" ] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-primary'
                  : 'hover:bg-muted/60 hover:text-foreground before:content-["" ] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-muted/40 hover:before:bg-primary/60'
              }`}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  const renderDesktop = mode === 'desktop' || mode === 'auto';
  const renderMobile = mode === 'mobile' || mode === 'auto';

  return (
    <>
      {renderDesktop && (
        <div className="hidden lg:block">
          <div
            ref={fixedRef}
            className="fixed right-[max(0.5rem,calc((100vw-80rem)/2+0.5rem))] w-72 z-10"
            style={{ top: `${topPx}px` }}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <List className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Table of Contents</h3>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ListUI />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {renderMobile && (
        <div className="lg:hidden">
          <Accordion type="single" collapsible>
            <AccordionItem value="toc">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center">
                  <List className="h-4 w-4 mr-2" />
                  Table of Contents
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ListUI />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </>
  );
};

export default TableOfContents;