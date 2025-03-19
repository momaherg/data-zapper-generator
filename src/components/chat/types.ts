
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
}
