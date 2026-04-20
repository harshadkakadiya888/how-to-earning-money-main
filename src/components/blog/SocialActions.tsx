import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Share2,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { apiUrl } from '@/lib/apiBase';
import { authHeaders, getBlogAccessToken } from '@/lib/blogAuth';

function getOrCreateClientId(): string {
  let cid = localStorage.getItem('blog_client_id');
  if (!cid) {
    cid =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `cid-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem('blog_client_id', cid);
  }
  return cid;
}

interface SocialActionsProps {
  postId: string;
  postTitle: string;
  postUrl: string;
  initialLikes?: number;
  initialLikedByMe?: boolean;
  onCommentClick?: () => void;
}

const SocialActions = ({
  postId,
  postTitle,
  postUrl,
  initialLikes = 0,
  initialLikedByMe = false,
  onCommentClick,
}: SocialActionsProps) => {
  const { toast } = useToast();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialLikedByMe);
  const [isShared, setIsShared] = useState(false);

  const loadStatus = useCallback(async () => {
    if (!postId) return;
    const token = getBlogAccessToken();
    try {
      if (token) {
        const res = await axios.get<{ liked: boolean; likes_count: number }>(
          apiUrl(`/api/posts/${postId}/user-like-status/`),
          { headers: authHeaders() }
        );
        setLikes(typeof res.data.likes_count === 'number' ? res.data.likes_count : initialLikes);
        setIsLiked(Boolean(res.data.liked));
      } else {
        const cid = getOrCreateClientId();
        const res = await axios.get<{ liked: boolean; likes_count: number }>(
          apiUrl(`/api/posts/${postId}/like-status/`),
          { params: { client_id: cid } }
        );
        setLikes(typeof res.data.likes_count === 'number' ? res.data.likes_count : initialLikes);
        setIsLiked(Boolean(res.data.liked));
      }
    } catch {
      setLikes(initialLikes);
      setIsLiked(initialLikedByMe);
    }
  }, [postId, initialLikes, initialLikedByMe]);

  useEffect(() => {
    setLikes(initialLikes);
    setIsLiked(initialLikedByMe);
    void loadStatus();
  }, [postId, initialLikes, initialLikedByMe, loadStatus]);

  const handleLike = async () => {
    const token = getBlogAccessToken();
    try {
      if (token) {
        const res = await axios.post<{ liked: boolean; likes_count: number }>(
          apiUrl(`/api/posts/${postId}/user-like/`),
          {},
          { headers: { ...authHeaders(), 'Content-Type': 'application/json' } }
        );
        setIsLiked(Boolean(res.data.liked));
        setLikes(typeof res.data.likes_count === 'number' ? res.data.likes_count : likes);
        toast({
          title: res.data.liked ? 'Liked' : 'Unliked',
          description: res.data.liked ? 'Thanks for the feedback!' : 'Removed your like.',
        });
        return;
      }

      const cid = getOrCreateClientId();
      const fd = new FormData();
      fd.append('client_id', cid);
      const res = await axios.post<{ liked: boolean; likes_count: number }>(
        apiUrl(`/api/posts/${postId}/like/`),
        fd
      );
      setIsLiked(Boolean(res.data.liked));
      setLikes(typeof res.data.likes_count === 'number' ? res.data.likes_count : likes);
      toast({
        title: res.data.liked ? 'Liked' : 'Unliked',
        description: res.data.liked ? 'Thanks for the feedback!' : 'Removed your like.',
      });
    } catch {
      toast({
        title: 'Could not update like',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = (platform?: string) => {
    const encodedTitle = encodeURIComponent(postTitle);
    const encodedUrl = encodeURIComponent(postUrl);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'copy':
        void navigator.clipboard.writeText(postUrl);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
        toast({
          title: 'Link copied!',
          description: 'Article link copied to clipboard',
        });
        return;
      default:
        if (navigator.share) {
          void navigator.share({
            title: postTitle,
            url: postUrl,
          });
        } else {
          void navigator.clipboard.writeText(postUrl);
          toast({
            title: 'Link copied!',
            description: 'Article link copied to clipboard',
          });
        }
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      toast({
        title: 'Thanks for sharing!',
        description: `Article shared on ${platform}`,
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant={isLiked ? 'default' : 'outline'}
        size="sm"
        onClick={() => void handleLike()}
        className={isLiked ? 'text-red-50 border-red-400 bg-red-600 hover:bg-red-700' : ''}
      >
        <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
        {isLiked ? 'Unlike' : 'Like'} ({likes})
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleShare('facebook')}>
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('twitter')}>
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('linkedin')}>
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('copy')}>
            {isShared ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {isShared ? 'Copied!' : 'Copy Link'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" size="sm" onClick={onCommentClick}>
        <MessageCircle className="h-4 w-4 mr-1" />
        Comment
      </Button>
    </div>
  );
};

export default SocialActions;
