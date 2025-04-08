
import { Gallery, Component, ComponentConfig } from "../../types/datamodel";

export interface GalleryAPI {
  listGalleries: () => Promise<Gallery[]>;
  getGallery: (id: string) => Promise<Gallery>;
  createGallery: (gallery: Partial<Gallery>) => Promise<Gallery>;
  updateGallery: (gallery: Gallery) => Promise<Gallery>;
  deleteGallery: (id: string) => Promise<void>;
  syncGallery?: (url: string) => Promise<Gallery>;
}

export interface GalleryComponents {
  agents?: any[];
  models?: any[];
  tools?: any[];
  terminations?: any[];
  teams?: Component<ComponentConfig>[];
}

// Ensure Gallery interface is properly defined
export interface ExtendedGallery extends Gallery {
  components?: {
    agents?: any[];
    models?: any[];
    tools?: any[];
    terminations?: any[];
    teams?: any[];
  };
  metadata?: {
    author: string;
    created_at: string;
    updated_at: string;
    version: string;
    description: string;
    tags?: string[];
    license?: string;
    homepage?: string | null;
    category?: string;
    last_synced?: string | null;
  };
  url?: string | null;
}
