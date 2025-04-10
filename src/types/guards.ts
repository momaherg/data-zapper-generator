
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
  TerminationConfig
} from "../components/studio/datamodel";

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

// Re-export guards from studio guards
// Updated to match the exported names from the studio guards module
export {
  isRoundRobinTeam,
  isSelectorTeam,
  isWebSurferAgent,
  isAssistantAgent,
  isUserProxyAgent,
  isOpenAIModel,
  isAzureOpenAIModel,
  isAnthropicModel,
  isFunctionTool,
  isOrTermination,
  isMaxMessageTermination,
  isTextMentionTermination
} from "../components/studio/guards";
