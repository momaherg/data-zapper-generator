
// Base URL for API requests
const API_BASE_URL = 'http://localhost:5000';

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
  selected_data_sources: string[];
  test_case_text: string;
  events: TestCaseEvent[];
  created_at: string;
}

export interface TestCaseEvent {
  type: string;
  description: string;
  dataSourceId?: string;
}

export interface TestCaseGenerationRequest {
  dataSourceIds: string[];
  requirement: string;
  format: string;
  notes: string;
}

// Helper function to add session_id parameter to URLs
const withSession = (url: string, sessionId: string) => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}session_id=${sessionId}`;
};

// API client functions
export const api = {
  // Upload ZIP file containing data sources
  async uploadFiles(sessionId: string, file: File): Promise<{ dataSources: DataSource[] }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(withSession(`${API_BASE_URL}/api/upload`, sessionId), {
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
    const response = await fetch(withSession(`${API_BASE_URL}/api/data-sources`, sessionId));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data sources: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Update a data source
  async updateDataSource(sessionId: string, id: string, updates: Partial<DataSource>): Promise<DataSource> {
    const response = await fetch(withSession(`${API_BASE_URL}/api/data-sources/${id}`, sessionId), {
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

  // get all test cases for a  session
  async getTestCases(sessionId: string): Promise<{ testCases: TestCase[] }> {

    const response = await fetch(withSession(`${API_BASE_URL}/api/test-cases`, sessionId));

    if (!response.ok) {
      throw new Error(`Failed to fetch test cases: ${response.statusText}`);
    }

    return response.json();
  },

  // Generate a test case
  async generateTestCase(sessionId: string, request: TestCaseGenerationRequest): Promise<{ id: string; testCase: string; events: TestCaseEvent[] }> {
    const response = await fetch(withSession(`${API_BASE_URL}/api/test-cases/generate`, sessionId), {
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
    const response = await fetch(withSession(`${API_BASE_URL}/api/test-cases/${id}`, sessionId));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch test case: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Delete all session data
  async deleteSession(sessionId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/session/${sessionId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete session: ${response.statusText}`);
    }
    
    return response.json();
  },
};
