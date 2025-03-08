import React, { useState, useRef, useEffect } from 'react';
import { Send, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { TestCaseEvent, ChatMessage, ChatWebSocket } from '@/utils/api';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  type?: string;
  source?: string;
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
  
  useEffect(() => {
    if (!events || events.length === 0) return;
    
    const initialMessages = events
      .filter(event => event.type && event.description) // Filter out invalid events
      .map((event, index) => ({
        id: `event-${index}`,
        content: `${event.type}: ${event.description}`,
        isUser: false,
        source: 'system',
        type: 'event',
        timestamp: new Date(),
      }));
    
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

  const formatMessage = (message: Message) => {
    switch (message.source) {
      case 'yoda':
        return (
          <div className="font-serif italic">
            {message.content}
          </div>
        );
      case 'system':
        return (
          <div className="text-amber-600 dark:text-amber-400">
            {message.content}
          </div>
        );
      case 'assistant':
      case 'user':
      default:
        return message.content;
    }
  };

  const getMessageStyle = (message: Message) => {
    if (message.isUser) {
      return "bg-primary text-primary-foreground";
    }
    
    switch (message.source) {
      case 'system':
        return "bg-muted/80 border border-muted";
      case 'yoda':
        return "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200";
      case 'assistant':
      default:
        return "bg-muted";
    }
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
                "flex max-w-[80%] animate-fade-up",
                message.isUser ? "ml-auto" : "mr-auto"
              )}
            >
              <Card
                className={cn(
                  "px-3 py-2 text-sm",
                  getMessageStyle(message)
                )}
              >
                <div className="space-y-1">
                  <div>{formatMessage(message)}</div>
                  <div className="text-[10px] opacity-70 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </Card>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex max-w-[80%] mr-auto animate-fade-up">
              <Card className="px-3 py-2 text-sm bg-muted">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Thinking...</span>
                </div>
              </Card>
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
