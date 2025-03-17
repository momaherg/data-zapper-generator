
// Re-export the Gallery type from studio datamodel
export * from "../studio/datamodel";

// Define a simpler Gallery type compatible with both implementations
export interface SimpleGallery {
  id: number | string;
  name: string;
  description?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  version?: number;
  config?: any;
  items?: any[];
}
