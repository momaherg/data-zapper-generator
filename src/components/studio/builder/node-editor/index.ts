
import { ModelFields } from './fields/model-fields';
import { AgentFields } from './fields/agent-fields';
import { TeamFields } from './fields/team-fields';
import { ToolFields } from './fields/tool-fields';
import { TerminationFields } from './fields/termination-fields';
import React from 'react';

// Re-export field components
export { ModelFields, AgentFields, TeamFields, ToolFields, TerminationFields };

// Define props for the NodeEditorFieldsProps
export interface NodeEditorFieldsProps {
  component: any;
  onChange: (updates: any) => void;
  onClose?: () => void;
}

// Define props for the NestedComponentButton
export interface NestedComponentButtonProps {
  label: string;
  onClick: () => void;
  description?: string;
}

// Instead of defining JSX in a .ts file, let's just create an interface for it
export { 
  // These components will be imported directly from their respective files
};
