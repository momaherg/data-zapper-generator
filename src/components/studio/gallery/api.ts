
import { Gallery } from "../datamodel";
import { getServerUrl } from "../utils";

export class GalleryAPI {
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

  async listGalleries(): Promise<Gallery[]> {
    const url = this.appendSessionId(`${this.getBaseUrl()}/gallery`);
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch galleries");
    }
    
    return response.json();
  }

  async getGallery(id: string): Promise<Gallery> {
    const url = this.appendSessionId(`${this.getBaseUrl()}/gallery/${id}`);
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch gallery");
    }
    
    return response.json();
  }

  async createGallery(gallery: Partial<Gallery>): Promise<Gallery> {
    const url = this.appendSessionId(`${this.getBaseUrl()}/gallery`);
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(gallery),
    });
    
    if (!response.ok) {
      throw new Error("Failed to create gallery");
    }
    
    return response.json();
  }

  async updateGallery(gallery: Gallery): Promise<Gallery> {
    const url = this.appendSessionId(`${this.getBaseUrl()}/gallery/${gallery.id}`);
    const response = await fetch(url, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(gallery),
    });
    
    if (!response.ok) {
      throw new Error("Failed to update gallery");
    }
    
    return response.json();
  }

  async deleteGallery(id: string): Promise<void> {
    const url = this.appendSessionId(`${this.getBaseUrl()}/gallery/${id}`);
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error("Failed to delete gallery");
    }
  }

  async syncGallery(url: string): Promise<Gallery> {
    const apiUrl = this.appendSessionId(`${this.getBaseUrl()}/gallery/sync`);
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to sync gallery from ${url}`);
    }
    
    return response.json();
  }
}

export const galleryAPI = new GalleryAPI();
