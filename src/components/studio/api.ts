
import { Team, Component, ComponentConfig } from "./datamodel";
import { getServerUrl } from "./utils";

interface ValidationError {
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
  private getBaseUrl(): string {
    return "http://localhost:5000";
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
    };
  }

  async getTeam(): Promise<Team> {
    const response = await fetch(`${this.getBaseUrl()}/team`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch team");
    }
    return response.json();
  }

  async updateTeam(team: Partial<Team>): Promise<Team> {
    const response = await fetch(`${this.getBaseUrl()}/team`, {
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
    const response = await fetch(`${this.getBaseUrl()}/team`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to delete team");
    }
  }
}

export class ValidationAPI {
  private getBaseUrl(): string {
    return getServerUrl();
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
    };
  }

  async validateComponent(
    component: Component<ComponentConfig>
  ): Promise<ValidationResponse> {
    const response = await fetch(`${this.getBaseUrl()}/validate/`, {
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
