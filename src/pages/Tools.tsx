
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Wrench, AlertTriangle, FileText, FileSpreadsheet, File, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { api, DataSource } from '@/utils/api';

interface ToolsProps {}

const Tools: React.FC<ToolsProps> = () => {
  const { sessionId } = useOutletContext<{ sessionId: string }>();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data sources on load
  useEffect(() => {
    const fetchDataSources = async () => {
      try {
        const response = await api.getDataSources(sessionId);
        setDataSources(response.dataSources);
      } catch (error) {
        console.error('Failed to fetch data sources:', error);
        toast.error('Failed to load tools');
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      fetchDataSources();
    }
  }, [sessionId]);

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
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

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
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

  return (
    <div className="container py-8 animate-fade-up">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-semibold tracking-tight">Tools</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Tools are data sources that can be used when generating test cases.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-muted-foreground mb-8">
        View and manage the data sources used for test case generation
      </p>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-pulse">Loading tools...</div>
        </div>
      ) : dataSources.length === 0 ? (
        <Alert variant="default" className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle>No tools available</AlertTitle>
          <AlertDescription>
            You haven't uploaded any data sources yet. Go to the Upload Data page to add some.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6">
          {dataSources.map(source => (
            <Card 
              key={source.id} 
              className={cn(
                "border overflow-hidden transition-all duration-200 hover:shadow-md hover-lift",
                source.description || source.usage ? "" : "border-amber-200 dark:border-amber-800/50"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
                    "bg-primary/10"
                  )}>
                    {getIcon(source.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-medium truncate">
                      {source.path}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge className={getTypeColor(source.type)}>
                        {source.type.toUpperCase()}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <ScrollArea className="h-28">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {source.description || "No description provided"}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Usage Instructions</h4>
                      <p className="text-sm text-muted-foreground">
                        {source.usage || "No usage instructions provided"}
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
              
              <CardFooter className="pt-0 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toast.info('Edit functionality not implemented in this demo')}
                  className="text-primary hover:text-primary/80"
                >
                  <Wrench className="h-4 w-4 mr-1" />
                  Configure
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tools;
