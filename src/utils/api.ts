// Environment-aware configuration
const getApiConfig = () => {
  // In production, use relative paths that will be correctly routed by the ingress
  if (process.env.NODE_ENV === 'production') {
    return {
      API_BASE_URL: '/api',
      WS_BASE_URL: window.location.protocol === 'https:' ? 'wss://' + window.location.host : 'ws://' + window.location.host
    };
  }
  
  // In development, use localhost with specific ports
  return {
    API_BASE_URL: 'http://localhost:5000/api',
    WS_BASE_URL: 'ws://localhost:5000/ws'
  };
};

const { API_BASE_URL, WS_BASE_URL } = getApiConfig();

// Interface definitions
export interface DataSource {
  id: string;
  type: string;
  path: string;
  tool: string | null;
  description: string;
  usage: string;
  created_at: string;
  updated_at: string;
}

export interface TestCase {
  id: string;
  requirement: string;
  format: string;
  notes: string;
  test_case_text: string;
  events: TestCaseEvent[];
  created_at: string;
}

export interface TestCaseEvent {
  type: string;
  description: string;
  dataSourceId?: string;
  content?: string;
  source?: string;
  timestamp?: string;
  metadata?: any;
}

export interface ChatMessage {
  session_id: string;
  id: string;
  content: string;
  type: string;
  source: string;
  timestamp?: string;
}

export interface TestCaseGenerationRequest {
  dataSourceIds: string[];
  requirement: string;
  format: string;
  notes: string;
}

// Helper function to extract test case from events
export const extractTestCaseFromEvents = (events: TestCaseEvent[]): string => {
  if (!events || events.length === 0) return '';
  
  let testCaseText = '';
  const marker = {
    start: '<test_spec_start>',
    end: '<test_spec_end>'
  };
  
  // Iterate through events in reverse to find the most recent test case
  for (let i = events.length - 1; i >= 0; i--) {
    const event = events[i];
    
    // Check if event has content property
    if (event.content && typeof event.content === 'string') {
      const content = event.content;
      const startIdx = content.lastIndexOf(marker.start);
      const endIdx = content.lastIndexOf(marker.end);
      
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        // Extract text between markers using lastIndexOf to get the last occurrence
        testCaseText = content.substring(
          startIdx + marker.start.length,
          endIdx
        ).trim();
        break; // Found the most recent test case
      }
    } else if (event.description && typeof event.description === 'string') {
      // Check in description field
      const description = event.description;
      const startIdx = description.lastIndexOf(marker.start);
      const endIdx = description.lastIndexOf(marker.end);
      
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        // Extract text between markers using lastIndexOf to get the last occurrence
        testCaseText = description.substring(
          startIdx + marker.start.length,
          endIdx
        ).trim();
        break; // Found the most recent test case
      }
    }
  }
  
  return testCaseText;
};

