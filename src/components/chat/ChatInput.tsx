
import React, { useRef } from 'react';
import { Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  isConnected: boolean;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  handleSendMessage,
  isConnected,
  isLoading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
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
  );
};

export default ChatInput;
