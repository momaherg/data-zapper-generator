
// Re-export everything from studio datamodel
export type { 
  ComponentTypes, 
  Component, 
  ComponentConfig,
  Gallery,
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

// Define a specialized GalleryConfig interface that's separate from the re-export
export interface GalleryDetail {
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
