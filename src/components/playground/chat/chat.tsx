
import React, { useState } from "react";
import { Session } from "../../studio/datamodel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatViewProps {
  session: Session;
}

const ChatView: React.FC<ChatViewProps> = ({ session }) => {
  const [chatWidth, setChatWidth] = useState<number>(320); // Default width
  const minWidth = 280;
  const maxWidth = 600;

  const handleResize = (direction: 'increase' | 'decrease') => {
    setChatWidth(prev => {
      const step = 40;
      if (direction === 'increase') {
        return Math.min(prev + step, maxWidth);
      } else {
        return Math.max(prev - step, minWidth);
      }
    });
  };

  return (
    <div className="h-full flex flex-col" style={{ width: `${chatWidth}px` }}>
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">Chat: {session.name}</h3>
      </div>
      
      {/* Move the resize controls below the header */}
      <div className="flex justify-center gap-2 py-1 px-2 border-b">
        <Button 
          variant="ghost" 
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => handleResize('decrease')}
          disabled={chatWidth <= minWidth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground">
          Width: {chatWidth}px
        </span>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => handleResize('increase')}
          disabled={chatWidth >= maxWidth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <p className="text-gray-500 text-center my-4">Chat messages will appear here</p>
      </div>
      <div className="border-t p-4">
        <Textarea
          className="w-full p-2 border rounded resize-none min-h-[60px]"
          placeholder="Type a message... (Shift+Enter for new line)"
          rows={3}
          disabled
        />
      </div>
    </div>
  );
};

export default ChatView;
