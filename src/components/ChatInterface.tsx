
import React, { useState, useRef, useEffect } from 'react';
import { Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { TestCaseEvent } from '@/utils/api';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  events: TestCaseEvent[];
  onSendMessage?: (message: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  events,
  onSendMessage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Convert events to messages for initial display
  useEffect(() => {
    const initialMessages = events.map((event, index) => ({
      id: `event-${index}`,
      content: `${event.type}: ${event.description}`,
      isUser: false,
      timestamp: new Date(),
    }));
    
    setMessages(initialMessages);
  }, [events]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: inputValue,
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');
      
      if (onSendMessage) {
        onSendMessage(inputValue);
      }
      
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b">
        <h3 className="font-medium">AI Assistant</h3>
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
                  message.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <div className="space-y-1">
                  <div>{message.content}</div>
                  <div className="text-[10px] opacity-70 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>
      
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
          />
          <Button
            type="button"
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
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
