
// Re-export component types
export type { ComponentTypes, ComponentConfig } from "../components/studio/datamodel";

// Export Component type which is used in many places
export interface Component<T extends ComponentConfig> {
  provider: string;
  component_type: ComponentTypes;
  version?: number;
  component_version?: number;
  description?: string | null;
  config: T;
  label?: string;
}

// Export Gallery type
export interface Gallery {
  id: number;
  name: string;
  description?: string;
  config: {
    id: string;
    name: string;
    url?: string;
    metadata: {
      author: string;
      created_at: string;
      updated_at: string;
      version: string;
      description?: string;
      tags?: string[];
      license?: string;
      homepage?: string;
      category?: string;
      lastSynced?: string;
    };
    components: {
      teams: any[];
      agents: any[];
      models: any[];
      tools: any[];
      terminations: any[];
    };
  };
}

// Export required guard types 
export interface FromModuleImport {
  module: string;
  imports: string[];
}

// Export any other types needed by the application
export type Import = string | FromModuleImport;
