import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail } from 'lucide-react';
import { NewsletterSubscribeForm } from '@/components/NewsletterSubscribeForm';

interface NewsletterModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const NewsletterModal = ({ trigger, onSuccess }: NewsletterModalProps) => {
  const defaultTrigger = (
    <Button variant="outline" className="w-full">
      <Mail className="mr-2 h-4 w-4" />
      Subscribe to Newsletter
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Subscribe to Our Newsletter
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Get the latest money-making strategies, investment tips, and financial guides delivered directly to your inbox.
          </p>
          <NewsletterSubscribeForm
            className="space-y-4"
            submitLabel="Subscribe Now"
            loadingLabel="Subscribing…"
            onSuccess={onSuccess}
          />
          <p className="text-xs text-muted-foreground">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterModal;
