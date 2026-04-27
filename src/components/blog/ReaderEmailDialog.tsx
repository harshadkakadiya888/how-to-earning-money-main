import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isValidEmail, setReaderEmail } from '@/lib/blogReaderAuth';
import { Loader2 } from 'lucide-react';

type ReaderEmailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (email: string) => void;
  title?: string;
  description?: string;
};

export function ReaderEmailDialog({
  open,
  onOpenChange,
  onSuccess,
  title = 'Continue with your email',
  description = 'We use your email once to save your like or comment. It stays on this device for future posts.',
}: ReaderEmailDialogProps) {
  const [value, setValue] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!isValidEmail(value)) {
      setErr('Please enter a valid email address.');
      return;
    }
    setBusy(true);
    try {
      setReaderEmail(value);
      onSuccess(value.trim().toLowerCase());
      onOpenChange(false);
      setValue('');
    } catch {
      setErr('Could not save email. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setErr(null);
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="reader-email">Email</Label>
            <Input
              id="reader-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            {err ? <p className="text-sm text-destructive">{err}</p> : null}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Continue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
