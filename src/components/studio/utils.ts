
const getServerUrl = (): string => {
  // Default to localhost during development
  return "http://localhost:5000";
};

// Function to normalize component providers to simpler format
const normalizeProvider = (provider: string): string => {
  if (provider.includes("RoundRobinGroupChat")) return "roundrobin";
  if (provider.includes("SelectorGroupChat")) return "selector";
  if (provider.includes("AssistantAgent")) return "assistant";
  if (provider.includes("UserProxyAgent")) return "userproxy";
  if (provider.includes("MultimodalWebSurfer")) return "websurfer";
  if (provider.includes("OpenAIChatCompletionClient")) return "openai";
  if (provider.includes("AzureOpenAIChatCompletionClient")) return "azureopenai";
  if (provider.includes("AnthropicCompletionClient")) return "anthropic";
  if (provider.includes("FunctionTool")) return "function";
  if (provider.includes("OrTerminationCondition")) return "or";
  if (provider.includes("MaxMessageTermination")) return "maxmessage";
  if (provider.includes("TextMentionTermination")) return "textmention";
  
  // Default: return the last part of the provider string
  const parts = provider.split(".");
  return parts[parts.length - 1].toLowerCase();
};

// Function to normalize a component and all its nested components
const normalizeComponent = (component: any): any => {
  if (!component) return component;
  
  // // Create a copy with normalized provider
  // const normalized = {
  //   ...component,
  //   provider: normalizeProvider(component.provider),
  // };
  
  // // Normalize nested components in config
  // if (normalized.config) {
  //   // Handle participants array
  //   if (Array.isArray(normalized.config.participants)) {
  //     normalized.config.participants = normalized.config.participants.map(normalizeComponent);
  //   }
    
  //   // Handle model_client
  //   if (normalized.config.model_client) {
  //     normalized.config.model_client = normalizeComponent(normalized.config.model_client);
  //   }
    
  //   // Handle tools array
  //   if (Array.isArray(normalized.config.tools)) {
  //     normalized.config.tools = normalized.config.tools.map(normalizeComponent);
  //   }
    
  //   // Handle termination_condition
  //   if (normalized.config.termination_condition) {
  //     normalized.config.termination_condition = normalizeComponent(normalized.config.termination_condition);
  //   }
    
  //   // Handle conditions array for OrTermination
  //   if (Array.isArray(normalized.config.conditions)) {
  //     normalized.config.conditions = normalized.config.conditions.map(normalizeComponent);
  //   }
  // }
  
  return component;
};

export { getServerUrl, normalizeComponent, normalizeProvider };
