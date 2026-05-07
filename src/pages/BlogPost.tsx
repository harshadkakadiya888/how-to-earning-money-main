import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import BlogCard from '@/components/blog/BlogCard';
import CommentSection from '@/components/blog/CommentSection';
import TableOfContents from '@/components/blog/TableOfContents';
import SocialActions from '@/components/blog/SocialActions';
import { useBlogWithCommentsBySlug, useBlogPosts } from '@/hooks/useApi';
import { coerceTagsFromApi } from '@/lib/djangoBlog';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Star,
  Loader2
} from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useMemo, useEffect } from 'react';

// Utility: Wrap every <table> with a horizontally scrollable div for responsiveness
function wrapTablesWithDiv(htmlString: string): string {
  if (!htmlString) return '';
  return htmlString.replace(/<table[\s\S]*?<\/table>/gi, (match) => {
    // Ensure table-custom class is present
    const withClass = match.replace('<table', '<table class="table-custom"');
    return `<div class="table-wrap">${withClass}</div>`;
  });
}

const BlogPost = () => {
  const { slug } = useParams();
  const { data, error, refetch, isLoading } = useBlogWithCommentsBySlug(slug || '');

  // Define helpers and memoized processing BEFORE any early returns
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

  const processedContent = useMemo(() => {
    const content = (data as any)?.data?.blog?.content || '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const headingEls = tempDiv.querySelectorAll('h1, h2, h3');
    headingEls.forEach((el) => {
      const currentId = el.getAttribute('id');
      const text = (el.textContent || '').trim();
      if (!currentId && text) {
        el.setAttribute('id', slugify(text));
      }
    });

    let html = tempDiv.innerHTML;
    // Add table-custom class and wrap in scroll container
    html = wrapTablesWithDiv(html.replace(/<table/g, '<table class="table-custom"'));
    return html;
  }, [data]);

  // Enable mouse drag scrolling and convert vertical wheel to horizontal inside table wrappers
  useEffect(() => {
    const wrappers = Array.from(document.querySelectorAll<HTMLElement>('.table-wrap'));
    const cleanups: Array<() => void> = [];

    wrappers.forEach((wrap) => {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      const onMouseDown = (e: MouseEvent) => {
        isDown = true;
        startX = e.pageX - wrap.offsetLeft;
        scrollLeft = wrap.scrollLeft;
        wrap.style.cursor = 'grabbing';
      };
      const onMouseLeave = () => {
        isDown = false;
        wrap.style.cursor = 'grab';
      };
      const onMouseUp = () => {
        isDown = false;
        wrap.style.cursor = 'grab';
      };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrap.offsetLeft;
        const walk = x - startX; // positive is right
        wrap.scrollLeft = scrollLeft - walk;
      };
      const onWheel = (e: WheelEvent) => {
        // translate vertical wheel to horizontal when content overflows
        if (wrap.scrollWidth > wrap.clientWidth) {
          wrap.scrollLeft += e.deltaY;
          // prevent page scroll when we can scroll horizontally
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) e.preventDefault();
        }
      };

      wrap.addEventListener('mousedown', onMouseDown);
      wrap.addEventListener('mouseleave', onMouseLeave);
      wrap.addEventListener('mouseup', onMouseUp);
      wrap.addEventListener('mousemove', onMouseMove);
      wrap.addEventListener('wheel', onWheel, { passive: false });
      wrap.style.cursor = 'grab';

      cleanups.push(() => {
        wrap.removeEventListener('mousedown', onMouseDown);
        wrap.removeEventListener('mouseleave', onMouseLeave);
        wrap.removeEventListener('mouseup', onMouseUp);
        wrap.removeEventListener('mousemove', onMouseMove);
        wrap.removeEventListener('wheel', onWheel as any);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [processedContent]);

  // Derive blog and comments ASAP (may be undefined while loading)
  const blog = (data as any)?.data?.blog;
  const comments = (data as any)?.data?.comments || [];

  // Always call useBlogPosts to keep hook order stable
  const currentCategoryId = (blog?.category && (blog.category as any)._id) || (blog?.category as any);
  const { data: catPostsResponse = {} as any } = useBlogPosts(currentCategoryId ? { category: currentCategoryId, limit: 6 } : {});

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-lg">Loading article...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !blog) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const catPosts = Array.isArray(catPostsResponse?.data?.blogs) ? catPostsResponse.data.blogs : [];
  const relatedFromCategory = catPosts.filter((p: any) => p.slug !== blog.slug && p._id !== blog._id).slice(0, 3);

  const relatedPosts = Array.isArray((blog as any)?.relatedPosts) && (blog as any).relatedPosts.length > 0
    ? (blog as any).relatedPosts.slice(0, 3)
    : relatedFromCategory;

  const scrollToComments = () => {
    const element = document.getElementById('comments-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
      <Layout>
        <SEOHead pageData={blog} />
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-2">
          <Button variant="outline" asChild>
            <Link to="/blog">
              ← Back to All Blogs
            </Link>
          </Button>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Article Content */}
            <article className="lg:col-span-3">
              <header className="mb-8">
                <div className="mb-4">
                  <Badge className="mb-4">{blog.category?.name}</Badge>
                  {blog.featured && (
                      <Badge className="ml-2 bg-gold text-white">Featured</Badge>
                  )}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                  {blog.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>How to Earning Money</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(blog.createdAt).toDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {blog.readTime && /min/i.test(String(blog.readTime))
                        ? blog.readTime
                        : blog.readTime
                          ? `${blog.readTime} min read`
                          : "—"}
                    </span>
                  </div>
                </div>
                {/* Summary Box */}
                <Card className="mb-8 border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Star className="h-4 w-4 mr-2 text-gold" />
                      Article Summary
                    </h3>
                    <p className="text-muted-foreground">{blog.articleSummary}</p>
                  </CardContent>
                </Card>
                {(blog.imageUrl || blog.image) && (
                    <img
                        src={blog.imageUrl || blog.image}
                        alt={blog.title}
                        className="w-full h-96 object-cover rounded-lg mb-8"
                        onError={e => { e.currentTarget.src = '/placeholder.svg'; }}
                    />
                )}
                {/* Article Actions */}
                <div className="flex flex-wrap items-center justify-between py-4 border-y">
                  <SocialActions
                      postId={blog._id}
                      postTitle={blog.title}
                      postUrl={window.location.href}
                      initialLikes={typeof (blog as { likes_count?: number }).likes_count === 'number' ? (blog as { likes_count: number }).likes_count : 0}
                      initialLikedByMe={Boolean((blog as { liked_by_me?: boolean }).liked_by_me)}
                      onCommentClick={scrollToComments}
                  />
                  <div className="text-sm text-muted-foreground">
                    Last updated: {new Date(blog.updatedAt).toDateString()}
                  </div>
                </div>
                {/* Mobile Table of Contents */}
                <div className="lg:hidden mt-4 mb-4">
                  <TableOfContents
                    content={blog.content}
                    hasFaqs={Array.isArray(blog.faqs) && blog.faqs.length > 0}
                    mode="mobile"
                  />
                </div>
              </header>

              {/* ------------ MODERN TABLES ------------- */}
              <div
                  id="blog-content"
                  className="prose max-w-none w-full overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: processedContent }}
              />

              {/* FAQs Accordion at the end of the blog post */}
              {Array.isArray(blog.faqs) && blog.faqs.length > 0 && (
                <section id="faq-section" className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {blog.faqs.map((faq, idx) => (
                      <AccordionItem key={idx} value={`faq-${idx}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              )}

              {/* Tags */}
              <div className="mt-6 pt-8">
                <h3 className="font-semibold mb-4">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {coerceTagsFromApi((blog as { tags?: unknown }).tags).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        {tag}
                      </Badge>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              <Card className="mt-8">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                      FE
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{blog.author}</h3>
                      <p className="text-muted-foreground mb-4">
                        Founder of How to Earning Money, passionate about helping people discover practical ways to increase their income.
                        Every strategy shared is thoroughly researched and based on real experiences.
                      </p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/about">Learn More</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/contact">Contact</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <div id="comments-section">
                <CommentSection postId={blog._id} comments={comments} refetchPost={refetch} />
              </div>
            </article>

                          {/* Table of Contents Sidebar */}
              <aside className="lg:col-span-1">
                <TableOfContents
                  content={blog.content}
                  hasFaqs={Array.isArray(blog.faqs) && blog.faqs.length > 0}
                  mode="desktop"
                />
              </aside>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 ? (
          <section id="related-section" className="py-16 bg-secondary/30 relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-8 text-center">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost: any) => (
                  <BlogCard key={relatedPost._id} post={relatedPost} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Button asChild>
                  <Link to="/blog">
                    View More Articles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        ) : null}
      </Layout>
  );
};

export default BlogPost;
