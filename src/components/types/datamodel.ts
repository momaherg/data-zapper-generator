
// Re-export everything from studio datamodel
export type { 
  ComponentTypes, 
  Component, 
  ComponentConfig,
  GalleryConfig,
  Team,
  AgentConfig,
  ModelConfig,
  ToolConfig,
  TerminationConfig
} from "../components/studio/datamodel";

// Define a Gallery type compatible with both implementations
export interface Gallery {
  id: string;
  name: string;
  description?: string;
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
  };
  created_at?: string;
  updated_at?: string;
}
