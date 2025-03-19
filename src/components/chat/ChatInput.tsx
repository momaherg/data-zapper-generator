
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
  isLoading
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
          onChange={e => setInputValue(e.target.value)} 
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
          className="transition-all active:scale-95 focus:ring-2 focus:ring-primary/50"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
