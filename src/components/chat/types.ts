export interface Message {
  id: string;
  timestamp: Date;
  isUser: boolean;
  content: string | any | any[]; // Can be string, JSON object, or array of JSON objects
  source?: string; // e.g., 'yoda', 'system', 'assistant'
  type?: 'text' | 'error' | 'ToolCallRequestEvent' | 'ToolCallResultEvent' | 'ThoughtEvent' | 'ToolInputEvent' | 'ToolOutputEvent';
  isLoading?: boolean;
  hasTestSpec?: boolean;
  testSpecContent?: string;
  metadata?: Record<string, any>; // Added metadata property
}
