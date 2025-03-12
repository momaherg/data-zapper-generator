
// Re-export everything from studio datamodel
export * from "../components/studio/datamodel";

// Define a compatible Gallery interface that works with both implementations
export interface GalleryType {
  id: string | number;
  name: string;
  description?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  version?: number | string;
  config: any;
}

// Export GalleryConfig and Gallery interfaces
export { GalleryConfig, Gallery } from "../components/studio/datamodel";
