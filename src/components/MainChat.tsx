
import React, { useEffect, useState } from 'react';
import ChatInterface from './ChatInterface';
import { api } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface MainChatProps {
  sessionId: string;
}

const MainChat: React.FC<MainChatProps> = ({ sessionId }) => {
  const [events, setEvents] = useState<any[]>([]);
  const testCaseId = "main_chat"; // This is the fixed test case ID for the main chat

  useEffect(() => {
    // Fetch the main_chat test case to get the events history
    if (sessionId) {
      api.getTestCase(sessionId, testCaseId)
        .then(response => {
          if (response && response.events) {
            setEvents(response.events);
          }
        })
        .catch(error => {
          console.error("Error fetching chat history:", error);
        });
    }
  }, [sessionId]);

  const handleClearChat = async () => {
    try {
      await fetch(`http://localhost:5000/api/test-cases/reset/${testCaseId}?session_id=${sessionId}`, {
        method: 'PATCH'
      });
      setEvents([]);
      toast.success('Chat history cleared');
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast.error('Failed to clear chat history');
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <div className="flex justify-end p-2 border-b">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearChat}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear Chat
        </Button>
      </div>
      <div className="h-[calc(100%-3rem)]">
        <ChatInterface 
          events={events} 
          sessionId={sessionId} 
          testCaseId={testCaseId}
        />
      </div>
    </div>
  );
};

export default MainChat;
