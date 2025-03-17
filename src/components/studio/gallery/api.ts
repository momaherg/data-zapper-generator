
import { Gallery } from "../datamodel";
import { getServerUrl } from "../utils";

export class GalleryAPI {
  private getBaseUrl(): string {
    return getServerUrl();
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
    };
  }

  async listGalleries(): Promise<Gallery[]> {
    const response = await fetch(
      `${this.getBaseUrl()}/gallery`,
      {
        headers: this.getHeaders(),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch galleries: ${response.statusText}`);
    }
    
    const data = await response.json();
    // If it's a single gallery, convert to array
    if (!Array.isArray(data)) {
      return [data];
    }
    return data;
  }

  async getGallery(id: string): Promise<Gallery> {
    const response = await fetch(
      `${this.getBaseUrl()}/gallery/${id}`,
      {
        headers: this.getHeaders(),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch gallery: ${response.statusText}`);
    }
    
    return response.json();
  }

  async createGallery(gallery: Partial<Gallery>): Promise<Gallery> {
    const response = await fetch(`${this.getBaseUrl()}/gallery`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(gallery),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create gallery: ${response.statusText}`);
    }
    
    return response.json();
  }

  async updateGallery(gallery: Gallery): Promise<Gallery> {
    const response = await fetch(
      `${this.getBaseUrl()}/gallery/${gallery.id}`,
      {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(gallery),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to update gallery: ${response.statusText}`);
    }
    
    return response.json();
  }

  async deleteGallery(id: string): Promise<void> {
    const response = await fetch(
      `${this.getBaseUrl()}/gallery/${id}`,
      {
        method: "DELETE",
        headers: this.getHeaders(),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to delete gallery: ${response.statusText}`);
    }
  }

  async syncGallery(url: string): Promise<Gallery> {
    const response = await fetch(`${this.getBaseUrl()}/gallery/sync`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to sync gallery from ${url}`);
    }
    
    const data = await response.json();
    return data;
  }
}

export const galleryAPI = new GalleryAPI();
