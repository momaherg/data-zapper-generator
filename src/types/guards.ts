
import { 
  Component, 
  ComponentTypes, 
  ComponentConfig,
  TeamConfig,
  AgentConfig,
  ModelConfig,
  ToolConfig,
  TerminationConfig,
  ChatCompletionContextConfig,
  OrTerminationConfig,
  MaxMessageTerminationConfig,
  TextMentionTerminationConfig,
  SelectorGroupChatConfig,
  RoundRobinGroupChatConfig,
  MultimodalWebSurferConfig,
  AssistantAgentConfig,
  UserProxyAgentConfig,
  OpenAIClientConfig,
  AzureOpenAIClientConfig,
  AnthropicClientConfig,
  FunctionToolConfig
} from "./datamodel";

// Type guard functions for component types
export function isTeamComponent(component: Component<ComponentConfig>): component is Component<TeamConfig> {
  return component.component_type === "team";
}

export function isAgentComponent(component: Component<ComponentConfig>): component is Component<AgentConfig> {
  return component.component_type === "agent";
}

export function isModelComponent(component: Component<ComponentConfig>): component is Component<ModelConfig> {
  return component.component_type === "model";
}

export function isToolComponent(component: Component<ComponentConfig>): component is Component<ToolConfig> {
  return component.component_type === "tool";
}

export function isTerminationComponent(component: Component<ComponentConfig>): component is Component<TerminationConfig> {
  return component.component_type === "termination";
}

// Team specific guards
export function isSelectorTeam(component: Component<TeamConfig>): component is Component<SelectorGroupChatConfig> {
  return 'selector_prompt' in component.config;
}

export function isRoundRobinTeam(component: Component<TeamConfig>): component is Component<RoundRobinGroupChatConfig> {
  return 'participants' in component.config && !('selector_prompt' in component.config);
}

// Agent specific guards 
export function isMultimodalWebSurfer(config: AgentConfig): config is MultimodalWebSurferConfig {
  return 'browser_channel' in config || 'start_page' in config;
}

export function isAssistantAgent(config: AgentConfig): config is AssistantAgentConfig {
  return 'reflect_on_tool_use' in config;
}

export function isUserProxyAgent(config: AgentConfig): config is UserProxyAgentConfig {
  return !('reflect_on_tool_use' in config) && !('browser_channel' in config);
}

// Model specific guards
export function isOpenAIModel(component: Component<ModelConfig>): component is Component<OpenAIClientConfig> {
  return component.provider === "openai";
}

export function isAzureOpenAIModel(component: Component<ModelConfig>): component is Component<AzureOpenAIClientConfig> {
  return component.provider === "azure";
}

export function isAnthropicModel(component: Component<ModelConfig>): component is Component<AnthropicClientConfig> {
  return component.provider === "anthropic";
}

// Tool specific guards
export function isFunctionTool(config: ToolConfig): config is FunctionToolConfig {
  return 'source_code' in config;
}

// Termination specific guards
export function isOrTermination(component: Component<TerminationConfig>): component is Component<OrTerminationConfig> {
  return 'conditions' in component.config;
}

export function isMaxMessageTermination(component: Component<TerminationConfig>): component is Component<MaxMessageTerminationConfig> {
  return 'max_messages' in component.config;
}

export function isTextMentionTermination(component: Component<TerminationConfig>): component is Component<TextMentionTerminationConfig> {
  return 'text' in component.config;
}

// Export constants for better type safety
export const PROVIDERS = {
  // Teams
  ROUND_ROBIN_TEAM: "roundrobin",
  SELECTOR_TEAM: "selector",

  // Agents
  ASSISTANT_AGENT: "assistant",
  USER_PROXY: "user_proxy",
  WEB_SURFER: "web_surfer",

  // Models
  OPENAI: "openai",
  AZURE_OPENAI: "azure",
  ANTHROPIC: "anthropic",

  // Tools
  FUNCTION_TOOL: "function",

  // Termination
  OR_TERMINATION: "or",
  MAX_MESSAGE: "maxmessage",
  TEXT_MENTION: "textmention",
};
