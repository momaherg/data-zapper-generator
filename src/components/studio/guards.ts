import {
  Component,
  AgentConfig,
  TeamConfig,
  ModelConfig,
  ToolConfig,
  TerminationConfig,
} from "../datamodel";

// Agent Guards
export function isAgentComponent(component: any): component is Component<AgentConfig> {
  return component?.component_type === "agent";
}

export function isAssistantAgent(component: any): boolean {
  return isAgentComponent(component) && component.provider === "assistant";
}

export function isWebSurferAgent(component: any): boolean {
  return isAgentComponent(component) && component.provider === "websurfer";
}

// Model Guards
export function isModelComponent(component: any): component is Component<ModelConfig> {
  return component?.component_type === "model";
}

export function isOpenAIModel(component: any): boolean {
  return isModelComponent(component) && component.provider === "openai";
}

export function isAzureOpenAIModel(component: any): boolean {
  return isModelComponent(component) && component.provider === "azureopenai";
}

// Tool Guards
export function isToolComponent(component: any): component is Component<ToolConfig> {
  return component?.component_type === "tool";
}

export function isFunctionTool(component: any): boolean {
  return isToolComponent(component) && component.provider === "function";
}

// Termination Guards
export function isTerminationComponent(component: any): component is Component<TerminationConfig> {
  return component?.component_type === "termination";
}

export function isMaxMessageTermination(component: any): boolean {
  return isTerminationComponent(component) && component.provider === "maxmessage";
}

export function isTextMentionTermination(component: any): boolean {
  return isTerminationComponent(component) && component.provider === "textmention";
}

export function isOrTermination(component: any): boolean {
  return isTerminationComponent(component) && component.provider === "or";
}

// Team Guards
export function isTeamComponent(component: any): component is Component<TeamConfig> {
  return component?.component_type === "team";
}

export function isSelectorTeam(component: any): boolean {
  return isTeamComponent(component) && component.provider === "selector";
}

export function isRoundRobinTeam(component: any): boolean {
  return isTeamComponent(component) && component.provider === "roundrobin";
}
