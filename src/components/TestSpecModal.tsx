
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TestSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    requirement: string;
    format: string;
    notes: string;
  }) => void;
  isSubmitting: boolean;
}

const TestSpecModal: React.FC<TestSpecModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [requirement, setRequirement] = useState('');
  const [format, setFormat] = useState('');
  const [notes, setNotes] = useState('');

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setRequirement('');
      setFormat('');
      setNotes('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      requirement,
      format,
      notes,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Test Specification</DialogTitle>
          <DialogDescription>
            Create a new test specification for your requirements.
          </DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="requirement" className="text-sm font-medium">
              Requirement
            </Label>
            <Textarea
              id="requirement"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="Enter the requirement or user story to test..."
              className="resize-none"
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="format" className="text-sm font-medium">
              Format
            </Label>
            <Textarea
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              placeholder="Specify the desired format (e.g., Gherkin, bullet points)..."
              className="resize-none"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional context or instructions..."
              className="resize-none"
              rows={2}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || requirement.trim() === ''}
            >
              {isSubmitting ? 'Generating...' : 'Generate Test Case'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TestSpecModal;
