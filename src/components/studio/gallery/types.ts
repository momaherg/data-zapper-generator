
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
