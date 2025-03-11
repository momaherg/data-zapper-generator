
// Export types and components from the node-editor module
import { ModelFields } from './fields/model-fields';
import { AgentFields } from './fields/agent-fields';
import { TeamFields } from './fields/team-fields';
import { ToolFields } from './fields/tool-fields';
import { TerminationFields } from './fields/termination-fields';

// Re-export field components
export { ModelFields, AgentFields, TeamFields, ToolFields, TerminationFields };

// Export common types
export interface NodeEditorFieldsProps {
  component: any;
  onChange: (updates: Partial<any>) => void;
}

export interface NestedComponentButtonProps {
  label: string;
  onClick: () => void;
  description?: string;
}

export const NestedComponentButton = ({ label, onClick, description }: NestedComponentButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full text-left"
    >
      <span className="font-medium">{label}</span>
      {description && <span className="text-xs text-gray-500">{description}</span>}
    </button>
  );
};
