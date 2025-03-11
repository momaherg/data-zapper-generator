
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

  async getGallery(galleryId: number): Promise<Gallery> {
    const response = await fetch(
      `${this.getBaseUrl()}/gallery/${galleryId}`,
      {
        headers: this.getHeaders(),
      }
    );
    const data = await response.json();
    if (!data.status)
      throw new Error(data.message || "Failed to fetch gallery");
    return data.data;
  }

  async createGallery(
    galleryData: Partial<Gallery>
  ): Promise<Gallery> {
    const gallery = {
      ...galleryData,
    };

    console.log("Creating gallery with data:", gallery);

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

  async updateGallery(
    galleryId: number,
    galleryData: Partial<Gallery>
  ): Promise<Gallery> {
    const gallery = {
      ...galleryData,
    };

    const response = await fetch(
      `${this.getBaseUrl()}/gallery/${galleryId}`,
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

  async deleteGallery(galleryId: number): Promise<void> {
    const response = await fetch(
      `${this.getBaseUrl()}/gallery/${galleryId}`,
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
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to sync gallery from ${url}`);
    }
    return await response.json();
  }
}

export const galleryAPI = new GalleryAPI();
