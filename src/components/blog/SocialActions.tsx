import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ThumbsUp,
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
import api from '@/services/api';
import { apiUrl } from '@/lib/apiBase';
import { authHeaders, getBlogAccessToken } from '@/lib/blogAuth';
import { getReaderClientId, getReaderEmail } from '@/lib/blogReaderAuth';
import { ReaderEmailDialog } from '@/components/blog/ReaderEmailDialog';

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
  const [emailOpen, setEmailOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'like' | 'comment' | null>(null);

  const loadStatus = useCallback(async () => {
    if (!postId) return;
    const token = getBlogAccessToken();
    try {
      if (token) {
        const res = await api.get<{ liked: boolean; likes_count: number }>(
          apiUrl(`/api/posts/${postId}/user-like-status/`),
          { headers: authHeaders() }
        );
        setLikes(typeof res.data.likes_count === 'number' ? res.data.likes_count : initialLikes);
        setIsLiked(Boolean(res.data.liked));
      } else {
        const cid = getReaderClientId();
        const em = getReaderEmail();
        const res = await api.get<{ liked: boolean; likes_count: number }>(
          apiUrl(`/api/posts/${postId}/like-status/`),
          { params: { client_id: cid, ...(em ? { email: em } : {}) } }
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

  const runLike = async () => {
    const token = getBlogAccessToken();
    try {
      if (token) {
        const res = await api.post<{ liked: boolean; likes_count: number }>(
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

      const cid = getReaderClientId();
      const em = getReaderEmail();
      const fd = new FormData();
      fd.append('client_id', cid);
      if (em) {
        fd.append('email', em);
        fd.append('username', em.split('@')[0] || 'Reader');
      }
      const res = await api.post<{ liked: boolean; likes_count: number }>(apiUrl(`/api/posts/${postId}/like/`), fd);
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

  const handleLike = async () => {
    if (!getBlogAccessToken() && !getReaderEmail()) {
      setPendingAction('like');
      setEmailOpen(true);
      return;
    }
    await runLike();
  };

  const handleComment = () => {
    if (!getBlogAccessToken() && !getReaderEmail()) {
      setPendingAction('comment');
      setEmailOpen(true);
      return;
    }
    onCommentClick?.();
  };

  const onEmailSuccess = () => {
    if (pendingAction === 'like') {
      void runLike();
    } else if (pendingAction === 'comment') {
      onCommentClick?.();
    }
    setPendingAction(null);
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
      <ReaderEmailDialog
        open={emailOpen}
        onOpenChange={setEmailOpen}
        onSuccess={onEmailSuccess}
      />
      <Button
        variant={isLiked ? 'default' : 'outline'}
        size="sm"
        onClick={() => void handleLike()}
        className={isLiked ? 'text-white border-sky-600 bg-sky-600 hover:bg-sky-700' : ''}
      >
        <ThumbsUp
          className={`h-4 w-4 mr-1 text-blue-500 ${isLiked ? 'text-white' : ''}`}
        />
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

      <Button variant="outline" size="sm" onClick={handleComment}>
        <MessageCircle className="h-4 w-4 mr-1" />
        Comment
      </Button>
    </div>
  );
};

export default SocialActions;
