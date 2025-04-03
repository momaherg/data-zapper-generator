
import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
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
  
  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);
  
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
          placeholder="Type a message... (Shift+Enter for new line)" 
          className="resize-none min-h-[60px] max-h-[120px] flex-1" 
          rows={2} 
          disabled={!isConnected || isLoading} 
        />
        <Button 
          type="button" 
          size="icon" 
          onClick={handleSendMessage} 
          disabled={!inputValue.trim() || !isConnected || isLoading}
          className="self-end h-10 w-10 transition-all active:scale-95 focus:ring-2 focus:ring-primary/50"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
