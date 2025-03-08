
import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Download, Share, Calendar, Clock } from 'lucide-react';
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
  const { id } = useParams<{ id: string }>();
  const { sessionId } = useOutletContext<{ sessionId: string }>();
  const navigate = useNavigate();
  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestCase = async () => {
      if (!id || !sessionId) return;
      
      setIsLoading(true);
      
      try {
        // In a real implementation, we would fetch the test case here
        // For this demo, we're using mock data
        const mockTestCase: TestCase = {
          id,
          requirement: 'As a user, I want to reset my password so that I can regain access to my account if I forget it.',
          format: 'Use Gherkin BDD style with Scenario and Scenario Outline formats.',
          notes: 'This requirement is critical for user security. Consider edge cases.',
          selected_data_sources: ['ds1', 'ds2'],
          test_case_text: `Feature: Password Reset

Scenario: User successfully resets password via email
  Given the user is on the login page
  When they click "Forgot Password"
  Then they should be directed to the password reset page
  When they enter their registered email address
  And they submit the form
  Then a password reset email should be sent to their email
  When they click the reset link in the email
  Then they should be directed to a page to create a new password
  When they enter a new valid password and confirm it
  And they submit the form
  Then their password should be updated
  And they should be redirected to the login page
  And they should be able to login with the new password

Scenario: User attempts to reset password with unregistered email
  Given the user is on the password reset page
  When they enter an email that is not registered in the system
  And they submit the form
  Then they should see an error message indicating the email is not registered

Scenario Outline: User attempts to set invalid password during reset
  Given the user is on the new password page after clicking reset link
  When they enter "<password>" as new password
  And they enter "<password>" as confirmation
  And they submit the form
  Then they should see an error message about password requirements

  Examples:
    | password  | issue                     |
    | pass      | too short                 |
    | password  | no special characters     |
    | Password1 | no special characters     |
    | pass@word | no numbers                |
    | PASS@123  | no lowercase              |

Scenario: Reset link expires
  Given a user has requested a password reset
  And the reset link has expired
  When they click on the expired reset link
  Then they should see an error message indicating the link has expired
  And they should be provided with an option to request a new reset link`,
          events: [
            { type: 'Thought', description: 'Analyzing requirement: Password reset functionality involves several key flows' },
            { type: 'Thought', description: 'Must consider security aspects like link expiration and handling invalid inputs' },
            { type: 'Thought', description: 'Extracting possible test cases based on typical password reset flows and edge cases' },
            { type: 'DataSourceAccess', dataSourceId: 'ds1', description: 'Examining security requirements document for password policy details' },
            { type: 'Thought', description: 'Applying Gherkin format as requested with multiple scenarios and scenario outlines' },
            { type: 'DataSourceAccess', dataSourceId: 'ds2', description: 'Checking test data for examples of invalid passwords' },
          ],
          created_at: new Date().toISOString(),
        };
        
        setTestCase(mockTestCase);
      } catch (error) {
        console.error('Failed to fetch test case:', error);
        toast.error('Failed to load test case');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestCase();
  }, [id, sessionId]);

  const handleCopyTestCase = () => {
    if (!testCase) return;
    
    navigator.clipboard.writeText(testCase.test_case_text);
    toast.success('Test case copied to clipboard');
  };

  const handleDownloadTestCase = () => {
    if (!testCase) return;
    
    const element = document.createElement('a');
    const file = new Blob([testCase.test_case_text], { type: 'text/plain' });
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
      minute: '2-digit',
    }).format(date);
  };

  const handleSendMessage = (message: string) => {
    // In a real implementation, we would send the message to the API
    console.log('Message sent:', message);
    toast.info('Chat functionality is not implemented in this demo');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse">Loading test case...</div>
      </div>
    );
  }

  if (!testCase) {
    return (
      <div className="container py-8">
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
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 overflow-auto">
        <div className="container py-8 animate-fade-up">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(`/dashboard/specs?session_id=${sessionId}`)}
              className="mr-2"
            >
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
              
              <Button variant="outline" size="sm" className="gap-1.5">
                <Share className="h-4 w-4" />
                Share
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
                  
                  {testCase.notes && (
                    <div>
                      <h3 className="text-sm font-medium">Notes</h3>
                      <p className="text-sm text-muted-foreground">
                        {testCase.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <h3 className="text-lg font-medium mb-4">Generated Test Case</h3>
          
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-380px)] w-full">
                <div className="p-6">
                  <pre className={cn(
                    "text-sm font-mono whitespace-pre-wrap",
                    "bg-muted/30 rounded p-4",
                    "overflow-x-auto"
                  )}>
                    {testCase.test_case_text}
                  </pre>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="w-80 border-l border-border flex flex-col animate-slide-in-right">
        <ChatInterface 
          events={testCase.events}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default TestCaseDetail;
