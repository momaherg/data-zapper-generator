
import React from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Wrench } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
  collapsedState: boolean;
  onToggleCollapse: (messageId: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  collapsedState,
  onToggleCollapse,
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
        <div>{formatMessage(message, collapsedState, onToggleCollapse)}</div>
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

// Helper to detect if a message has tool calls
const hasToolCalls = (content: any): boolean => {
  if (!content) return false;
  
  if (Array.isArray(content)) {
    return content.some(item => item.name && typeof item.name === 'string');
  }
  
  return false;
};

// Extract tool names from content
const getToolNames = (content: any): string[] => {
  if (!content || !Array.isArray(content)) return [];
  
  return content
    .filter(item => item.name && typeof item.name === 'string')
    .map(item => item.name);
};

const formatMessage = (
  message: Message, 
  isCollapsed: boolean,
  onToggleCollapse: (messageId: string) => void
) => {
  // For ThoughtEvent with tool calls, create a collapsible section
  if (message.type === 'ThoughtEvent') {
    const toolCalls = hasToolCalls(message.content) ? getToolNames(message.content) : [];
    
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
            
            {toolCalls.length > 0 && (
              <div className="flex items-center ml-2 text-yellow-600 dark:text-yellow-400 text-xs">
                <Wrench className="h-3 w-3 mr-1" />
                <span>Tools: {toolCalls.join(', ')}</span>
              </div>
            )}
          </div>
          
          <div>
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="p-3 bg-blue-50/50 dark:bg-blue-950/50 text-sm">
          <div className="whitespace-pre-wrap">
            {typeof message.content === 'string' 
              ? <ReactMarkdown>{message.content}</ReactMarkdown>
              : JSON.stringify(message.content, null, 2)}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }
  
  // For tool call events, display a simple indicator
  if (message.type === 'ToolCallRequestEvent') {
    const toolCalls = hasToolCalls(message.content) ? getToolNames(message.content) : [];
    
    return (
      <div className="flex items-center text-yellow-700 dark:text-yellow-300 text-sm">
        <Wrench className="h-4 w-4 mr-2" />
        <span>
          Requesting tools: {toolCalls.length > 0 
            ? toolCalls.join(', ')
            : typeof message.content === 'string'
              ? message.content
              : JSON.stringify(message.content)}
        </span>
      </div>
    );
  }
  
  // Handle different content types
  if (typeof message.content !== 'string') {
    // Handle JSON or array content
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

  // Handle different message sources
  switch (message.source) {
    case 'yoda':
      return (
        <div className="font-serif italic text-sm">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      );
    case 'system':
      return (
        <div className="text-amber-600 dark:text-amber-400 text-sm">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      );
    case 'error':
    case 'assistant':
    default:
      return (
        <div className="text-sm">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      );
  }
};

const getMessageStyle = (message: Message) => {
  // Only user messages get the bubble style
  if (message.isUser) {
    return "bg-primary text-primary-foreground py-2 px-3 rounded-lg";
  }
  
  // Error messages get a special style
  if (message.type === 'error') {
    return "text-destructive";
  }
  
  // All other messages get a minimal style
  return "";
};

const getMessageIcon = (message: Message) => {
  if (message.type === 'error') {
    return <AlertCircle className="h-4 w-4 text-destructive" />;
  }
  
  return null;
};

export default ChatMessage;
