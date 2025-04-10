
import { 
  Component, 
  ComponentTypes, 
  ComponentConfig 
} from "./datamodel";

import {
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
} from "../components/studio/datamodel";

// Type guard functions for component types
export function isTeam(component: Component<ComponentConfig>): component is Component<TeamConfig> {
  return component.component_type === "team";
}

export function isAgent(component: Component<ComponentConfig>): component is Component<AgentConfig> {
  return component.component_type === "agent";
}

export function isModel(component: Component<ComponentConfig>): component is Component<ModelConfig> {
  return component.component_type === "model";
}

export function isTool(component: Component<ComponentConfig>): component is Component<ToolConfig> {
  return component.component_type === "tool";
}

export function isTermination(component: Component<ComponentConfig>): component is Component<TerminationConfig> {
  return component.component_type === "termination";
}

// Type guards for specific configs
export function isSelectorGroupChat(config: TeamConfig): config is SelectorGroupChatConfig {
  return 'selector_prompt' in config;
}

export function isRoundRobinGroupChat(config: TeamConfig): config is RoundRobinGroupChatConfig {
  return 'participants' in config && !('selector_prompt' in config);
}

export function isMultimodalWebSurfer(config: AgentConfig): config is MultimodalWebSurferConfig {
  return 'browser_channel' in config || 'start_page' in config;
}

export function isAssistantAgent(config: AgentConfig): config is AssistantAgentConfig {
  return 'reflect_on_tool_use' in config;
}

export function isUserProxyAgent(config: AgentConfig): config is UserProxyAgentConfig {
  return !('reflect_on_tool_use' in config) && !('browser_channel' in config);
}

export function isOpenAIClient(config: ModelConfig): config is OpenAIClientConfig {
  return 'model' in config && !('azure_endpoint' in config) && !('top_k' in config);
}

export function isAzureOpenAIClient(config: ModelConfig): config is AzureOpenAIClientConfig {
  return 'azure_endpoint' in config;
}

export function isAnthropicClient(config: ModelConfig): config is AnthropicClientConfig {
  return 'top_k' in config || ('model' in config && config.model.includes('claude'));
}

export function isFunctionTool(config: ToolConfig): config is FunctionToolConfig {
  return 'source_code' in config;
}

export function isOrTermination(config: TerminationConfig): config is OrTerminationConfig {
  return 'conditions' in config;
}

export function isMaxMessageTermination(config: TerminationConfig): config is MaxMessageTerminationConfig {
  return 'max_messages' in config;
}

export function isTextMentionTermination(config: TerminationConfig): config is TextMentionTerminationConfig {
  return 'text' in config;
}
