
import { Gallery } from "../datamodel";
import defaultGallery from "./default_gallery.json";

// Create a mock implementation of the gallery API
export const mockGalleryAPI = {
  listGalleries: async (): Promise<Gallery[]> => {
    // Return default gallery from the JSON
    return [defaultGallery as Gallery];
  },
  
  createGallery: async (gallery: Partial<Gallery>): Promise<Gallery> => {
    // Mock creating a gallery
    return {
      id: Math.random().toString(36).substring(2, 9),
      name: gallery.name || "New Gallery",
      description: gallery.description || "",
      config: gallery.config || defaultGallery.config,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },
  
  updateGallery: async (gallery: Gallery): Promise<Gallery> => {
    // Mock updating a gallery
    return {
      ...gallery,
      updated_at: new Date().toISOString(),
    };
  },
  
  deleteGallery: async (id: string): Promise<void> => {
    // Mock deleting a gallery
    return Promise.resolve();
  },
  
  getGallery: async (id: string): Promise<Gallery> => {
    // Mock getting a gallery
    return defaultGallery as Gallery;
  }
};

// Export a patched version of the API
export const patchGalleryAPI = () => {
  const originalApi = require('./api').galleryAPI;
  
  return {
    ...originalApi,
    listGalleries: async () => {
      try {
        const galleries = await originalApi.listGalleries();
        return galleries;
      } catch (error) {
        console.error("Error fetching galleries, using mock data:", error);
        return mockGalleryAPI.listGalleries();
      }
    },
    createGallery: async (gallery: Partial<Gallery>) => {
      try {
        return await originalApi.createGallery(gallery);
      } catch (error) {
        console.error("Error creating gallery, using mock data:", error);
        return mockGalleryAPI.createGallery(gallery);
      }
    },
    updateGallery: async (gallery: Gallery) => {
      try {
        return await originalApi.updateGallery(gallery);
      } catch (error) {
        console.error("Error updating gallery, using mock data:", error);
        return mockGalleryAPI.updateGallery(gallery);
      }
    },
    deleteGallery: async (id: string) => {
      try {
        return await originalApi.deleteGallery(id);
      } catch (error) {
        console.error("Error deleting gallery, using mock data:", error);
        return mockGalleryAPI.deleteGallery(id);
      }
    },
    getGallery: async (id: string) => {
      try {
        return await originalApi.getGallery(id);
      } catch (error) {
        console.error("Error getting gallery, using mock data:", error);
        return mockGalleryAPI.getGallery(id);
      }
    }
  };
};

export const patchedGalleryAPI = patchGalleryAPI();
