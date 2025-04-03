
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  isConnected: boolean;
  onReconnect: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isConnected, onReconnect }) => {
  return (
    <div className="px-4 py-3 border-b flex items-center justify-between bg-card">
      <h3 className="text-sm font-medium">Assistant</h3>
      <div className="flex items-center gap-2">
        {isConnected ? (
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 flex gap-1 items-center">
            <Wifi className="h-3 w-3" />
            <span>Connected</span>
          </Badge>
        ) : (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 flex gap-1 items-center">
              <WifiOff className="h-3 w-3" />
              <span>Disconnected</span>
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 px-2 py-1 text-xs" 
              onClick={onReconnect}
            >
              Reconnect
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
