import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatInterfaceProps } from './chat/types';
import ChatHeader from './chat/ChatHeader';
import ChatMessageList from './chat/ChatMessageList';
import ChatInput from './chat/ChatInput';
import ConnectionAlert from './chat/ConnectionAlert';
import { useChatWebSocket } from './chat/useChatWebSocket';

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  events,
  sessionId,
  testCaseId,
  onTestSpecUpdated,
}) => {
  const [inputValue, setInputValue] = useState('');
  // Store collapsed state for thought events with tool calls
  const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  // Track whether user has manually selected a test spec
  const [userSelectedTestSpec, setUserSelectedTestSpec] = useState(false);
  // Track which message ID contains the currently selected test spec
  const [selectedTestSpecMessageId, setSelectedTestSpecMessageId] = useState<string | undefined>(undefined);
  
  // Process initial events
  useEffect(() => {
    if (!events || events.length === 0) return;
    
    console.log('Processing initial events:', events);
    
    const processedMessages: Message[] = [];
    const seenContentMap = new Map<string, boolean>();
    
    // Process the events array which contains the full chat history
    events.forEach((event, index) => {
      // Check if the event has a source property (enriched event format)
      if ('source' in event) {
        const enrichedEvent = event as any;
        let content = enrichedEvent.content;
        
        // Skip empty content
        if (typeof content === 'string' && content.trim() === '') {
          return;
        }
        
        // Skip message types we want to hide
        if (enrichedEvent.type === 'ToolCallExecutionEvent' ||
            enrichedEvent.type === 'ToolCallSummaryMessage' ||
            enrichedEvent.type === 'HandoffMessage') {
          return;
        }
        
        // Create a key for deduplication
        const dedupKey = `${enrichedEvent.source}-${JSON.stringify(content)}`;
        
        // Skip duplicates
        if (seenContentMap.has(dedupKey)) {
          return;
        }
        seenContentMap.set(dedupKey, true);
        
        // Check if message contains test specification
        let hasTestSpec = false;
        if (typeof content === 'string') {
          const testSpecMarkers = {
            start: '<test_spec_start>',
            end: '<test_spec_end>'
          };
          if (content.includes(testSpecMarkers.start) && content.includes(testSpecMarkers.end)) {
            hasTestSpec = true;
          }
        }
        
        processedMessages.push({
          id: `event-${index}-${Date.now()}`,
          content: content,
          isUser: enrichedEvent.source === 'user',
          type: enrichedEvent.type || 'text',
          source: enrichedEvent.source,
          metadata: enrichedEvent.metadata || {},
          timestamp: new Date(enrichedEvent.timestamp || Date.now()),
          hasTestSpec: hasTestSpec
        });
      } else {
        // Handle the simple event format
        const dedupKey = `system-${event.type}-${event.description}`;
        
        // Skip duplicates
        if (seenContentMap.has(dedupKey)) {
          return;
        }
        seenContentMap.set(dedupKey, true);
        
        processedMessages.push({
          id: `event-${index}-${Date.now()}`,
          content: `${event.type}: ${event.description}`,
          isUser: false,
          source: 'system',
          type: 'event',
          timestamp: new Date(),
        });
      }
    });
    
    console.log('Processed initial messages:', processedMessages);
    setInitialMessages(processedMessages);
  }, [events]);
  
  const {
    messages,
    isConnected,
    isLoading,
    sendMessage,
    handleReconnect,
    setMessages
  } = useChatWebSocket({
    sessionId,
    testCaseId,
    initialMessages
  });

  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages, setMessages]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    sendMessage(inputValue);
    setInputValue('');
  };

  const toggleCollapse = (messageId: string) => {
    setCollapsedStates(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const handleTestSpecFound = (testSpec: string, options?: { isAutomatic?: boolean, messageId?: string }) => {
    if (onTestSpecUpdated && (!userSelectedTestSpec || !options?.isAutomatic)) {
      onTestSpecUpdated(testSpec);
      
      // If this is an automatic update (not from user click), track it
      if (options?.isAutomatic) {
        setUserSelectedTestSpec(false);
        if (options?.messageId) {
          setSelectedTestSpecMessageId(options.messageId);
        }
      }
    }
  };

  const handleTestSpecClick = (testSpec: string, options?: { isUserSelected?: boolean, messageId?: string }) => {
    if (onTestSpecUpdated) {
      onTestSpecUpdated(testSpec);
      
      // Mark that the user has manually selected a test spec
      if (options?.isUserSelected) {
        setUserSelectedTestSpec(true);
        if (options?.messageId) {
          setSelectedTestSpecMessageId(options.messageId);
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ChatHeader 
        isConnected={isConnected} 
        onReconnect={handleReconnect} 
      />
      
      <ChatMessageList 
        messages={messages}
        isLoading={isLoading}
        collapsedStates={collapsedStates}
        onToggleCollapse={toggleCollapse}
        scrollAreaRef={scrollAreaRef}
        onTestSpecFound={handleTestSpecFound}
        onTestSpecClick={handleTestSpecClick}
        selectedTestSpecMessageId={selectedTestSpecMessageId}
      />
      
      <ConnectionAlert isConnected={isConnected} />
      
      <ChatInput 
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
        isConnected={isConnected}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatInterface;
