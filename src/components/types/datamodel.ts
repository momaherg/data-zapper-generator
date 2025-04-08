
// Re-export everything from studio datamodel
export type { 
  ComponentTypes, 
  Component, 
  ComponentConfig,
  Gallery,
  GalleryConfig,
  Team,
  AgentConfig,
  ModelConfig,
  ToolConfig,
  TerminationConfig
} from "../studio/datamodel";

// Define a Gallery type compatible with both implementations
export interface Gallery {
  id: number | string;
  name: string;
  description?: string;
  url?: string | null;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  version?: number;
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
  components?: {
    agents?: any[];
    models?: any[];
    tools?: any[];
    terminations?: any[];
    teams?: any[];
  };
  config?: any;
  items?: any[];
}
