
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
  test_case_text?: string;
  events?: Array<{
    type: string;
    description: string;
    content?: string;
  }>;
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
  test_case_text?: string;
  events?: Array<{
    type: string;
    description: string;
    content?: string;
  }>;
  status: "pending" | "completed" | "in_progress";
  created_at: Date | string;
  updated_at: Date | string;
}

// Mock API for data sources
export const dataSourceAPI = {
  getDataSources: async (sessionId: string) => {
    await mockTimeout(1000);
    return {
      dataSources: [
        {
          id: "ds1",
          path: "data/requirements.pdf",
          type: "pdf",
          description: "Contains detailed system requirements and specifications",
          usage: "Use this for understanding the core functionality requirements",
          timestamp: new Date(),
        },
        {
          id: "ds2",
          path: "data/test_cases.csv",
          type: "csv",
          description: "Contains existing test cases to reference",
          usage: "Review existing test cases to ensure coverage and avoid duplication",
          timestamp: new Date(),
        },
        {
          id: "ds3",
          path: "data/api_docs.xlsx",
          type: "xlsx",
          description: "API documentation with endpoints and parameters",
          usage: "Use this for building API test cases and understanding data flow",
          timestamp: new Date(),
        }
      ]
    };
  },
  uploadFiles: async (sessionId: string, file: File) => {
    await mockTimeout(2000);
    return {
      dataSources: [
        {
          id: "ds1",
          path: "data/requirements.pdf",
          type: "pdf",
          description: "Contains detailed system requirements and specifications",
          usage: "Use this for understanding the core functionality requirements",
          timestamp: new Date(),
        },
        {
          id: "ds2",
          path: "data/test_cases.csv",
          type: "csv",
          description: "Contains existing test cases to reference",
          usage: "Review existing test cases to ensure coverage and avoid duplication",
          timestamp: new Date(),
        },
        {
          id: "ds3",
          path: "data/api_docs.xlsx",
          type: "xlsx",
          description: "API documentation with endpoints and parameters",
          usage: "Use this for building API test cases and understanding data flow",
          timestamp: new Date(),
        },
        {
          id: "ds4",
          path: file.name,
          type: file.name.split('.').pop() || "unknown",
          description: "",
          usage: "",
          timestamp: new Date(),
        }
      ]
    };
  },
  updateDataSource: async (sessionId: string, id: string, updates: Partial<DataSource>) => {
    await mockTimeout(500);
    return {
      id,
      path: "data/updated_file.pdf",
      type: "pdf",
      description: updates.description || "",
      usage: updates.usage || "",
      timestamp: new Date(),
    };
  }
};

// Mock API for tools
export const toolAPI = {
  getTools: async (sessionId: string) => {
    await mockTimeout(1000);
    return {
      tools: [
        {
          id: "tool1",
          name: "API Tester",
          description: "A tool for testing REST APIs",
          provider: "internal",
          type: "api",
          parameters: [
            {
              name: "endpoint",
              type: "string",
              description: "API endpoint URL",
              required: true
            },
            {
              name: "method",
              type: "string",
              description: "HTTP method (GET, POST, etc.)",
              required: true,
              defaultValue: "GET"
            }
          ],
          usage_examples: ["Test authentication endpoint", "Validate data retrieval"],
          created_at: new Date(),
          updated_at: new Date()
        }
      ]
    };
  }
};

