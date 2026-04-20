import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getNewsletterSubscribeError, newsletterApi } from '@/lib/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NewsletterSubscribeFormProps = {
  className?: string;
  submitLabel?: string;
  loadingLabel?: string;
  onSuccess?: () => void;
};

export function NewsletterSubscribeForm({
  className,
  submitLabel = 'Subscribe',
  loadingLabel = 'Subscribing…',
  onSuccess,
}: NewsletterSubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const emailId = useId();
  const { toast } = useToast();

  const validate = (value: string) => {
    const v = value.trim();
    if (!v) return 'Email address is required';
    if (!EMAIL_RE.test(v)) return 'Please enter a valid email address';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(email);
    if (err) {
      setFieldError(err);
      setSubmitError('');
      return;
    }
    setFieldError('');
    setSubmitError('');
    setIsLoading(true);
    try {
      await newsletterApi.subscribe({ email });
      toast({
        title: 'Subscribed successfully',
      });
      setEmail('');
      onSuccess?.();
    } catch (error) {
      const msg = getNewsletterSubscribeError(error);
      setSubmitError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${className ?? ''}`}>
      <div>
        <Label htmlFor={emailId}>Email address</Label>
        <Input
          id={emailId}
          type="email"
          autoComplete="email"
          placeholder="your.email@example.com"
          value={email}
          disabled={isLoading}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldError) setFieldError('');
            if (submitError) setSubmitError('');
          }}
          className="mt-1"
        />
        {fieldError ? <p className="text-red-500 text-sm mt-1">{fieldError}</p> : null}
        {submitError ? <p className="text-destructive text-sm mt-1">{submitError}</p> : null}
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? loadingLabel : submitLabel}
      </Button>
    </form>
  );
}
