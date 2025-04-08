
import React, { useState, useCallback, useEffect } from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Separator } from '../../ui/separator';
import { toast } from 'sonner';
import { Gallery } from './types';
import { MonacoEditor } from '../builder/monaco';
import { Save, Copy, Download, ChevronRight, ChevronDown } from 'lucide-react';
import { formatDate, truncateText } from './utils';

interface GalleryDetailProps {
  gallery: Gallery;
  onSave: (updates: Partial<Gallery>) => Promise<void>;
  onDirtyStateChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GalleryDetail({
  gallery,
  onSave,
  onDirtyStateChange,
}: GalleryDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [code, setCode] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (gallery && gallery.config) {
      setCode(JSON.stringify(gallery.config, null, 2));
    }
  }, [gallery]);

  const handleCodeChange = useCallback(
    (value: string) => {
      setCode(value);
      onDirtyStateChange(true);
    },
    [onDirtyStateChange]
  );

  const handleSave = async () => {
    try {
      const configObj = JSON.parse(code);
      await onSave({ config: configObj });
      toast.success('Gallery saved successfully');
      onDirtyStateChange(false);
    } catch (error) {
      console.error('Failed to save gallery:', error);
      toast.error(
        error instanceof SyntaxError
          ? 'Invalid JSON: ' + error.message
          : 'Failed to save gallery'
      );
    }
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(code);
    toast.success('Config copied to clipboard');
  };

  const downloadConfig = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${gallery.id.toString()}-config.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!gallery) return null;

  return (
    <div className="animate-fade-in">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl mb-2">{gallery.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">ID: {gallery.id.toString()}</Badge>
                {gallery.description && (
                  <Badge variant="outline" className="bg-primary/5">
                    {truncateText(gallery.description, 30)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="font-medium"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 mr-1.5" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1.5" />
              )}
              Details
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyConfig}
                className="text-xs"
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadConfig}
                className="text-xs"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Download
              </Button>
            </div>
          </div>

          {isExpanded && (
            <div className="bg-muted/50 rounded-md p-3 text-xs space-y-2 animate-fade-down">
              <div>
                <span className="font-medium">ID:</span> {gallery.id.toString()}
              </div>
              {gallery.description && (
                <div>
                  <span className="font-medium">Description:</span> {gallery.description}
                </div>
              )}
              {gallery.config && gallery.config.metadata && (
                <>
                  {Object.entries(gallery.config.metadata).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium">{key}:</span>{' '}
                      {typeof value === 'object'
                        ? JSON.stringify(value)
                        : value?.toString()}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          <Separator />

          <div className="rounded-md overflow-hidden border bg-background">
            <div className="flex items-center justify-between bg-muted/80 px-3 py-1.5">
              <span className="text-xs font-medium">Configuration</span>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>
            <div className="h-[400px]">
              <MonacoEditor
                value={code}
                language="json"
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  readOnly: !isEditing,
                }}
              />
            </div>
          </div>
        </CardContent>

        {isEditing && (
          <CardFooter className="px-0 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                // Reset code to original value
                setCode(JSON.stringify(gallery.config, null, 2));
                onDirtyStateChange(false);
              }}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1.5" />
              Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
