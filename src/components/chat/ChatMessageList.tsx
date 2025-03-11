
import React from 'react';
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
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isLoading,
  collapsedStates,
  onToggleCollapse,
  scrollAreaRef
}) => {
  // Filter out the message types we want to hide
  const shouldShowMessage = (message: Message): boolean => {
    if (message.type === 'ToolCallExecutionEvent' || 
        message.type === 'ToolCallSummaryMessage' || 
        message.type === 'HandoffMessage') {
      return false;
    }
    return true;
  };

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
      <div className="space-y-4">
        {messages.filter(shouldShowMessage).map(message => (
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
