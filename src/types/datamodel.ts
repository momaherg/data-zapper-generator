
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
  ChatCompletionContextConfig
} from "../components/studio/datamodel";
