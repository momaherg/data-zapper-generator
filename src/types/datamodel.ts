
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
  SelectorGroupChatConfig,
  RoundRobinGroupChatConfig,
  MaxMessageTerminationConfig,
  TextMentionTerminationConfig,
  OrTerminationConfig
} from "../components/studio/datamodel";

// Define ChatMessage interface that was missing
export interface ChatMessage {
  message_id?: string;
  role: string;
  content: string;
  metadata?: Record<string, any>;
  created_at?: string;
}
