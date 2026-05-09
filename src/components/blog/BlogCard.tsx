import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';
import { getCategoryBlogImageFallback, isLikelyValidImageUrl } from '@/lib/blogImageFallbacks';

interface BlogPost {
  _id?: string;
  id?: string;
  slug?: string;
  title: string;
  excerpt: string;
  category: {
    _id?: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    image?: string;
  } | string;
  createdAt: string;
  readTime: string;
  author: string;
  featured?: boolean;
  imageUrl?: string;
  image?: string;
  featured_image_source_url?: string | null;
  tags: string[];
}

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
}

const BlogCard = ({ post, variant = 'default' }: BlogCardProps) => {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';
  
  // Handle both string and object category formats
  const categoryName = typeof post.category === 'string' ? post.category : (post.category && post.category.name ? post.category.name : '');
  const categoryImage = typeof post.category === 'object' ? post.category.image : undefined;
  const postId = post._id || post.id || 'unknown';
  const postSlug = post.slug || postId;

  const fallback = getCategoryBlogImageFallback(categoryName);
  const pickPrimary = () => {
    const candidates = [
      post.imageUrl,
      post.image,
      post.featured_image_source_url,
      categoryImage,
    ];
    for (const c of candidates) {
      if (isLikelyValidImageUrl(c)) return c!.trim();
    }
    return '';
  };

  const [imgSrc, setImgSrc] = useState<string>(() => {
    const p = pickPrimary();
    return p || fallback;
  });

  useEffect(() => {
    const fb = getCategoryBlogImageFallback(categoryName);
    const p = pickPrimary();
    setImgSrc(p || fb);
  }, [post.imageUrl, post.image, post.featured_image_source_url, categoryImage, categoryName, post.slug]);

  return (
    <Card className={`group hover:shadow-medium transition-all duration-300 ${isFeatured ? 'border-primary' : ''}`}>
      <Link to={`/blog/${postSlug}`}>
        {!isCompact && (
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={imgSrc}
              alt={post.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => {
                setImgSrc((cur) => (cur === fallback ? cur : fallback));
              }}
            />
            {isFeatured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground">Featured</Badge>
              </div>
            )}
          </div>
        )}
        
        <CardHeader className={isCompact ? 'pb-2' : ''}>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {categoryName}
            </Badge>
            {isFeatured && (
              <Badge className="bg-gold text-white">Must Read</Badge>
            )}
          </div>
          
          <h3 className={`font-semibold group-hover:text-primary transition-colors line-clamp-2 ${
            isFeatured ? 'text-xl' : isCompact ? 'text-base' : 'text-lg'
          }`}>
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className={isCompact ? 'pt-0' : ''}>
          {!isCompact && (
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{new Date(post.createdAt).toDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  {post.readTime && /min/i.test(post.readTime)
                    ? post.readTime
                    : post.readTime
                      ? `${post.readTime} min read`
                      : "—"}
                </span>
              </div>
            </div>
            {/*<div className="flex items-center">*/}
            {/*  /!*<User className="h-3 w-3 mr-1" />*!/*/}
            {/*  <span>{post.author}</span>*/}
            {/*</div>*/}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default BlogCard;