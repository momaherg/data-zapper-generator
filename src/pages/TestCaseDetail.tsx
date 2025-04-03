import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Download, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import ChatInterface from '@/components/ChatInterface';
import { cn } from '@/lib/utils';
import { api, TestCase } from '@/utils/api';

interface TestCaseDetailProps {}

const TestCaseDetail: React.FC<TestCaseDetailProps> = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    sessionId
  } = useOutletContext<{
    sessionId: string;
  }>();
  const navigate = useNavigate();
  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatWidth, setChatWidth] = useState<number>(350);
  const minChatWidth = 320;
  const maxChatWidth = 600;
  
  const extractTestCaseFromEvents = (events: any[]): string => {
    if (!events || events.length === 0) return '';
    
    let testCaseText = '';
    const marker = {
      start: '<test_spec_start>',
      end: '<test_spec_end>'
    };
    
    for (let i = events.length - 1; i >= 0; i--) {
      const event = events[i];
      
      if ('content' in event && typeof event.content === 'string') {
        const content = event.content;
        const startIdx = content.lastIndexOf(marker.start);
        const endIdx = content.lastIndexOf(marker.end);
        
        if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
          testCaseText = content.substring(
            startIdx + marker.start.length,
            endIdx
          ).trim();
          break;
        }
      } else if ('description' in event && typeof event.description === 'string') {
        const description = event.description;
        const startIdx = description.lastIndexOf(marker.start);
        const endIdx = description.lastIndexOf(marker.end);
        
        if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
          testCaseText = description.substring(
            startIdx + marker.start.length,
            endIdx
          ).trim();
          break;
        }
      }
    }
    
    return testCaseText;
  };

  useEffect(() => {
    const fetchTestCase = async () => {
      if (!id || !sessionId) return;
      setIsLoading(true);
      try {
        const fetchedTestCase = await api.getTestCase(sessionId, id);
        
        if (!fetchedTestCase.test_case_text && fetchedTestCase.events && fetchedTestCase.events.length > 0) {
          const extractedText = extractTestCaseFromEvents(fetchedTestCase.events);
          if (extractedText) {
            fetchedTestCase.test_case_text = extractedText;
          }
        }
        
        setTestCase(fetchedTestCase);
      } catch (error) {
        console.error('Failed to fetch test case:', error);
        toast.error('Failed to load test case');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestCase();
  }, [id, sessionId]);

  const handleTestSpecUpdated = (testSpec: string) => {
    if (testCase && testSpec) {
      setTestCase(prevTestCase => {
        if (!prevTestCase) return null;
        return {
          ...prevTestCase,
          test_case_text: testSpec
        };
      });
    }
  };

  const handleCopyTestCase = () => {
    if (!testCase) return;
    navigator.clipboard.writeText(testCase.test_case_text);
    toast.success('Test case copied to clipboard');
  };

  const handleDownloadTestCase = () => {
    if (!testCase) return;
    const element = document.createElement('a');
    const file = new Blob([testCase.test_case_text], {
      type: 'text/plain'
    });
    element.href = URL.createObjectURL(file);
    element.download = `test-case-${testCase.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Test case downloaded');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleResizeChat = (direction: 'increase' | 'decrease') => {
    setChatWidth(prev => {
      const step = 50;
      if (direction === 'increase') {
        return Math.min(prev + step, maxChatWidth);
      } else {
        return Math.max(prev - step, minChatWidth);
      }
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse">Loading test case...</div>
      </div>;
  }

  if (!testCase) {
    return <div className="container py-8">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Test case not found</h2>
          <p className="text-muted-foreground mb-4">
            The requested test case could not be found.
          </p>
          <Button onClick={() => navigate(`/dashboard/specs?session_id=${sessionId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Test Specifications
          </Button>
        </div>
      </div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 overflow-auto">
        <div className="container py-8 animate-fade-up">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/specs?session_id=${sessionId}`)} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex-1" />
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex gap-1.5 items-center">
                <Calendar className="h-3 w-3" />
                {formatDate(testCase.created_at)}
              </Badge>
              
              <Button variant="outline" size="sm" onClick={handleCopyTestCase} className="gap-1.5">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleDownloadTestCase} className="gap-1.5">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">{testCase.requirement}</h2>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent">
                      Test Case
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {testCase.events.length} events
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid gap-2">
                  <div>
                    <h3 className="text-sm font-medium">Format</h3>
                    <p className="text-sm text-muted-foreground">
                      {testCase.format}
                    </p>
                  </div>
                  
                  {testCase.notes && <div>
                      <h3 className="text-sm font-medium">Notes</h3>
                      <p className="text-sm text-muted-foreground">
                        {testCase.notes}
                      </p>
                    </div>}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <h3 className="text-lg font-medium mb-4">Generated Test Case</h3>
          
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-380px)] w-full">
                <div className="p-6">
                  <pre className={cn("text-sm font-mono whitespace-pre-wrap", "bg-muted/30 rounded p-4", "overflow-x-auto")}>
                    {testCase.test_case_text}
                  </pre>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="border-l border-border flex flex-col animate-slide-in-right relative" style={{ width: `${chatWidth}px` }}>
        <ChatInterface 
          events={testCase.events} 
          sessionId={sessionId} 
          testCaseId={testCase.id}
          onTestSpecUpdated={handleTestSpecUpdated}
          chatWidth={chatWidth}
          onResizeChat={handleResizeChat}
          minChatWidth={minChatWidth}
          maxChatWidth={maxChatWidth}
        />
      </div>
    </div>
  );
};

export default TestCaseDetail;
