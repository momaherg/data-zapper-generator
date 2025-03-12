
import { Gallery } from "../datamodel";
import defaultGallery from "./default_gallery.json";

// Create a proper Gallery object from the JSON
const createGalleryFromJson = (json: any): Gallery => {
  // Convert the JSON to match the Gallery interface
  return {
    id: json.id || Math.random().toString(36).substring(2, 9),
    name: json.name || "Default Gallery",
    description: json.description || "",
    config: {
      id: json.id || "",
      name: json.name || "",
      url: json.url || "",
      metadata: json.metadata || {
        author: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: "1.0.0",
      },
      components: json.components || {
        teams: [],
        agents: [],
        models: [],
        tools: [],
        terminations: [],
      },
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

// Create a mock implementation of the gallery API
export const mockGalleryAPI = {
  listGalleries: async (): Promise<Gallery[]> => {
    // Return default gallery from the JSON
    return [createGalleryFromJson(defaultGallery)];
  },
  
  createGallery: async (gallery: Partial<Gallery>): Promise<Gallery> => {
    // Mock creating a gallery
    return {
      id: Math.random().toString(36).substring(2, 9),
      name: gallery.name || "New Gallery",
      description: gallery.description || "",
      config: gallery.config || createGalleryFromJson(defaultGallery).config,
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
    return createGalleryFromJson(defaultGallery);
  }
};

// Export a patched version of the API
export const patchGalleryAPI = () => {
  // Since we may not have access to the original API at this point, 
  // we'll just create a version that gracefully falls back to mock data
  return {
    listGalleries: async () => {
      try {
        // Try to use the original API if available
        const originalApi = require('./api').galleryAPI;
        const galleries = await originalApi.listGalleries();
        return galleries;
      } catch (error) {
        console.error("Error fetching galleries, using mock data:", error);
        return mockGalleryAPI.listGalleries();
      }
    },
    createGallery: async (gallery: Partial<Gallery>) => {
      try {
        const originalApi = require('./api').galleryAPI;
        return await originalApi.createGallery(gallery);
      } catch (error) {
        console.error("Error creating gallery, using mock data:", error);
        return mockGalleryAPI.createGallery(gallery);
      }
    },
    updateGallery: async (gallery: Gallery) => {
      try {
        const originalApi = require('./api').galleryAPI;
        return await originalApi.updateGallery(gallery);
      } catch (error) {
        console.error("Error updating gallery, using mock data:", error);
        return mockGalleryAPI.updateGallery(gallery);
      }
    },
    deleteGallery: async (id: string) => {
      try {
        const originalApi = require('./api').galleryAPI;
        return await originalApi.deleteGallery(id);
      } catch (error) {
        console.error("Error deleting gallery, using mock data:", error);
        return mockGalleryAPI.deleteGallery(id);
      }
    },
    getGallery: async (id: string) => {
      try {
        const originalApi = require('./api').galleryAPI;
        return await originalApi.getGallery(id);
      } catch (error) {
        console.error("Error getting gallery, using mock data:", error);
        return mockGalleryAPI.getGallery(id);
      }
    }
  };
};

export const patchedGalleryAPI = patchGalleryAPI();
