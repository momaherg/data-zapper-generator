
import { Gallery } from "../../../types/datamodel";
import defaultGallery from "./default_gallery.json";

// Create a proper Gallery object from the JSON
const createGalleryFromJson = (json: any): Gallery => {
  return {
    id: json.id || crypto.randomUUID(),
    name: json.name || "Default Gallery",
    description: json.description || "",
    config: {
      id: json.id || "",
      name: json.name || "",
      url: json.url || "",
      metadata: {
        author: json.metadata?.author || "",
        created_at: json.metadata?.created_at || new Date().toISOString(),
        updated_at: json.metadata?.updated_at || new Date().toISOString(),
        version: json.metadata?.version || "1.0.0",
        description: json.metadata?.description || "",
        tags: json.metadata?.tags || [],
        license: json.metadata?.license || "",
        homepage: json.metadata?.homepage || "",
        category: json.metadata?.category || "",
        last_synced: json.metadata?.last_synced || new Date().toISOString(),
      },
      components: {
        teams: json.components?.teams || [],
        agents: json.components?.agents || [],
        models: json.components?.models || [],
        tools: json.components?.tools || [],
        terminations: json.components?.terminations || [],
      },
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

// Create a mock implementation of the gallery API
export const mockGalleryAPI = {
  listGalleries: async (): Promise<Gallery[]> => {
    return [createGalleryFromJson(defaultGallery)];
  },
  
  createGallery: async (gallery: Partial<Gallery>): Promise<Gallery> => {
    return {
      id: crypto.randomUUID(),
      name: gallery.name || "New Gallery",
      description: gallery.description || "",
      config: gallery.config || createGalleryFromJson(defaultGallery).config,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },
  
  updateGallery: async (gallery: Gallery): Promise<Gallery> => {
    return {
      ...gallery,
      updated_at: new Date().toISOString(),
    };
  },
  
  deleteGallery: async (id: string): Promise<void> => {
    return Promise.resolve();
  },
  
  getGallery: async (id: string): Promise<Gallery> => {
    return createGalleryFromJson(defaultGallery);
  }
};

// Export a patched version of the API that tries the real API first, falls back to mock
export const patchGalleryAPI = () => {
  return {
    listGalleries: async () => {
      try {
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
