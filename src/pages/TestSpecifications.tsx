import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, AlertTriangle, FileText, Clock, Calendar, ArrowRight, Maximize2, Copy, BookText, ScrollText } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import TestSpecModal from '@/components/TestSpecModal';
import { api, DataSource, TestCase } from '@/utils/api';
import { DetailGroup } from '@/components/studio/builder/node-editor/detailgroup';
import { truncateText } from '@/components/studio/gallery/utils';

interface TestSpecificationsProps {}

const TestSpecifications: React.FC<TestSpecificationsProps> = () => {
  const { sessionId } = useOutletContext<{ sessionId: string }>();
  const navigate = useNavigate();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  
  const mockTestCases: TestCase[] = [
    {
      id: 'tc1',
      requirement: 'As a user, I want to reset my password so that I can regain access to my account if I forget it.',
      format: 'Use Gherkin BDD style with Scenario and Scenario Outline formats.',
      notes: 'This requirement is critical for user security. Consider edge cases.',
      selected_data_sources: [],
      test_case_text: 'Feature: Password Reset\n\nScenario: User successfully resets password\n  Given the user is on the login page\n  When they click "Forgot Password"\n  Then they should be directed to the password reset page',
      events: [
        { type: 'Thought', description: 'Analyzing requirement: Password reset functionality' },
      ],
      created_at: new Date().toISOString(),
    },
    {
      id: 'tc2',
      requirement: 'As an admin, I want to view a list of all users so that I can manage user accounts.',
      format: 'Structured bullet points with pre-conditions and expected results',
      notes: 'Include pagination scenarios',
      selected_data_sources: [],
      test_case_text: '## Test Case: Admin User List View\n\n**Pre-conditions:**\n- Admin is logged in\n- Multiple user accounts exist in the system\n\n**Steps:**\n1. Navigate to Admin Dashboard\n2. Click on "User Management"\n3. View the user list\n\n**Expected Results:**\n- User list is displayed with correct information',
      events: [
        { type: 'DataSourceAccess', description: 'Examining csv file at user_data.csv' },
      ],
      created_at: new Date(Date.now() - 86400000).toISOString(),
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getDataSources(sessionId);
        setDataSources(response.dataSources);
        
        const testCases = await api.getTestCases(sessionId)
        setTestCases(testCases.testCases);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (sessionId) {
      fetchData();
    }
  }, [sessionId]);

  const handleGenerateTestCase = async (data: {
    requirement: string;
    format: string;
    notes: string;
    dataSourceIds: string[];
  }) => {
    setIsGenerating(true);
    
    try {
      const result = await api.generateTestCase(sessionId, {
        requirement: data.requirement,
        format: data.format,
        notes: data.notes,
        dataSourceIds: data.dataSourceIds,
      });
      
      toast.success('Test case generated successfully');
      
      navigate(`/dashboard/test-case/${result.id}?session_id=${sessionId}`);
    } catch (error) {
      console.error('Failed to generate test case:', error);
      toast.error('Failed to generate test case');
    } finally {
      setIsGenerating(false);
      setIsModalOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const toggleCardExpansion = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(`${type} copied to clipboard`))
      .catch(() => toast.error("Failed to copy text"));
  };

  const renderCardContent = (testCase: TestCase, isExpanded: boolean) => {
    return (
      <>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent">
            Test Case
          </Badge>
          <Badge variant="outline" className="flex gap-1.5 items-center">
            <Calendar className="h-3 w-3" />
            {formatDate(testCase.created_at)}
          </Badge>
        </div>
        
        <CardTitle className="text-lg font-medium mb-3 line-clamp-2">
          {isExpanded ? testCase.requirement : truncateText(testCase.requirement, 100)}
        </CardTitle>
        
        <div className="text-sm text-muted-foreground mb-3">
          <span className="font-medium">Format:</span> {isExpanded ? testCase.format : truncateText(testCase.format, 60)}
        </div>
        
        {testCase.notes && (
          <div className="text-sm text-muted-foreground mb-3">
            <span className="font-medium">Notes:</span> {isExpanded ? testCase.notes : truncateText(testCase.notes, 60)}
          </div>
        )}
        
        <Separator className="my-3" />
        
        <DetailGroup 
          title="Test Case Specification" 
          defaultOpen={isExpanded}
        >
          <div className={cn(
            "font-mono text-sm text-muted-foreground bg-muted/50 rounded p-2",
            isExpanded ? "" : "max-h-32 overflow-hidden"
          )}>
            <pre className="whitespace-pre-wrap">
              {testCase.test_case_text}
            </pre>
          </div>
        </DetailGroup>
        
        {isExpanded && testCase.events && testCase.events.length > 0 && (
          <DetailGroup 
            title="Events" 
            defaultOpen={false}
          >
            <div className="space-y-2 mt-2">
              {testCase.events.map((event, idx) => (
                <div key={idx} className="text-xs border-l-2 border-primary/30 pl-2 py-1">
                  <span className="font-semibold">{event.type}:</span> {event.description}
                </div>
              ))}
            </div>
          </DetailGroup>
        )}
      </>
    );
  };

  return (
    <div className="container py-8 animate-fade-up">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-semibold tracking-tight">Test Specifications</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Test Spec
        </Button>
      </div>
      <p className="text-muted-foreground mb-8">
        Create and manage your test case specifications
      </p>
      
      {isLoadingData ? (
        <div className="flex justify-center py-10">
          <div className="animate-pulse">Loading test specifications...</div>
        </div>
      ) : dataSources.length === 0 ? (
        <Alert variant="default" className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle>No data sources available</AlertTitle>
          <AlertDescription>
            You need to upload data sources before creating test specifications.
            Go to the Upload Data page to add some.
          </AlertDescription>
        </Alert>
      ) : testCases.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-medium">No test specifications yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Create your first test specification by clicking the "New Test Spec" button.
          </p>
          <Button onClick={() => setIsModalOpen(true)} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Create Test Specification
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {testCases.map(testCase => {
            const isExpanded = !!expandedCards[testCase.id];
            
            return (
              <Card 
                key={testCase.id} 
                className={cn(
                  "overflow-hidden transition-all duration-200 hover:shadow-md",
                  isExpanded ? "col-span-full xl:col-span-2" : ""
                )}
              >
                <CardContent className={cn("p-4", isExpanded ? "pb-0" : "")}>
                  {renderCardContent(testCase, isExpanded)}
                </CardContent>
                
                <CardFooter className={cn("p-4 pt-2 flex justify-between")}>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-8 gap-1 text-muted-foreground"
                      onClick={() => toggleCardExpansion(testCase.id)}
                    >
                      {isExpanded ? "Collapse" : "Expand"}
                      <Maximize2 className="h-3.5 w-3.5" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 gap-1 text-muted-foreground"
                      onClick={() => copyToClipboard(testCase.test_case_text, "Test case")}
                    >
                      Copy
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-8 gap-1 text-primary hover:text-primary/90"
                    onClick={() => navigate(`/dashboard/test-case/${testCase.id}?session_id=${sessionId}`)}
                  >
                    View Details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      
      <TestSpecModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGenerateTestCase}
        isSubmitting={isGenerating}
        dataSources={dataSources}
      />
    </div>
  );
};

export default TestSpecifications;
