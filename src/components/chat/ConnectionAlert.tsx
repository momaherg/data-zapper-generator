
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ConnectionAlertProps {
  isConnected: boolean;
}

const ConnectionAlert: React.FC<ConnectionAlertProps> = ({ isConnected }) => {
  if (isConnected) return null;
  
  return (
    <Alert variant="destructive" className="mx-4 my-2 py-2">
      <AlertTitle>Connection Lost</AlertTitle>
      <AlertDescription>
        You're currently disconnected from the chat server. Please click the reconnect button above.
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionAlert;