// Helper function to add session_id parameter to URLs
const withSession = (url: string, sessionId: string) => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}session_id=${sessionId}`;
};

// WebSocket Chat connection
export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private sessionId: string;
  private testCaseId: string;
  private messageHandlers: ((message: ChatMessage) => void)[] = [];
  private connectionHandlers: ((connected: boolean) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private intentionalDisconnect = false;
  private pingInterval: NodeJS.Timeout | null = null;

  constructor(sessionId: string, testCaseId: string) {
    this.sessionId = sessionId;
    this.testCaseId = testCaseId;
  }

  connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    this.intentionalDisconnect = false;
    
    // Clean up any existing reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    // Build URL with query parameters - note the updated path
    const url = new URL(`${WS_BASE_URL}/chat`);
    url.searchParams.append('session_id', this.sessionId);
    url.searchParams.append('test_case_id', this.testCaseId);
    
    console.log(`Connecting to WebSocket at ${url.toString()}`);
    this.ws = new WebSocket(url.toString());
    
    this.ws.onopen = () => {
      console.log('WebSocket connection established');
      this.reconnectAttempts = 0;
      this.notifyConnectionHandlers(true);
      
      // Set up ping interval to keep connection alive
      this.setupPingInterval();
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as ChatMessage;
        console.log('Received message:', message);
        this.notifyMessageHandlers(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log(`WebSocket connection closed with code ${event.code} and reason: ${event.reason}`);
      
      // Clear ping interval
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
      }
      
      this.notifyConnectionHandlers(false);
      
      // Only attempt to reconnect if it wasn't an intentional disconnect
      if (!this.intentionalDisconnect) {
        this.attemptReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Let the onclose handler handle reconnection
    };
  }

  disconnect(): void {
    this.intentionalDisconnect = true;
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close(1000, "Intentional disconnect");
      }
      this.ws = null;
    }
  }

  sendMessage(content: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      
      // If we're intentionally disconnected, don't try to reconnect
      if (this.intentionalDisconnect) {
        return;
      }
      
      // Otherwise try to reconnect and queue the message
      this.connect();
      setTimeout(() => this.sendMessage(content), 1000);
      return;
    }

    const message = {
      session_id: this.sessionId,
      id: this.testCaseId,
      content,
      type: 'TextMessage',
      source: 'user'
    };

    console.log('Sending message:', message);
    this.ws.send(JSON.stringify(message));
  }

  // Setup ping interval to keep the connection alive
  private setupPingInterval(): void {
    // Clear any existing interval
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    // Send a ping every 30 seconds to keep the connection alive
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        // Send an empty ping frame
        this.ws.send(JSON.stringify({ 
          type: 'ping',
          session_id: this.sessionId,
          id: this.testCaseId
        }));
        console.log('Ping sent to keep connection alive');
      }
    }, 30000); // 30 seconds
  }

  onMessage(handler: (message: ChatMessage) => void): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  onConnectionChange(handler: (connected: boolean) => void): () => void {
    this.connectionHandlers.push(handler);
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    };
  }

  private notifyMessageHandlers(message: ChatMessage): void {
    this.messageHandlers.forEach(handler => handler(message));
  }

  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach(handler => handler(connected));
  }

  private attemptReconnect(): void {
    if (this.intentionalDisconnect) {
      console.log('Not reconnecting due to intentional disconnect');
      return;
    }
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum reconnect attempts reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
    
    this.reconnectAttempts++;
    this.reconnectTimeout = setTimeout(() => {
      console.log(`Reconnect attempt ${this.reconnectAttempts}`);
      this.connect();
    }, delay);
  }
}

// API client functions
export const api = {
  // Upload ZIP file containing data sources
  async uploadFiles(sessionId: string, file: File): Promise<{ dataSources: DataSource[] }> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Note how we don't need /api/ in the path anymore since API_BASE_URL already includes it
    const response = await fetch(withSession(`${API_BASE_URL}/upload`, sessionId), {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Get all data sources for a session
  async getDataSources(sessionId: string): Promise<{ dataSources: DataSource[] }> {
    // Updated to use the environment-aware API_BASE_URL
    const response = await fetch(withSession(`${API_BASE_URL}/data-sources`, sessionId));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data sources: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Update a data source
  async updateDataSource(sessionId: string, id: string, updates: Partial<DataSource>): Promise<DataSource> {
    const response = await fetch(withSession(`${API_BASE_URL}/data-sources/${id}`, sessionId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update data source: ${response.statusText}`);
    }
    
    return response.json();
  },

  // get all test cases for a session
  async getTestCases(sessionId: string): Promise<{ testCases: TestCase[] }> {
    const response = await fetch(withSession(`${API_BASE_URL}/test-cases`, sessionId));

    if (!response.ok) {
      throw new Error(`Failed to fetch test cases: ${response.statusText}`);
    }

    return response.json();
  },

  // Generate a test case
  async generateTestCase(sessionId: string, request: TestCaseGenerationRequest): Promise<{ id: string; events: TestCaseEvent[] }> {
    const response = await fetch(withSession(`${API_BASE_URL}/test-cases/generate`, sessionId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to generate test case: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Get a test case by ID
  async getTestCase(sessionId: string, id: string): Promise<TestCase> {
    const response = await fetch(withSession(`${API_BASE_URL}/test-cases/${id}`, sessionId));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch test case: ${response.statusText}`);
    }
    
    const testCaseData = await response.json();
    
    // If test_case_text is not provided, extract it from events
    if (!testCaseData.test_case_text && testCaseData.events && testCaseData.events.length > 0) {
      testCaseData.test_case_text = extractTestCaseFromEvents(testCaseData.events);
    }
    
    return testCaseData;
  },
  
  // Delete all session data
  async deleteSession(sessionId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/session/${sessionId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete session: ${response.statusText}`);
    }
    
    return response.json();
  },
};
