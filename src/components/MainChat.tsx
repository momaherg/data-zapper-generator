
import React, { useEffect, useState } from 'react';
import ChatInterface from './ChatInterface';
import { api } from '@/utils/api';

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

  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <ChatInterface 
        events={events} 
        sessionId={sessionId} 
        testCaseId={testCaseId}
      />
    </div>
  );
};

export default MainChat;
