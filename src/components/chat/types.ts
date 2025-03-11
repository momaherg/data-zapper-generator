
import { TestCaseEvent } from '@/utils/api';

export interface Message {
  id: string;
  content: string | any;
  isUser: boolean;
  type?: string;
  source?: string;
  metadata?: any;
  timestamp: Date;
}

export interface ChatInterfaceProps {
  events: TestCaseEvent[];
  sessionId: string;
  testCaseId: string;
}
