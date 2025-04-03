
export interface ChatMessage {
  id?: string;
  session_id?: string;
  content: string;
  type: string;
  source: 'user' | 'assistant' | 'system';
  timestamp?: string;
  metadata?: any;
}
