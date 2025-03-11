import React, { useState, useRef, useEffect } from 'react';
import { Send, ThumbsUp, ThumbsDown, Loader2, AlertCircle, AlertTriangle, ChevronDown, ChevronUp, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { TestCaseEvent, ChatMessage, ChatWebSocket } from '@/utils/api';

interface Message {
  id: string;
  content: string | any;
  isUser: boolean;
  type?: string;
  source?: string;
  metadata?: any;
  timestamp: Date;
}

interface ChatInterfaceProps {
  events: TestCaseEvent[];
  sessionId: string;
  testCaseId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  events,
  sessionId,
  testCaseId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reconnectCount, setReconnectCount] = useState(0);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const webSocketRef = useRef<ChatWebSocket | null>(null);
  
  // Store collapsed state for thought events with tool calls
  const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>({});

  const toggleCollapse = (messageId: string) => {
    setCollapsedStates(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };
  
  useEffect(() => {
    if (!events || events.length === 0) return;
    
    console.log('Processing initial events:', events);
    
    const initialMessages: Message[] = [];
    
    // Process the events array which contains the full chat history
    events.forEach((event, index) => {
      // Check if the event has a source property (enriched event format)
      if ('source' in event) {
        const enrichedEvent = event as any;
        let content = enrichedEvent.content;
        
        initialMessages.push({
          id: `event-${index}-${Date.now()}`,
          content: content,
          isUser: enrichedEvent.source === 'user',
          type: enrichedEvent.type || 'text',
          source: enrichedEvent.source,
          metadata: enrichedEvent.metadata || {},
          timestamp: new Date(enrichedEvent.timestamp || Date.now()),
        });
      } else {
        // Handle the simple event format
        initialMessages.push({
          id: `event-${index}-${Date.now()}`,
          content: `${event.type}: ${event.description}`,
          isUser: false,
          source: 'system',
          type: 'event',
          timestamp: new Date(),
        });
      }
    });
    
    console.log('Processed initial messages:', initialMessages);
    setMessages(initialMessages);
  }, [events]);

  useEffect(() => {
    if (!sessionId || !testCaseId) {
      console.log('Missing sessionId or testCaseId');
      return;
    }
    
    console.log(`Initializing chat for session ${sessionId} and test case ${testCaseId}`);
    
    if (webSocketRef.current) {
      webSocketRef.current.disconnect();
    }
    
    const chatWs = new ChatWebSocket(sessionId, testCaseId);
    webSocketRef.current = chatWs;
    
    const messageCleanup = chatWs.onMessage((message) => {
      console.log('Received message:', message);
      
      const newMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: message.content,
        isUser: message.source === 'user',
        type: message.type,
        source: message.source,
        metadata: message.metadata,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsLoading(false);

      if (message.type === 'error') {
        toast.error('Error from server: ' + message.content);
      }
    });
    
    const connectionCleanup = chatWs.onConnectionChange((connected) => {
      console.log(`Connection state changed to: ${connected}`);
      setIsConnected(connected);
      
      if (connected) {
        if (!isConnected) {
          toast.success('Connected to chat server');
        }
      } else {
        if (isConnected) {
          toast.error('Disconnected from chat server');
          setConnectionAttempts(prev => prev + 1);
        }
      }
    });
    
    const connectTimeout = setTimeout(() => {
      chatWs.connect();
    }, 300);
    
    return () => {
      clearTimeout(connectTimeout);
      messageCleanup();
      connectionCleanup();
      if (webSocketRef.current) {
        webSocketRef.current.disconnect();
        webSocketRef.current = null;
      }
    };
  }, [sessionId, testCaseId, reconnectCount]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: inputValue,
      isUser: true,
      source: 'user',
      type: 'text',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);
    
    if (webSocketRef.current && isConnected) {
      webSocketRef.current.sendMessage(inputValue);
    } else {
      toast.error('Not connected to chat server');
      setIsLoading(false);
      
      handleReconnect();
    }
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleReconnect = () => {
    setReconnectCount(prev => prev + 1);
    toast.info('Attempting to reconnect...');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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

  const formatMessage = (message: Message) => {
    // For ThoughtEvent with tool calls, create a collapsible section
    if (message.type === 'ThoughtEvent') {
      const isCollapsed = collapsedStates[message.id] !== false; // Default to collapsed
      const toolCalls = hasToolCalls(message.content) ? getToolNames(message.content) : [];
      
      return (
        <Collapsible 
          open={!isCollapsed} 
          className="w-full border border-blue-200 dark:border-blue-800 rounded-md overflow-hidden"
        >
          <CollapsibleTrigger 
            onClick={() => toggleCollapse(message.id)}
            className="w-full flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
              <AlertTriangle className="h-4 w-4" />
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
                ? message.content 
                : JSON.stringify(message.content, null, 2)}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }
    
    // For tool call events, display a simple indicator
    if (message.type === 'ToolCallRequestEvent' || message.type === 'ToolCallExecutionEvent' || message.type === 'ToolCallSummaryMessage') {
      const toolCalls = hasToolCalls(message.content) ? getToolNames(message.content) : [];
      
      return (
        <div className="flex items-center text-yellow-700 dark:text-yellow-300 text-sm">
          <Wrench className="h-4 w-4 mr-2" />
          <span>
            {message.type === 'ToolCallRequestEvent' && 'Requesting tools: '}
            {message.type === 'ToolCallExecutionEvent' && 'Executing tools: '}
            {message.type === 'ToolCallSummaryMessage' && 'Tool execution summary: '}
            {toolCalls.length > 0 
              ? toolCalls.join(', ')
              : typeof message.content === 'string'
                ? message.content
                : JSON.stringify(message.content)}
          </span>
        </div>
      );
    }
    
    // For handoff messages
    if (message.type === 'HandoffMessage') {
      return (
        <div className="text-purple-700 dark:text-purple-300 text-sm">
          {typeof message.content === 'string' ? message.content : JSON.stringify(message.content, null, 2)}
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
            {message.content}
          </div>
        );
      case 'system':
        return (
          <div className="text-amber-600 dark:text-amber-400 text-sm">
            {message.content}
          </div>
        );
      case 'error':
      case 'assistant':
      default:
        return (
          <div className="text-sm">
            {message.content}
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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">AI Assistant</h3>
          {isConnected ? (
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Connected
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-600 dark:text-red-400">Disconnected</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-6 text-xs" 
                onClick={handleReconnect}
              >
                Reconnect
              </Button>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Ask questions or request changes to the test case
        </p>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
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
                <div>{formatMessage(message)}</div>
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
          ))}
          
          {isLoading && (
            <div className="flex animate-fade-up">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {!isConnected && (
        <Alert variant="destructive" className="mx-4 my-2 py-2">
          <AlertTitle>Connection Lost</AlertTitle>
          <AlertDescription>
            You're currently disconnected from the chat server. Please click the reconnect button above.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="px-4 py-3 border-t">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="resize-none min-h-[40px] max-h-[120px]"
            rows={1}
            disabled={!isConnected || isLoading}
          />
          <Button
            type="button"
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !isConnected || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-end gap-2 mt-2">
          <div className="text-xs text-muted-foreground mr-2">
            Helpful?
          </div>
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ThumbsUp className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ThumbsDown className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
