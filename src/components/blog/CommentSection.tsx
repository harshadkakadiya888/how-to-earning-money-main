import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Star, 
  Reply, 
  ThumbsUp,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { commentApi } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import React from 'react';

interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  rating: number;
  timestamp: string;
  likes: number;
  replies: Comment[];
  isLiked?: boolean;
}

interface CommentSectionProps {
  postId: string;
  comments: any[];
  refetchPost?: () => void;
}

const CommentSection = ({ postId, comments, refetchPost }: CommentSectionProps) => {
  const { toast } = useToast();
  // Remove local comments state

  const [newComment, setNewComment] = useState({
    author: '',
    email: '',
    content: '',
    rating: 5
  });

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState({
    author: '',
    email: '',
    content: '',
    rating: 5
  });

  const [showAll, setShowAll] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saveUserInfo, setSaveUserInfo] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  // Load saved user info from localStorage
  React.useEffect(() => {
    const savedUserInfo = localStorage.getItem('commentUserInfo');
    if (savedUserInfo) {
      const { name, email } = JSON.parse(savedUserInfo);
      setNewComment(prev => ({ ...prev, author: name, email }));
      setReplyContent(prev => ({ ...prev, author: name, email }));
    }
  }, []);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author || !newComment.email || !newComment.content) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    try {
      await commentApi.addComment(postId, {
        name: newComment.author,
        email: newComment.email,
        comment: newComment.content,
        rating: newComment.rating,
      });
      
      // Save user info to localStorage if checkbox is checked
      if (saveUserInfo) {
        localStorage.setItem('commentUserInfo', JSON.stringify({ 
          name: newComment.author, 
          email: newComment.email 
        }));
      }
      
      toast({
        title: "Comment posted!",
        description: "Thank you for your feedback."
      });
      setNewComment({ author: '', email: '', content: '', rating: 5 });
      if (refetchPost) refetchPost();
    } catch (error) {
      toast({
        title: "Failed to post comment",
        description: "There was a problem posting your comment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.author || !replyContent.email || !replyContent.content) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    try {
      await commentApi.addReply(parentId, {
        name: replyContent.author,
        email: replyContent.email,
        reply: replyContent.content,
        rating: replyContent.rating,
      });
      
      // Save user info to localStorage if checkbox is checked
      if (saveUserInfo) {
        localStorage.setItem('commentUserInfo', JSON.stringify({ 
          name: replyContent.author, 
          email: replyContent.email 
        }));
      }
      
      toast({
        title: "Reply posted!",
        description: "Thank you for your response."
      });
      setReplyContent({ author: '', email: '', content: '', rating: 5 });
      setReplyingTo(null);
      if (refetchPost) refetchPost();
    } catch (error) {
      toast({
        title: "Failed to post reply",
        description: "There was a problem posting your reply. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveUserInfo = (name: string, email: string) => {
    if (saveUserInfo) {
      localStorage.setItem('commentUserInfo', JSON.stringify({ name, email }));
    }
  };

  const handleLikeComment = (commentId: string, isReply?: boolean, parentId?: string) => {
    // This function needs to be updated to manage comments state globally
    // For now, it will just re-render the comments prop, which won't reflect likes
    // A proper implementation would involve updating the comments prop or state
    console.log(`Like comment ${commentId} (reply to ${parentId})`);
  };

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const renderComment = (comment: any, isReply = false) => {
    const displayName = comment.name || comment.author || 'User';
    const displayText = comment.comment || comment.content || '';
         const avatarText = typeof displayName === 'string' ? displayName.charAt(0).toUpperCase() : 'U';
    const commentId = comment._id || comment.id;
    const replies = comment.replies || [];
    // For replies, use reply.reply || reply.comment for the text
    return (
      <div key={commentId} className={`${isReply ? 'ml-4 mt-2' : 'mb-2'}`}>
                 <div className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/30 transition-colors">
           <Avatar className="w-8 h-8 text-sm flex-shrink-0">
             <AvatarFallback className="text-sm">{avatarText}</AvatarFallback>
           </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
              <span className="font-medium text-sm">{displayName}</span>
              {!isReply && (
                <span className="flex items-center gap-1 text-xs">{renderStars(comment.rating)}<Badge variant="secondary" className="text-[10px] px-1 py-0">{comment.rating}/5</Badge></span>
              )}
            </div>
            <div className="text-sm text-foreground mb-1.5 whitespace-pre-line">{isReply ? (comment.reply || comment.comment || comment.content) : displayText}</div>
            <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                 {!isReply && (
                   <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setReplyingTo(replyingTo === commentId ? null : commentId)}>
                     <Reply className="h-3 w-3 mr-1" />
                     <span className="text-xs">Reply</span>
                   </Button>
                 )}
               </div>
              {!isReply && replies.length > 0 && (
                <Button variant="ghost" size="sm" className="text-xs px-2 py-1 h-6" onClick={() => toggleReplies(commentId)}>
                  {expandedReplies.has(commentId) ? 'Hide replies' : `Show replies (${replies.length})`}
                </Button>
              )}
            </div>
          </div>
        </div>
        {/* Reply Form */}
        {!isReply && replyingTo === commentId && (
          <Card className="mt-4 ml-8">
            <CardContent className="p-4">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmitReply(commentId); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`reply-author-${commentId}`}>Name *</Label>
                    <Input
                      id={`reply-author-${commentId}`}
                      value={replyContent.author}
                      onChange={(e) => setReplyContent({...replyContent, author: e.target.value})}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`reply-email-${commentId}`}>Email *</Label>
                    <Input
                      id={`reply-email-${commentId}`}
                      type="email"
                      value={replyContent.email}
                      onChange={(e) => setReplyContent({...replyContent, email: e.target.value})}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Label htmlFor={`reply-content-${commentId}`}>Reply *</Label>
                  <Textarea
                    id={`reply-content-${commentId}`}
                    value={replyContent.content}
                    onChange={(e) => setReplyContent({...replyContent, content: e.target.value})}
                    placeholder="Write your reply..."
                    rows={3}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" size="sm">
                    <Send className="h-4 w-4 mr-1" />
                    Post Reply
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        {/* Replies */}
        {!isReply && replies.length > 0 && expandedReplies.has(commentId) && (
          <div className="mt-4 ml-8">
            {replies.map((reply: any) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="mt-12 pt-8 border-t">
      <div className="flex items-center mb-8">
        <MessageCircle className="h-6 w-6 mr-2" />
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      </div>

      {/* New Comment Form */}
      <Card className="mb-8">
        <CardHeader>
          <h3 className="text-lg font-semibold">Leave a Comment</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitComment}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="comment-author">Name *</Label>
                <Input
                  id="comment-author"
                  value={newComment.author}
                  onChange={(e) => setNewComment({...newComment, author: e.target.value})}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="comment-email">Email *</Label>
                <Input
                  id="comment-email"
                  type="email"
                  value={newComment.email}
                  onChange={(e) => setNewComment({...newComment, email: e.target.value})}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="comment-rating">Rate this article</Label>
              <div className="flex items-center space-x-1 mt-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 cursor-pointer ${i < newComment.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setNewComment({...newComment, rating: i + 1})}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {newComment.rating}/5 stars
                </span>
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="comment-content">Comment *</Label>
              <Textarea
                id="comment-content"
                value={newComment.content}
                onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                placeholder="Share your thoughts about this article..."
                rows={4}
                required
              />
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="save-user-info"
                checked={saveUserInfo}
                onCheckedChange={(checked) => setSaveUserInfo(checked as boolean)}
              />
              <Label htmlFor="save-user-info" className="text-sm">
                Save my name and email for future comments
              </Label>
            </div>
            <div className="text-xs text-muted-foreground mb-4 ml-1">
              Your name and email will be saved in your browser for future comments.
            </div>
            <Button type="submit">
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div>
        {comments.length > 0 ? (
          <>
            {(showAll ? comments : comments.slice(0, 3)).map(comment => renderComment(comment))}
            {comments.length > 3 && !showAll && (
              <div className="text-center mt-4">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setDialogOpen(true)}>Show all comments</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-full h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">All Comments ({comments.length})</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 mt-6">
                      {comments.map(comment => (
                        <div key={comment._id} className="border-b pb-6 last:border-b-0">
                          {renderComment(comment)}
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentSection;