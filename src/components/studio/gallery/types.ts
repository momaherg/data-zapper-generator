
import { Gallery } from "../datamodel";

export interface GalleryAPI {
  listGalleries: () => Promise<Gallery[]>;
  getGallery: (id: string) => Promise<Gallery>;
  createGallery: (gallery: Partial<Gallery>) => Promise<Gallery>;
  updateGallery: (gallery: Gallery) => Promise<Gallery>;
  deleteGallery: (id: string) => Promise<void>;
  syncGallery: (url: string) => Promise<Gallery>;
}
