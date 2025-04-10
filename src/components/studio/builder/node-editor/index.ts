
import { Component, ComponentConfig } from "../../datamodel";

export interface NodeEditorFieldsProps {
  component: Component<ComponentConfig>;
  onChange?: (updates: Partial<Component<ComponentConfig>>) => void;
  onNavigate?: (componentType: string, id: string, parentField: string) => void;
}

// Re-export components that should be available from this module
export * from "./fields/agent-fields";
export { default as ModelFields } from "./fields/model-fields";
export * from "./fields/team-fields";
export * from "./fields/termination-fields";
export * from "./fields/tool-fields";
export * from "./NestedComponentButton";
