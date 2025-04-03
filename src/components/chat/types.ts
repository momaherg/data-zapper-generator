export interface Message {
  id: string;
  content: string | any;
  isUser: boolean;
  source?: string;
  type?: string;
  metadata?: any;
  timestamp: Date;
  hasTestSpec?: boolean;
}

export interface ChatInterfaceProps {
  events: any[];
  sessionId: string;
  testCaseId: string;
  onTestSpecUpdated?: (testSpec: string) => void;
  chatWidth?: number;
  onResizeChat?: (direction: 'increase' | 'decrease') => void;
  minChatWidth?: number;
  maxChatWidth?: number;
}

export interface TestSpecUpdateOptions {
  isAutomatic?: boolean;
  isUserSelected?: boolean;
  messageId?: string;
}
