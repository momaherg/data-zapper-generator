
import { Team, Component, ComponentConfig } from "./datamodel";
import { getServerUrl } from "./utils";

export interface ValidationError {
  field: string;
  error: string;
  suggestion?: string;
}

export interface ValidationResponse {
  is_valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export class TeamAPI {
  private sessionId: string | null = null;

  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  private getBaseUrl(): string {
    return getServerUrl();
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
    };
  }

  private appendSessionId(url: string): string {
    if (this.sessionId) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}session_id=${this.sessionId}`;
    }
    return url;
  }

  async listTeams(): Promise<Team[]> {
    const url = this.appendSessionId(`${this.getBaseUrl()}/teams`);
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch teams");
    }
    return response.json();
  }

  async getTeam(): Promise<Team> {
    const url = this.appendSessionId(`${this.getBaseUrl()}/team`);
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch team");
    }
    return response.json();
  }

  async createTeam(team: Partial<Team>): Promise<Team> {
    const url = this.appendSessionId(`${this.getBaseUrl()}/team`);
    const response = await fetch(url, {
      method: "POST", 
      headers: this.getHeaders(),
      body: JSON.stringify(team),
    });
    if (!response.ok) {
      throw new Error("Failed to create team");
    }
    return response.json();
  }

  async updateTeam(team: Partial<Team>): Promise<Team> {
    const url = this.appendSessionId(`${this.getBaseUrl()}/team`);
    const response = await fetch(url, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(team),
    });
    if (!response.ok) {
      throw new Error("Failed to update team");
    }
    return response.json();
  }

  async deleteTeam(): Promise<void> {
    const url = this.appendSessionId(`${this.getBaseUrl()}/team`);
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to delete team");
    }
  }
}

export class ValidationAPI {
  private sessionId: string | null = null;

  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  private getBaseUrl(): string {
    return getServerUrl();
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
    };
  }

  private appendSessionId(url: string): string {
    if (this.sessionId) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}session_id=${this.sessionId}`;
    }
    return url;
  }

  async validateComponent(
    component: Component<ComponentConfig>
  ): Promise<ValidationResponse> {
    const url = this.appendSessionId(`${this.getBaseUrl()}/validate`);
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        component: component,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to validate component");
    }

    return data;
  }
}

export const validationAPI = new ValidationAPI();
export const teamAPI = new TeamAPI();
