
import React from 'react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  isConnected: boolean;
  onReconnect: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isConnected, onReconnect }) => {
  return (
    <div className="px-4 py-3 border-b">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">AI Assistant</h3>
        {isConnected ? (
          <div className="flex items-center text-xs text-green-600 dark:text-green-400">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Connected
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-600 dark:text-red-400">Disconnected</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-6 text-xs" 
              onClick={onReconnect}
            >
              Reconnect
            </Button>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Ask questions or request changes to the test case
      </p>
    </div>
  );
};

export default ChatHeader;
