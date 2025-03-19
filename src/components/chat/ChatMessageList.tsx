
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import { Message } from './types';

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  collapsedStates: Record<string, boolean>;
  onToggleCollapse: (messageId: string) => void;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  onTestSpecFound?: (testSpec: string) => void;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isLoading,
  collapsedStates,
  onToggleCollapse,
  scrollAreaRef,
  onTestSpecFound
}) => {
  // Extract test spec from messages when they change
  useEffect(() => {
    if (!onTestSpecFound || messages.length === 0) return;
    
    // Process all messages to find test specifications
    const testSpecMarkers = {
      start: '<test_spec_start>',
      end: '<test_spec_end>'
    };
    
    // Find the last message with a test spec
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      
      if (typeof message.content === 'string') {
        // Check if message contains test specification
        const startIdx = message.content.lastIndexOf(testSpecMarkers.start);
        const endIdx = message.content.lastIndexOf(testSpecMarkers.end);
        
        if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
          const testSpecContent = message.content.substring(
            startIdx + testSpecMarkers.start.length,
            endIdx
          ).trim();
          
          // Notify parent component about the test spec
          onTestSpecFound(testSpecContent);
          break;
        }
      }
    }
  }, [messages, onTestSpecFound]);

  // Filter out the message types we want to hide and deduplicate messages
  const dedupedMessages = messages.reduce<Message[]>((acc, message, index) => {
    // Skip certain message types
    if (message.type === 'ToolCallExecutionEvent' || 
        message.type === 'ToolCallSummaryMessage' || 
        message.type === 'HandoffMessage') {
      return acc;
    }
    
    // Skip empty messages
    if (typeof message.content === 'string' && message.content.trim() === '') {
      return acc;
    }
    
    // Check for duplicates (same content, source and close timestamp)
    const isDuplicate = acc.some(existingMsg => {
      // If message content, source and user flag match
      if (existingMsg.content === message.content && 
          existingMsg.source === message.source &&
          existingMsg.isUser === message.isUser) {
        // Check if timestamps are close (within 2 seconds)
        const timeDiff = Math.abs(existingMsg.timestamp.getTime() - message.timestamp.getTime());
        return timeDiff < 2000; // 2 seconds threshold
      }
      return false;
    });
    
    if (!isDuplicate) {
      // Process message for hasTestSpec flag, but keep the original content intact
      if (typeof message.content === 'string') {
        const testSpecMarkers = {
          start: '<test_spec_start>',
          end: '<test_spec_end>'
        };
        
        // Check if message contains test specification
        if (message.content.includes(testSpecMarkers.start) && 
            message.content.includes(testSpecMarkers.end)) {
          const messageWithTestSpecFlag = {
            ...message,
            hasTestSpec: true
          };
          acc.push(messageWithTestSpecFlag);
          return acc;
        }
      }
      
      // Regular message processing
      acc.push(message);
    }
    
    return acc;
  }, []);

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
      <div className="space-y-4">
        {dedupedMessages.map(message => (
          <ChatMessage
            key={message.id}
            message={message}
            collapsedState={collapsedStates[message.id] !== false} // Default to collapsed
            onToggleCollapse={onToggleCollapse}
          />
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
  );
};

export default ChatMessageList;
