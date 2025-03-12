import type {
  Component,
  ComponentConfig,
  TeamConfig,
  AgentConfig,
  ModelConfig,
  ToolConfig,
  TerminationConfig,
  ChatCompletionContextConfig,
  SelectorGroupChatConfig,
  RoundRobinGroupChatConfig,
  MultimodalWebSurferConfig,
  AssistantAgentConfig,
  UserProxyAgentConfig,
  OpenAIClientConfig,
  AzureOpenAIClientConfig,
  FunctionToolConfig,
  OrTerminationConfig,
  MaxMessageTerminationConfig,
  TextMentionTerminationConfig,
  UnboundedChatCompletionContextConfig,
  AnthropicClientConfig,
} from "./datamodel";

// Provider constants
const PROVIDERS = {
  // Teams
  ROUND_ROBIN_TEAM: "autogen_agentchat.teams.RoundRobinGroupChat",
  SELECTOR_TEAM: "autogen_agentchat.teams.SelectorGroupChat",

  // Agents
  ASSISTANT_AGENT: "autogen_agentchat.agents.AssistantAgent",
  USER_PROXY: "autogen_agentchat.agents.UserProxyAgent",
  WEB_SURFER: "autogen_ext.agents.web_surfer.MultimodalWebSurfer",

  // Models
  OPENAI: "autogen_ext.models.openai.OpenAIChatCompletionClient",
  AZURE_OPENAI: "autogen_ext.models.openai.AzureOpenAIChatCompletionClient",
  ANTHROPIC: "autogen_ext.models.anthropic.AnthropicChatCompletionClient",

  // Tools
  FUNCTION_TOOL: "autogen_core.tools.FunctionTool",

  // Termination
  OR_TERMINATION: "autogen_agentchat.base.OrTerminationCondition",
  MAX_MESSAGE: "autogen_agentchat.conditions.MaxMessageTermination",
  TEXT_MENTION: "autogen_agentchat.conditions.TextMentionTermination",

  // Contexts
  UNBOUNDED_CONTEXT:
    "autogen_core.model_context.UnboundedChatCompletionContext",
} as const;

// Provider type and mapping
export type Provider = (typeof PROVIDERS)[keyof typeof PROVIDERS];

type ProviderToConfig = {
  // Teams
  [PROVIDERS.SELECTOR_TEAM]: SelectorGroupChatConfig;
  [PROVIDERS.ROUND_ROBIN_TEAM]: RoundRobinGroupChatConfig;
  [PROVIDERS.ANTHROPIC]: AnthropicClientConfig;

  // Agents
  [PROVIDERS.ASSISTANT_AGENT]: AssistantAgentConfig;
  [PROVIDERS.USER_PROXY]: UserProxyAgentConfig;
  [PROVIDERS.WEB_SURFER]: MultimodalWebSurferConfig;

  // Models
  [PROVIDERS.OPENAI]: OpenAIClientConfig;
  [PROVIDERS.AZURE_OPENAI]: AzureOpenAIClientConfig;

  // Tools
  [PROVIDERS.FUNCTION_TOOL]: FunctionToolConfig;

  // Termination
  [PROVIDERS.OR_TERMINATION]: OrTerminationConfig;
  [PROVIDERS.MAX_MESSAGE]: MaxMessageTerminationConfig;
  [PROVIDERS.TEXT_MENTION]: TextMentionTerminationConfig;

  // Contexts
  [PROVIDERS.UNBOUNDED_CONTEXT]: UnboundedChatCompletionContextConfig;
};

// Helper type to get config type from provider
type ConfigForProvider<P extends Provider> = P extends keyof ProviderToConfig
  ? ProviderToConfig[P]
  : never;

// Base component type guards
export function isComponent(value: any): value is Component<ComponentConfig> {
  return (
    value &&
    typeof value === "object" &&
    "provider" in value &&
    "component_type" in value &&
    "config" in value
  );
}

// Component type guards with proper type narrowing
export function isAssistantAgent(
  component: Component<ComponentConfig>
): component is Component<AssistantAgentConfig> {
  return (
    component.component_type === "agent" &&
    (component.provider.includes("AssistantAgent") || 
     component.provider === "assistant")
  );
}

