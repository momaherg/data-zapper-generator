
// Re-export everything from studio datamodel
export type { 
  ComponentTypes, 
  Component, 
  ComponentConfig,
  Gallery,
  GalleryConfig,
  GalleryMetadata,
  Team,
  TeamConfig,
  AgentConfig,
  ModelConfig,
  ToolConfig,
  TerminationConfig,
  // Specific agent configs
  AssistantAgentConfig,
  UserProxyAgentConfig,
  MultimodalWebSurferConfig,
  // Specific model configs
  OpenAIClientConfig,
  AzureOpenAIClientConfig,
  AnthropicClientConfig,
  // Specific tool configs
  FunctionToolConfig,
  // Specific termination configs
  OrTerminationConfig,
  MaxMessageTerminationConfig,
  TextMentionTerminationConfig,
  // Team specific configs
  SelectorGroupChatConfig,
  RoundRobinGroupChatConfig,
  // Context configs
  ChatCompletionContextConfig,
  UnboundedChatCompletionContextConfig
} from "../components/studio/datamodel";

// Define a Gallery type compatible with both implementations
export interface GalleryConfig {
  id?: number | string;
  name: string;
  description?: string;
  metadata?: GalleryMetadata;
  components?: {
    agents?: any[];
    models?: any[];
    tools?: any[];
    terminations?: any[];
    teams?: any[];
  };
}

