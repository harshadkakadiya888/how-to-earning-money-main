import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  DollarSign,
  Target,
  MessageCircle,
  X,
  Send,
  MoreHorizontal
} from 'lucide-react';
import { useCategories } from '@/hooks/useApi';

interface SuccessStoryFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessStoryForm = ({ isOpen, onClose }: SuccessStoryFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    displayName: 'full',
    incomeBefore: 3500,
    incomeAfter: 8500,
    timeToTransform: '',
    primaryStrategy: '',
    story: '',
    permission: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    story: '',
  });
  const { data: categoriesData, isLoading: isLoadingCategories, error: categoriesError } = useCategories();
  const categories = categoriesData || [];

  const validateForm = () => {
    let isValid = true;
    let newErrors = { ...errors };

    if (!formData.fullName) {
      newErrors.fullName = "Full Name is required";
      isValid = false;
    } else {
      newErrors.fullName = "";
    }

    if (!formData.email) {
      newErrors.email = "Email Address is required";
      isValid = false;
    } else {
      newErrors.email = "";
    }

    if (!formData.story) {
      newErrors.story = "Your success story is required";
      isValid = false;
    } else {
      newErrors.story = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find the selected category object
      const selectedCategory = categories.find((cat: any) => cat._id === formData.primaryStrategy);
      // Submit the payload with the category _id as primaryStrategyUsed
      const payload = {
        ...formData,
        primaryStrategyUsed: selectedCategory ? selectedCategory._id : formData.primaryStrategy,
      };
      // Remove the old primaryStrategy field if needed
      delete payload.primaryStrategy;
      // Here you would submit to your API
      console.log('Submitting success story:', payload);

      toast({
        title: "Success story submitted!",
        description: "Thank you for sharing your journey. We'll review and may contact you for clarification.",
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        displayName: 'full',
        incomeBefore: 3500,
        incomeAfter: 8500,
        timeToTransform: '',
        primaryStrategy: '',
        story: '',
        permission: false
      });
      setSubmitted(false); // Reset submitted state after successful submission
      onClose();
    } catch (error) {
      toast({
        title: "Failed to submit story",
        description: "There was a problem submitting your story. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSubmitted(false); // Reset submitted state when typing
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">Share Your Success Story</DialogTitle>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Help inspire others by sharing your income transformation journey. Your story could motivate someone to start their own path to financial freedom!
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 ml-4 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  Full Name *
                </Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Your full name"
                    required
                    className="pr-10"
                  />
                  <MoreHorizontal className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {submitted && errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                />
                {submitted && errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="displayName">How should we display your name?</Label>
              <Select value={formData.displayName} onValueChange={(value) => handleInputChange('displayName', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Use my full name</SelectItem>
                  <SelectItem value="first">Use my first name only</SelectItem>
                  <SelectItem value="anonymous">Keep me anonymous</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Income Transformation Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Income Transformation</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="incomeBefore">Monthly Income Before</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="incomeBefore"
                    type="number"
                    value={formData.incomeBefore}
                    onChange={(e) => handleInputChange('incomeBefore', parseInt(e.target.value) || 0)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="incomeAfter" className="flex items-center gap-2">
                  Monthly Income Now *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="incomeAfter"
                    type="number"
                    value={formData.incomeAfter}
                    onChange={(e) => handleInputChange('incomeAfter', parseInt(e.target.value) || 0)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="timeToTransform" className="flex items-center gap-2">
                Time to Transform *
              </Label>
              <Select value={formData.timeToTransform} onValueChange={(value) => handleInputChange('timeToTransform', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-months">3 months</SelectItem>
                  <SelectItem value="6-months">6 months</SelectItem>
                  <SelectItem value="12-months">12 months</SelectItem>
                  <SelectItem value="18-months">18 months</SelectItem>
                  <SelectItem value="24-months">24 months</SelectItem>
                  <SelectItem value="3-years">3+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Strategy & Method Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Strategy & Method</h3>
            </div>

            <div>
              <Label htmlFor="primaryStrategy" className="flex items-center gap-2">
                Primary Strategy Used *
              </Label>
              <Select value={formData.primaryStrategy} onValueChange={(value) => handleInputChange('primaryStrategy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingCategories ? 'Loading...' : 'Select your main strategy'} />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCategories && <SelectItem value="" disabled>Loading...</SelectItem>}
                  {categoriesError && <SelectItem value="" disabled>Error loading categories</SelectItem>}
                  {!isLoadingCategories && !categoriesError && Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((cat: any) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  ) : null}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Your Success Story Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Your Success Story</h3>
            </div>

            <div>
              <Label htmlFor="story" className="flex items-center gap-2">
                Tell us your journey *
              </Label>
              <Textarea
                id="story"
                value={formData.story}
                onChange={(e) => handleInputChange('story', e.target.value)}
                placeholder="Share your journey in detail: What challenges did you face? Which specific guides or strategies helped you? What advice would you give to someone starting out? Be specific about your results and timeline..."
                rows={6}
                required
                className="resize-none"
                maxLength={200}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Include: challenges faced, specific strategies used, timeline, key learnings, and advice for others
              </p>
              <div className="text-right text-xs text-muted-foreground mt-1">{formData.story.length}/200</div>
              {submitted && errors.story && <p className="text-red-500 text-sm mt-1">{errors.story}</p>}
            </div>
          </div>

          {/* Permissions and Privacy */}
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="permission"
                checked={formData.permission}
                onCheckedChange={(checked) => handleInputChange('permission', checked)}
                className="mt-1"
              />
              <div className="space-y-2">
                <Label htmlFor="permission" className="text-sm font-medium">
                  I give permission to publish my story on the website to inspire others
                </Label>
                <p className="text-sm text-muted-foreground">
                  Your email address will never be shared publicly. We may contact you for clarification or follow-up questions.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Share My Story
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessStoryForm;