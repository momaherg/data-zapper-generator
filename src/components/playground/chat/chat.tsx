
import React from "react";
import { Session } from "../../studio/datamodel";

interface ChatViewProps {
  session: Session;
}

const ChatView: React.FC<ChatViewProps> = ({ session }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Chat Session: {session.name}</h3>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <p className="text-gray-500 text-center my-4">Chat messages will appear here</p>
      </div>
      <div className="border-t p-4">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Type a message..."
          disabled
        />
      </div>
    </div>
  );
};

export default ChatView;
