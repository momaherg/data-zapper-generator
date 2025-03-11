import React from "react";
import { 
  Component, 
  ComponentConfig, 
  FunctionToolConfig,
  TeamConfig,
  AgentConfig,
  ModelConfig,
  ToolConfig,
  TerminationConfig 
} from "../../../../../types/datamodel";
import { TeamFields } from "./team-fields";
import { AgentFields } from "./agent-fields";
import { ModelFields } from "./model-fields";
import { ToolFields } from "./tool-fields";
import { TerminationFields } from "./termination-fields";

import { 
  isTeamComponent, 
  isAgentComponent, 
  isModelComponent, 
  isToolComponent, 
  isTerminationComponent 
} from "../../../../studio/guards";
import { NodeEditorFieldsProps } from "../../node-editor";

export const renderFields = (props: NodeEditorFieldsProps) => {
  const { component } = props;

  if (isModelComponent(component)) {
    return <ModelFields {...props} component={component} />;
  }

  if (isToolComponent(component)) {
    return <ToolFields {...props} component={component} />;
  }

  if (isTeamComponent(component)) {
    return <TeamFields {...props} component={component} />;
  }

  if (isAgentComponent(component)) {
    return <AgentFields {...props} component={component} />;
  }

  if (isTerminationComponent(component)) {
    return <TerminationFields {...props} component={component} />;
  }

  return <div>Unknown component type: {component.component_type}</div>;
};

export interface FieldsProps {
  component: Component<ComponentConfig>;
  onChange: (updates: Partial<Component<ComponentConfig>>) => void;
}

export const Fields: React.FC<FieldsProps> = ({ component, onChange }) => {
  return (
    <div className="space-y-4">
      {component.component_type === 'agent' && (
        <AgentFields component={component} onChange={onChange} />
      )}
      {component.component_type === 'model' && (
        <ModelFields component={component} onChange={onChange} />
      )}
      {component.component_type === 'team' && (
        <TeamFields component={component} onChange={onChange} />
      )}
      {component.component_type === 'tool' && (
        <ToolFields component={component} onChange={onChange} />
      )}
      {component.component_type === 'termination' && (
        <TerminationFields component={component} onChange={onChange} />
      )}
    </div>
  );
};
