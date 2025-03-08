
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DataSource } from '@/utils/api';

interface TestSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    requirement: string;
    format: string;
    notes: string;
    dataSourceIds: string[];
  }) => void;
  isSubmitting: boolean;
  dataSources: DataSource[];
}

const TestSpecModal: React.FC<TestSpecModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  dataSources,
}) => {
  const [requirement, setRequirement] = useState('');
  const [format, setFormat] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setRequirement('');
      setFormat('');
      setNotes('');
      setSelectedDataSources([]);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      requirement,
      format,
      notes,
      dataSourceIds: selectedDataSources,
    });
  };

  const toggleDataSource = (id: string) => {
    setSelectedDataSources(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Test Specification</DialogTitle>
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
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Data Sources</Label>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              <div className="space-y-3">
                {dataSources.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No data sources available. Please upload data sources first.
                  </p>
                ) : (
                  dataSources.map(source => (
                    <div key={source.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`source-${source.id}`}
                        checked={selectedDataSources.includes(source.id)}
                        onCheckedChange={() => toggleDataSource(source.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`source-${source.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {source.path}
                        </label>
                        {source.description && (
                          <p className="text-xs text-muted-foreground">
                            {source.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || requirement.trim() === '' || selectedDataSources.length === 0}
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
