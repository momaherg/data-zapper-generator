
// Re-export everything from studio datamodel
export type { 
  ComponentTypes, 
  Component, 
  ComponentConfig,
  Team,
  AgentConfig,
  ModelConfig,
  ToolConfig,
  TerminationConfig,
  MaxMessageTerminationConfig,
  TextMentionTerminationConfig,
  OrTerminationConfig
} from "../components/studio/datamodel";

// Define a Gallery type compatible with both implementations
export interface GalleryConfig {
  components?: {
    agents?: any[];
    models?: any[];
    tools?: any[];
    terminations?: any[];
    teams?: any[];
  };
}

export interface GalleryMetadata {
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
}

export interface Gallery {
  id: number | string;
  name: string;
  description?: string;
  url?: string | null;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  version?: number;
  metadata?: GalleryMetadata;
  components?: {
    agents?: any[];
    models?: any[];
    tools?: any[];
    terminations?: any[];
    teams?: any[];
  };
  config?: GalleryConfig;
  items?: any[];
}
