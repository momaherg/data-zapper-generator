
// Re-export the full datamodel from studio
export * from "../components/studio/datamodel";

// Define a Gallery type compatible with both implementations
export interface Gallery {
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
