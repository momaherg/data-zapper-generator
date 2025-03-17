
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
      `${this.getBaseUrl()}/gallery/`,
      {
        headers: this.getHeaders(),
      }
    );
    const data = await response.json();
    if (!data.status)
      throw new Error(data.message || "Failed to fetch galleries");
    return data.data;
  }

  async getGallery(id: string): Promise<Gallery> {
    const response = await fetch(
      `${this.getBaseUrl()}/gallery/${id}`,
      {
        headers: this.getHeaders(),
      }
    );
    const data = await response.json();
    if (!data.status)
      throw new Error(data.message || "Failed to fetch gallery");
    return data.data;
  }

  async createGallery(gallery: Partial<Gallery>): Promise<Gallery> {
    const response = await fetch(`${this.getBaseUrl()}/gallery/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(gallery),
    });
    const data = await response.json();
    if (!data.status)
      throw new Error(data.message || "Failed to create gallery");
    return data.data;
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
    const data = await response.json();
    if (!data.status)
      throw new Error(data.message || "Failed to update gallery");
    return data.data;
  }

  async deleteGallery(id: string): Promise<void> {
    const response = await fetch(
      `${this.getBaseUrl()}/gallery/${id}`,
      {
        method: "DELETE",
        headers: this.getHeaders(),
      }
    );
    const data = await response.json();
    if (!data.status)
      throw new Error(data.message || "Failed to delete gallery");
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
    if (!data.status) {
      throw new Error(data.message || `Failed to sync gallery from ${url}`);
    }
    
    return data.data;
  }
}

export const galleryAPI = new GalleryAPI();
