
import { Session } from "../studio/datamodel";
import { getServerUrl } from "../studio/utils";

export class SessionAPI {
  private getBaseUrl(): string {
    return getServerUrl();
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
    };
  }

  async createSession(
    sessionData: Partial<Session>,
    userId: string
  ): Promise<Session> {
    const session = {
      ...sessionData,
      user_id: userId,
    };

    const response = await fetch(`${this.getBaseUrl()}/sessions/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(session),
    });
    const data = await response.json();
    if (!data.status)
      throw new Error(data.message || "Failed to create session");
    return data.data;
  }

  async deleteSession(sessionId: number, userId: string): Promise<void> {
    const response = await fetch(
      `${this.getBaseUrl()}/sessions/${sessionId}?user_id=${userId}`,
      {
        method: "DELETE",
        headers: this.getHeaders(),
      }
    );
    const data = await response.json();
    if (!data.status)
      throw new Error(data.message || "Failed to delete session");
  }
}

export const sessionAPI = new SessionAPI();
