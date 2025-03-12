
// Re-export everything from studio datamodel
import { Gallery as StudioGallery, GalleryConfig as StudioGalleryConfig } from "../components/studio/datamodel";

// Define a compatible Gallery interface that works with both implementations
export interface GalleryType {
  id: string;
  name: string;
  description?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  version?: string;
  config: StudioGalleryConfig;
}

// Export type-only interfaces
export type { StudioGallery as Gallery, StudioGalleryConfig as GalleryConfig };

