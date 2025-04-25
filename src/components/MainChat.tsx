
import React from 'react';
import ChatInterface from './ChatInterface';

interface MainChatProps {
  sessionId: string;
}

const MainChat: React.FC<MainChatProps> = ({ sessionId }) => {
  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <ChatInterface 
        events={[]} 
        sessionId={sessionId} 
        testCaseId="main_chat"
      />
    </div>
  );
};

export default MainChat;
