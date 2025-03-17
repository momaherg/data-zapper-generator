
// Re-export the full datamodel from studio
export * from "../studio/datamodel";

// Define a Gallery type compatible with both implementations
export interface Gallery {
  id: string | number;
  name: string;
  description?: string;
  url?: string | null;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  version?: number;
  config: {
    id: string;
    name: string;
    url?: string | null;
    metadata: {
      author: string;
      created_at: string;
      updated_at: string;
      version: string;
      description?: string;
      tags?: string[];
      license?: string;
      homepage?: string | null;
      category?: string;
      lastSynced?: string | null;
    };
    components: {
      teams?: any[];
      agents?: any[];
      models?: any[];
      tools?: any[];
      terminations?: any[];
    };
  }
}
