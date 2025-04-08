// Update the API types to handle NodeJS references
import { Component, ComponentConfig } from "../components/studio/datamodel";

// Mock timeout
export const mockTimeout = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// DataSource interface
export interface DataSource {
  id: string;
  path: string;
  type: string;
  description: string;
  usage: string;
  timestamp: Date;
}

// Tool interface
export interface Tool {
  id: string;
  name: string;
  description: string;
  provider: string;
  type: string;
  parameters: Array<{
    name: string;
    type: string;
    description: string;
    required: boolean;
    defaultValue?: string;
  }>;
  usage_examples: string[];
  created_at: Date;
  updated_at: Date;
}

// TestCase interface
export interface TestCase {
  id: string;
  name: string;
  description: string;
  requirement: string;
  format?: string;
  notes?: string;
  test_plan?: string;
  test_scenarios?: Array<{
    id: string;
    description: string;
    steps: string[];
  }>;
  status: "pending" | "completed" | "in_progress";
  created_at: Date;
  updated_at: Date;
}

// Mock API for data sources
export const dataSourceAPI = {
  // Add your mock API functions here
  // ...
};

// Mock API for tools
export const toolAPI = {
  // Add your mock API functions here
  // ...
};

// Mock API for test cases
export const testCaseAPI = {
  // Add your mock API functions here
  // ...
};

// Chat WebSocket for real-time messaging
export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private sessionId: string;
  private testCaseId: string;
  private messageListeners: ((message: any) => void)[] = [];
  private connectionListeners: ((isConnected: boolean) => void)[] = [];
  private reconnectTimer: number | null = null;
  private connectionAttempts = 0;

  constructor(sessionId: string, testCaseId: string) {
    this.sessionId = sessionId;
    this.testCaseId = testCaseId;
  }

  public connect() {
    try {
      const wsUrl = `wss://example.com/api/ws/chat?session_id=${this.sessionId}&test_case_id=${this.testCaseId}`;
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        this.connectionAttempts = 0;
        this.notifyConnectionChange(true);
        console.log("WebSocket connected");
      };
      
      this.ws.onclose = () => {
        this.notifyConnectionChange(false);
        console.log("WebSocket closed");
        
        // Try to reconnect with exponential backoff
        this.connectionAttempts++;
        const backoffTime = Math.min(30000, Math.pow(2, this.connectionAttempts) * 1000);
        
        this.reconnectTimer = window.setTimeout(() => {
          console.log(`Attempting to reconnect (${this.connectionAttempts})...`);
          this.connect();
        }, backoffTime);
      };
      
      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
      this.notifyConnectionChange(false);
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  public sendMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: "message",
        content: message,
        source: "user"
      }));
    } else {
      console.error("WebSocket not connected");
    }
  }

  public onMessage(callback: (message: any) => void) {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter(listener => listener !== callback);
    };
  }

  public onConnectionChange(callback: (isConnected: boolean) => void) {
    this.connectionListeners.push(callback);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(listener => listener !== callback);
    };
  }

  private notifyMessage(message: any) {
    this.messageListeners.forEach(listener => listener(message));
  }

  private notifyConnectionChange(isConnected: boolean) {
    this.connectionListeners.forEach(listener => listener(isConnected));
  }
}
