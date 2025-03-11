
// Export types and components from the node editor
export * from "./fields/fields";
export * from "./fields/agent-fields";
export * from "./fields/model-fields";
export * from "./fields/team-fields";
export * from "./fields/tool-fields";
export * from "./fields/termination-fields";

export interface NodeEditorFieldsProps {
  component: any;
  onChange: (updates: any) => void;
  onNavigate?: (componentType: string, id: string, parentField: string) => void;
}

export interface NestedComponentButtonProps {
  label: string;
  description?: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const NestedComponentButton: React.FC<NestedComponentButtonProps> = ({ label, description, onClick, icon }) => {
  return (
    <button 
      className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 w-full mb-2"
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      <div className="text-left">
        <div className="font-medium">{label}</div>
        {description && <div className="text-sm text-gray-500">{description}</div>}
      </div>
    </button>
  );
};
