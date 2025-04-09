export interface ComponentConfig {
  name?: string;
  description?: string;
  [key: string]: any;
}

export type ComponentTypes =
  | "agent"
  | "model"
  | "tool"
  | "termination"
  | "team"
  | "gallery";

export interface Component<T extends ComponentConfig> {
  id?: string;
  provider: string;
  component_type: ComponentTypes;
  label?: string;
  description?: string;
  config: T;
}

export interface Team {
  id?: string;
  name?: string;
  description?: string;
  component: Component<TeamConfig>;
}

export interface GalleryConfig {
  name: string;
  description?: string;
  items?: Component<ComponentConfig>[];
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

// Define missing agent configurations
export interface AgentConfig extends ComponentConfig {
  [key: string]: any;
}

export interface AssistantAgentConfig extends AgentConfig {
  model_name?: string;
  temperature?: number;
  system_message?: string;
}

export interface UserProxyAgentConfig extends AgentConfig {
  human_input_mode?: string;
  max_consecutive_auto_reply?: number;
}

export interface MultimodalWebSurferConfig extends AgentConfig {
  model_name?: string;
  browser_config?: {
    viewport_width?: number;
    viewport_height?: number;
  };
}

export interface ModelConfig extends ComponentConfig {
  model: string;
  api_key?: string;
  organization?: string;
  base_url?: string;
  timeout?: number;
  max_retries?: number;
  [key: string]: any;
}

export interface OpenAIClientConfig extends ModelConfig {
  model: string;
  api_key: string;
  organization?: string;
}

export interface AzureOpenAIClientConfig extends ModelConfig {
  model: string;
  api_key: string;
  azure_endpoint: string;
  azure_deployment?: string;
  api_version: string;
  azure_ad_token?: string;
}

export interface AnthropicClientConfig extends ModelConfig {
  model: string;
  api_key: string;
}

export interface ToolConfig extends ComponentConfig {
  code: string;
}

// Update the team config interfaces with missing properties
export interface TeamConfig extends ComponentConfig {
  participants: Component<AgentConfig>[];
  termination_condition?: Component<TerminationConfig>;
}

export interface SelectorGroupChatConfig extends TeamConfig {
  selector_prompt?: string;
  model_client?: Component<ModelConfig>;
}

export interface RoundRobinGroupChatConfig extends TeamConfig {
  allow_repeated_speaker?: boolean;
  selector_prompt?: string;
  model_client?: Component<ModelConfig>;
}

// Update termination config interfaces
export interface TerminationConfig extends ComponentConfig {}

export interface MaxMessageTerminationConfig extends TerminationConfig {
  max_messages: number;
}

export interface TextMentionTerminationConfig extends TerminationConfig {
  text: string;
}

export interface OrTerminationConfig extends TerminationConfig {
  conditions: Component<TerminationConfig>[];
}

// Export the configurations to make them available for imports
export type {
  AssistantAgentConfig,
  UserProxyAgentConfig,
  MultimodalWebSurferConfig
};
