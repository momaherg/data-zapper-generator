import React from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Wrench, Terminal, Code } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
  collapsedState: boolean;
  onToggleCollapse: (messageId: string) => void;
  onTestSpecClick?: (testSpec: string) => void;
  isSelected?: boolean;
  isMainChatTab?: boolean; // Added to distinguish between chat tabs
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  collapsedState,
  onToggleCollapse,
  onTestSpecClick,
  isSelected = false,
  isMainChatTab = false // Default to false
}) => {
  return (
    <div
      className={cn(
        "animate-fade-up",
        message.isUser ? "flex justify-end" : "flex"
      )}
    >
      <div
        className={cn(
          "max-w-[90%]",
          getMessageStyle(message)
        )}
      >
        {message.type && message.type !== 'text' && !message.isUser && message.type !== 'ThoughtEvent' && (
          <div className="text-[10px] font-medium uppercase tracking-wider mb-1 flex items-center gap-1">
            {getMessageIcon(message)}
            {message.type}
          </div>
        )}
        <div>{formatMessage(message, collapsedState, onToggleCollapse, onTestSpecClick, isSelected, isMainChatTab)}</div>
        <div className="text-[10px] opacity-70 mt-1 flex justify-between items-center">
          {message.source && (
            <span className="font-medium">{message.source}</span>
          )}
          <span>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

const hasToolCalls = (content: any): boolean => {
  if (!content) return false;
  
  if (Array.isArray(content)) {
    return content.some(item => item.name && typeof item.name === 'string');
  }
  
  return false;
};

const getToolNames = (content: any): string[] => {
  if (!content || !Array.isArray(content)) return [];
  
  return content
    .filter(item => item.name && typeof item.name === 'string')
    .map(item => item.name);
};

const processTestSpecContent = (content: string, isMainChatTab: boolean): { modifiedContent: string, testSpecs: string[] } => {
  const testSpecMarkers = {
    start: '<test_spec_start>',
    end: '<test_spec_end>'
  };
  
  let modifiedContent = content;
  const testSpecs: string[] = [];
  
  let startIdx = content.indexOf(testSpecMarkers.start);
  let endIdx = content.indexOf(testSpecMarkers.end, startIdx);
  
  while (startIdx !== -1 && endIdx !== -1) {
    const testSpec = content.substring(
      startIdx + testSpecMarkers.start.length,
      endIdx
    ).trim();
    
    testSpecs.push(testSpec);
    
    startIdx = content.indexOf(testSpecMarkers.start, endIdx);
    if (startIdx !== -1) {
      endIdx = content.indexOf(testSpecMarkers.end, startIdx);
    } else {
      break;
    }
  }

  if (testSpecs.length > 0) {
    let processedContent = '';
    let remainingContent = content;
    
    for (let i = 0; i < testSpecs.length; i++) {
      const currentStartIdx = remainingContent.indexOf(testSpecMarkers.start);
      const currentEndIdx = remainingContent.indexOf(testSpecMarkers.end) + testSpecMarkers.end.length;
      
      processedContent += remainingContent.substring(0, currentStartIdx);
      
      processedContent += '{{TEST_SPEC_PLACEHOLDER_' + i + '}}';
      
      remainingContent = remainingContent.substring(currentEndIdx);
    }
    
    modifiedContent = processedContent + remainingContent;
  }
  
  return { modifiedContent, testSpecs };
};

const renderTestSpecPlaceholder = (testSpec: string, onTestSpecClick?: (testSpec: string) => void, isSelected: boolean = false) => {
  return (
    <button 
      className={cn(
        "py-1 px-2 my-1 rounded inline-flex items-center gap-1 text-xs border transition-colors cursor-pointer",
        isSelected 
          ? "bg-blue-100 dark:bg-blue-800 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-200 shadow-sm"
          : "bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300"
      )}
      onClick={() => onTestSpecClick && onTestSpecClick(testSpec)}
    >
      <Code className={cn(
        "h-3 w-3", 
        isSelected ? "text-blue-600 dark:text-blue-300" : "text-blue-500 dark:text-blue-400"
      )} />
      <span>Writing Test Specification</span>
      {isSelected && (
        <span className="ml-1 px-1.5 py-0.5 bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-200 rounded-full text-[9px] font-medium">
          Active
        </span>
      )}
    </button>
  );
};

const markdownComponents = {
  table: ({node, ...props}: any) => <Table className="my-2 w-auto max-w-full text-xs border" {...props} />,
  thead: ({node, ...props}: any) => <TableHeader className="bg-muted/50" {...props} />,
  tbody: ({node, ...props}: any) => <TableBody {...props} />,
  tr: ({node, ...props}: any) => <TableRow {...props} />,
  th: ({node, ...props}: any) => <TableHead className="font-semibold px-3 py-1.5" {...props} />,
  td: ({node, ...props}: any) => <TableCell className="px-3 py-1.5" {...props} />,
  // Remove default p margins inside table cells for tighter layout
  p: ({node, ...props}: any) => {
    // A simple check, might need refinement if p tags are legitimately nested deeper in table cells.
    // This heuristic checks if the paragraph is a direct child of a table cell.
    const isDirectlyInTableCell = node?.parent?.type === 'tableCell';
    if (isDirectlyInTableCell) {
      return <span {...props} />;
    }
    return <p {...props} />;
  }
};

const formatMessage = (
  message: Message, 
  isCollapsed: boolean,
  onToggleCollapse: (messageId: string) => void,
  onTestSpecClick?: (testSpec: string) => void,
  isSelected: boolean = false,
  isMainChatTab: boolean = false
) => {
  if (typeof message.content === 'string') {
    if (message.type === 'ThoughtEvent') {
      // Check for tool calls in metadata if content is a string (summary)
      const toolCallsInThought = message.metadata?.tool_calls && Array.isArray(message.metadata.tool_calls)
        ? getToolNames(message.metadata.tool_calls)
        : [];
      
      return (
        <Collapsible 
          open={!isCollapsed} 
          className="w-full border border-blue-200 dark:border-blue-800 rounded-md overflow-hidden"
        >
          <CollapsibleTrigger 
            onClick={() => onToggleCollapse(message.id)}
            className="w-full flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
              <AlertCircle className="h-4 w-4" />
              <span>Thought Process</span>
              
              {toolCallsInThought.length > 0 && (
                <div className="flex items-center ml-2 text-yellow-600 dark:text-yellow-400 text-xs">
                  <Wrench className="h-3 w-3 mr-1" />
                  <span>Tools: {toolCallsInThought.join(', ')}</span>
                </div>
              )}
            </div>
            
            <div>
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="p-3 bg-blue-50/50 dark:bg-blue-950/50 text-sm">
            <div className="whitespace-pre-wrap">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{message.content}</ReactMarkdown>
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }
    
    const { modifiedContent, testSpecs } = processTestSpecContent(message.content, isMainChatTab);
    
    if (testSpecs.length > 0) {
      const parts = modifiedContent.split(/\{\{TEST_SPEC_PLACEHOLDER_(\d+)\}\}/);
      
      if (parts.length > 1) {
        return (
          <div>
            {parts.map((part, index) => {
              if (index % 2 === 0) {
                // Check if the part is a placeholder index, if so, it's handled by the `else` block.
                // This can happen if a placeholder is at the very start/end or adjacent.
                // The original logic for placeholder indices was `parts[index+1]`.
                // We only render markdown if `part` is not an empty string resulting from split.
                return part ? <ReactMarkdown key={index} remarkPlugins={[remarkGfm]} components={markdownComponents}>{part}</ReactMarkdown> : null;
              } 
              else {
                // `part` here is the placeholder index captured by the regex, e.g., "0", "1"
                const specIndex = parseInt(part, 10); 
                const testSpec = testSpecs[specIndex] || '';
                // The original code had `parts[index + 1]` to get specIndex, which seems incorrect
                // if `part` itself is the index. Correcting this.
                // The original split regex `\{\{TEST_SPEC_PLACEHOLDER_(\d+)\}\}` captures the digit.
                // `part` when index % 2 !== 0 will be the captured digit string.
                return <span key={index}>{renderTestSpecPlaceholder(testSpec, onTestSpecClick, isSelected)}</span>;
              }
            })}
          </div>
        );
      }
    }
    // Fallback for general string content if not a ThoughtEvent and no test specs were processed with placeholders
     return <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{message.content}</ReactMarkdown>;
  }
  
  if (message.hasTestSpec && !isMainChatTab) {
    const testSpecMarkers = {
      start: '<test_spec_start>',
      end: '<test_spec_end>'
    };
    
    let testSpec = '';
    if (typeof message.content === 'string') {
      const startIdx = message.content.indexOf(testSpecMarkers.start);
      const endIdx = message.content.indexOf(testSpecMarkers.end);
      
      if (startIdx !== -1 && endIdx !== -1) {
        testSpec = message.content.substring(
          startIdx + testSpecMarkers.start.length,
          endIdx
        ).trim();
      }
    }
    
    return (
      <div>
        {typeof message.content === 'string' ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{message.content.substring(0, message.content.indexOf('<test_spec_start>'))}</ReactMarkdown> : null}
        {renderTestSpecPlaceholder(testSpec, onTestSpecClick, isSelected)}
      </div>
    );
  }
  
  if (message.type === 'ToolCallRequestEvent') {
    const toolCalls = hasToolCalls(message.content) ? getToolNames(message.content) : [];
    const contentToDisplay = message.content;

    return (
      <Collapsible
        open={!isCollapsed}
        className="w-full border border-yellow-300 dark:border-yellow-700 rounded-md overflow-hidden"
      >
        <CollapsibleTrigger
          onClick={() => onToggleCollapse(message.id)} // onClick added here
          className="w-full flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-800/40 cursor-pointer"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-yellow-700 dark:text-yellow-300">
            <Wrench className="h-4 w-4" />
            <span>
              Tool Call Request: {toolCalls.length > 0 ? toolCalls.join(', ') : 'Details'}
            </span>
          </div>
          <div>
            {isCollapsed ? <ChevronDown className="h-4 w-4 text-yellow-700 dark:text-yellow-300" /> : <ChevronUp className="h-4 w-4 text-yellow-700 dark:text-yellow-300" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-3 bg-yellow-50/50 dark:bg-yellow-900/20 text-sm text-yellow-800 dark:text-yellow-200">
          <pre className="text-xs overflow-auto whitespace-pre-wrap">
            {JSON.stringify(contentToDisplay, null, 2)}
          </pre>
        </CollapsibleContent>
      </Collapsible>
    );
  }
  
  if (typeof message.content !== 'string') {
    if (Array.isArray(message.content)) {
      return (
        <div className="space-y-2 text-sm">
          {message.content.map((item, idx) => (
            <div key={idx} className="text-xs bg-muted/30 p-2 rounded">
              {JSON.stringify(item, null, 2)}
            </div>
          ))}
        </div>
      );
    }
    return (
      <pre className="text-xs overflow-auto whitespace-pre-wrap">
        {JSON.stringify(message.content, null, 2)}
      </pre>
    );
  }

  switch (message.source) {
    case 'yoda':
      return (
        <div className="font-serif italic text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{message.content as string}</ReactMarkdown>
        </div>
      );
    case 'system':
      return (
        <div className="text-amber-600 dark:text-amber-400 text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{message.content as string}</ReactMarkdown>
        </div>
      );
    case 'error':
    case 'assistant':
    default:
      return (
        <div className="text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{message.content as string}</ReactMarkdown>
        </div>
      );
  }
};

const getMessageStyle = (message: Message) => {
  if (message.isUser) {
    return "bg-primary text-primary-foreground py-2 px-3 rounded-lg";
  }
  
  if (message.type === 'error') {
    return "text-destructive";
  }
  
  return "";
};

const getMessageIcon = (message: Message) => {
  if (message.type === 'error') {
    return <AlertCircle className="h-4 w-4 text-destructive" />;
  }
  
  return null;
};

export default ChatMessage;
