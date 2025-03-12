
import { NestedComponentButton } from "./NestedComponentButton";
import { Component, ComponentConfig } from "../../datamodel";

export interface NodeEditorFieldsProps {
  component: Component<ComponentConfig>;
  onChange: (updates: Partial<Component<ComponentConfig>>) => void;
  onNavigate?: (componentType: string, id: string, parentField: string) => void;
}

export { NestedComponentButton };
export type NestedComponentButtonProps = {
  label: string;
  description?: string;
  onClick: () => void;
};