// Base component type guards
export function isTeamComponent(
  component: Component<ComponentConfig>
): component is Component<TeamConfig> {
  return component.component_type === "team";
}

export function isAgentComponent(
  component: Component<ComponentConfig>
): component is Component<AgentConfig> {
  return component.component_type === "agent";
}

export function isModelComponent(
  component: Component<ComponentConfig>
): component is Component<ModelConfig> {
  return component.component_type === "model";
}

export function isToolComponent(
  component: Component<ComponentConfig>
): component is Component<ToolConfig> {
  return component.component_type === "tool";
}

export function isTerminationComponent(
  component: Component<ComponentConfig>
): component is Component<TerminationConfig> {
  return component.component_type === "termination";
}

// export function isChatCompletionContextComponent(
//   component: Component<ComponentConfig>
// ): component is Component<ChatCompletionContextConfig> {
//   return component.component_type === "chat_completion_context";
// }

// Team provider guards with proper type narrowing
export function isRoundRobinTeam(
  component: Component<ComponentConfig>
): component is Component<RoundRobinGroupChatConfig> {
  return (
    component.component_type === "team" &&
    (component.provider.includes("RoundRobinGroupChat") || 
     component.provider === "roundrobin")
  );
}

export function isSelectorTeam(
  component: Component<ComponentConfig>
): component is Component<SelectorGroupChatConfig> {
  return (
    component.component_type === "team" &&
    (component.provider.includes("SelectorGroupChat") || 
     component.provider === "selector")
  );
}

// Agent provider guards with proper type narrowing
export function isUserProxyAgent(
  component: Component<ComponentConfig>
): component is Component<UserProxyAgentConfig> {
  return isComponentOfType(component, PROVIDERS.USER_PROXY);
}

export function isWebSurferAgent(
  component: Component<ComponentConfig>
): component is Component<MultimodalWebSurferConfig> {
  return isComponentOfType(component, PROVIDERS.WEB_SURFER);
}

// Model provider guards with proper type narrowing
export function isOpenAIModel(
  component: Component<ComponentConfig>
): component is Component<OpenAIClientConfig> {
  return isComponentOfType(component, PROVIDERS.OPENAI);
}

export function isAzureOpenAIModel(
  component: Component<ComponentConfig>
): component is Component<AzureOpenAIClientConfig> {
  return isComponentOfType(component, PROVIDERS.AZURE_OPENAI);
}
export function isAnthropicModel(
  component: Component<ComponentConfig>
): component is Component<AnthropicClientConfig> {
  return component.provider === PROVIDERS.ANTHROPIC;
}

// Tool provider guards with proper type narrowing
export function isFunctionTool(
  component: Component<ComponentConfig>
): component is Component<FunctionToolConfig> {
  return isComponentOfType(component, PROVIDERS.FUNCTION_TOOL);
}

// Termination provider guards with proper type narrowing
export function isOrTermination(
  component: Component<ComponentConfig>
): component is Component<OrTerminationConfig> {
  return isComponentOfType(component, PROVIDERS.OR_TERMINATION);
}

export function isMaxMessageTermination(
  component: Component<ComponentConfig>
): component is Component<MaxMessageTerminationConfig> {
  return isComponentOfType(component, PROVIDERS.MAX_MESSAGE);
}

export function isTextMentionTermination(
  component: Component<ComponentConfig>
): component is Component<TextMentionTerminationConfig> {
  return isComponentOfType(component, PROVIDERS.TEXT_MENTION);
}

// Context provider guards with proper type narrowing
export function isUnboundedContext(
  component: Component<ComponentConfig>
): component is Component<UnboundedChatCompletionContextConfig> {
  return isComponentOfType(component, PROVIDERS.UNBOUNDED_CONTEXT);
}

// Runtime assertions
export function assertComponentType<P extends Provider>(
  component: Component<ComponentConfig>,
  provider: P
): asserts component is Component<ConfigForProvider<P>> {
  if (!isComponentOfType(component, provider)) {
    throw new Error(
      `Expected component with provider ${provider}, got ${component.provider}`
    );
  }
}

export { PROVIDERS };
