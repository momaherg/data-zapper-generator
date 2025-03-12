
import NodeEditor from "./NodeEditor";

export interface NodeEditorFieldsProps {
  component: any;
  onChange: (updates: any) => void;
  onNavigate: (path: string[]) => void;
}

export * from "./NestedComponentButton";
export * from "./detailgroup";
export * from "./fields/fields";
export default NodeEditor;
