
import React, { useState } from 'react';
import { FileText, FileSpreadsheet, File, Save, Edit2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DataSource } from '@/utils/api';

interface DataSourceItemProps {
  dataSource: DataSource;
  onUpdate: (id: string, updates: Partial<DataSource>) => Promise<void>;
  isEditing: boolean;
  onEditToggle: (id: string) => void;
  isUpdating: boolean;
}

const DataSourceItem: React.FC<DataSourceItemProps> = ({
  dataSource,
  onUpdate,
  isEditing,
  onEditToggle,
  isUpdating
}) => {
  const [description, setDescription] = useState(dataSource.description);
  const [usage, setUsage] = useState(dataSource.usage);

  const getIcon = () => {
    switch (dataSource.type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'csv':
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getTypeColor = () => {
    switch (dataSource.type.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'csv':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'xlsx':
      case 'xls':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleSave = async () => {
    await onUpdate(dataSource.id, { description, usage });
    onEditToggle('');
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-md",
      isEditing && "ring-2 ring-primary/50",
      isUpdating && "opacity-70 pointer-events-none"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={cn(
            "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
            "bg-primary/10"
          )}>
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium truncate">{dataSource.path}</h3>
              <Badge className={cn("ml-auto", getTypeColor())}>
                {dataSource.type.toUpperCase()}
              </Badge>
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Description
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this data source contains..."
                    className="resize-none"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Usage Instructions
                  </label>
                  <Textarea
                    value={usage}
                    onChange={(e) => setUsage(e.target.value)}
                    placeholder="Describe how to use this data source..."
                    className="resize-none"
                    rows={2}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Description: </span>
                  {dataSource.description || "No description provided"}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Usage: </span>
                  {dataSource.usage || "No usage instructions provided"}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end">
        {isEditing ? (
          <Button
            onClick={handleSave}
            size="sm"
            disabled={isUpdating}
            className="gap-1.5"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditToggle(dataSource.id)}
            className="gap-1.5"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DataSourceItem;
