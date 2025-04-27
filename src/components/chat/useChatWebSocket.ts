import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { ChatWebSocket } from '@/utils/api';
import { Message } from './types';

interface UseChatWebSocketProps {
  sessionId: string;
  testCaseId: string;
  initialMessages: Message[];
}

export const useChatWebSocket = ({
  sessionId,
  testCaseId,
  initialMessages = []
}: UseChatWebSocketProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reconnectCount, setReconnectCount] = useState(0);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const webSocketRef = useRef<ChatWebSocket | null>(null);
  const lastMessageRef = useRef<{content: string, source: string, timestamp: number} | null>(null);

  useEffect(() => {
    if (!sessionId || !testCaseId) {
      console.log('Missing sessionId or testCaseId');
      return;
    }
    
    console.log(`Initializing chat for session ${sessionId} and test case ${testCaseId}`);
    
    if (webSocketRef.current) {
      webSocketRef.current.disconnect();
    }
    
    const chatWs = new ChatWebSocket(sessionId, testCaseId);
    webSocketRef.current = chatWs;
    
    const messageCleanup = chatWs.onMessage((message) => {
      console.log('Received message:', message);
      
      // Skip empty messages
      if (typeof message.content === 'string' && message.content.trim() === '') {
        return;
      }
      
      // Check for duplicate messages (same content and close timing)
      const now = Date.now();
      const lastMsg = lastMessageRef.current;
      
      if (lastMsg && 
          lastMsg.content === message.content && 
          lastMsg.source === message.source &&
          now - lastMsg.timestamp < 2000) { // Within 2 seconds
        console.log('Skipping duplicate message:', message);
        return;
      }
      
      // Update last message reference
      lastMessageRef.current = {
        content: message.content,
        source: message.source || '',
        timestamp: now
      };
      
      const newMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: message.content,
        isUser: message.source === 'user',
        type: message.type,
        source: message.source || '',
        metadata: {},
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsLoading(false);

      if (message.type === 'error') {
        toast.error('Error from server: ' + message.content);
      }
    });
    
    const connectionCleanup = chatWs.onConnectionChange((connected) => {
      console.log(`Connection state changed to: ${connected}`);
      setIsConnected(connected);
      
      if (connected) {
        if (!isConnected) {
          toast.success('Connected to chat server');
        }
      } else {
        if (isConnected) {
          toast.error('Disconnected from chat server');
          setConnectionAttempts(prev => prev + 1);
        }
      }
    });
    
    const connectTimeout = setTimeout(() => {
      chatWs.connect();
    }, 300);
    
    return () => {
      clearTimeout(connectTimeout);
      messageCleanup();
      connectionCleanup();
      if (webSocketRef.current) {
        webSocketRef.current.disconnect();
        webSocketRef.current = null;
      }
    };
  }, [sessionId, testCaseId, reconnectCount, isConnected]);

  const sendMessage = (inputValue: string) => {
    if (!inputValue.trim()) return;
    
    // Create user message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: inputValue,
      isUser: true,
      source: 'user',
      type: 'text',
      timestamp: new Date(),
    };
    
    // Update last message reference to avoid duplication
    lastMessageRef.current = {
      content: inputValue,
      source: 'user',
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    
    if (webSocketRef.current && isConnected) {
      webSocketRef.current.sendMessage(inputValue);
    } else {
      toast.error('Not connected to chat server');
      setIsLoading(false);
      handleReconnect();
    }
  };

  const handleReconnect = () => {
    setReconnectCount(prev => prev + 1);
    toast.info('Attempting to reconnect...');
  };

  return {
    messages,
    isConnected,
    isLoading,
    sendMessage,
    handleReconnect,
    setMessages
  };
};