// Mock API for test cases
export const testCaseAPI = {
  getTestCases: async (sessionId: string) => {
    await mockTimeout(1000);
    return {
      testCases: [
        {
          id: "tc1",
          name: "Login Functionality",
          description: "Verify user login works correctly",
          requirement: "The system shall allow users to log in with valid credentials",
          format: "Gherkin",
          notes: "Focus on both positive and negative test cases",
          test_case_text: `Feature: User Login
Scenario: Successful login with valid credentials
  Given the user is on the login page
  When the user enters valid username and password
  And clicks the login button
  Then the user should be redirected to the dashboard
  And a welcome message should be displayed

Scenario: Failed login with invalid credentials
  Given the user is on the login page
  When the user enters invalid username or password
  And clicks the login button
  Then an error message should be displayed
  And the user should remain on the login page`,
          events: [
            { type: "system", description: "Test case generation started" },
            { type: "user", description: "Provided requirement details" },
            { type: "system", description: "Generated test case template" },
            { type: "system", description: "Finalized test case" }
          ],
          status: "completed",
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: "tc2",
          name: "Password Reset",
          description: "Verify password reset functionality",
          requirement: "The system shall allow users to reset their password via email",
          format: "Step-by-step",
          notes: "Include email validation checks",
          test_case_text: `Test Case: Password Reset
Preconditions:
- User account exists in the system
- User is not logged in

Test Steps:
1. Navigate to login page
2. Click "Forgot Password" link
3. Enter registered email address
4. Click "Send Reset Link" button
5. Check email inbox for reset link
6. Click reset link in email
7. Enter new password and confirmation
8. Submit the form

Expected Results:
- Reset link should be sent to the registered email
- User should be able to set a new password
- User should be able to log in with the new password
- Old password should no longer work`,
          events: [
            { type: "system", description: "Test case generation started" },
            { type: "user", description: "Provided requirement details" },
            { type: "system", description: "Generated test case template" },
            { type: "system", description: "Finalized test case" }
          ],
          status: "completed",
          created_at: new Date(),
          updated_at: new Date()
        }
      ]
    };
  },
  getTestCase: async (sessionId: string, testCaseId: string) => {
    await mockTimeout(800);
    return {
      id: testCaseId,
      name: "Login Functionality",
      description: "Verify user login works correctly",
      requirement: "The system shall allow users to log in with valid credentials",
      format: "Gherkin",
      notes: "Focus on both positive and negative test cases",
      test_case_text: `Feature: User Login
Scenario: Successful login with valid credentials
  Given the user is on the login page
  When the user enters valid username and password
  And clicks the login button
  Then the user should be redirected to the dashboard
  And a welcome message should be displayed

Scenario: Failed login with invalid credentials
  Given the user is on the login page
  When the user enters invalid username or password
  And clicks the login button
  Then an error message should be displayed
  And the user should remain on the login page`,
      events: [
        { type: "system", description: "Test case generation started" },
        { type: "user", description: "Provided requirement details" },
        { type: "system", description: "Generated test case template" },
        { type: "system", description: "Finalized test case" }
      ],
      status: "completed",
      created_at: new Date(),
      updated_at: new Date()
    };
  },
  generateTestCase: async (sessionId: string, data: {
    requirement: string;
    format: string;
    notes: string;
    dataSourceIds: string[];
  }) => {
    await mockTimeout(3000);
    
    return {
      id: "new_tc_" + Date.now(),
      name: "New Test Case",
      description: "Auto-generated test case",
      requirement: data.requirement,
      format: data.format,
      notes: data.notes,
      test_case_text: `Generated test case for requirement: ${data.requirement}
Format: ${data.format}
Notes: ${data.notes}

This is a placeholder for the generated test case content.
In a real implementation, this would be generated based on the requirement and data sources.

Test Steps:
1. Setup test environment
2. Prepare test data
3. Execute test
4. Verify results
5. Cleanup test environment`,
      events: [
        { type: "system", description: "Test case generation started" },
        { type: "user", description: "Provided requirement details" },
        { type: "system", description: "Generated test case template" },
        { type: "system", description: "Finalized test case" }
      ],
      status: "completed",
      created_at: new Date(),
      updated_at: new Date()
    };
  }
};

// Export a consolidated API object
export const api = {
  ...dataSourceAPI,
  ...toolAPI,
  ...testCaseAPI,
  // Add any other API methods here
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
