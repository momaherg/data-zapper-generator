
import React from "react";
import { 
  Component, 
  ComponentConfig, 
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
    return <ModelFields component={component} onChange={props.onChange} onNavigate={props.onNavigate} />;
  }

  if (isToolComponent(component)) {
    return <ToolFields component={component} onChange={props.onChange} onNavigate={props.onNavigate} />;
  }

  if (isTeamComponent(component)) {
    return <TeamFields component={component} onChange={props.onChange} onNavigate={props.onNavigate} />;
  }

  if (isAgentComponent(component)) {
    return <AgentFields component={component} onChange={props.onChange} onNavigate={props.onNavigate} />;
  }

  if (isTerminationComponent(component)) {
    return <TerminationFields component={component} onChange={props.onChange} onNavigate={props.onNavigate} />;
  }

  return <div>Unknown component type: {component.component_type}</div>;
};

export interface FieldsProps {
  component: Component<ComponentConfig>;
  onChange: (updates: Partial<Component<ComponentConfig>>) => void;
  onNavigate?: (componentType: string, id: string, parentField: string) => void;
}

export const Fields: React.FC<FieldsProps> = ({ component, onChange, onNavigate }) => {
  // Use type guards to safely pass components to their respective fields
  if (isAgentComponent(component)) {
    return <AgentFields component={component} onChange={onChange} onNavigate={onNavigate} />;
  }
  
  if (isModelComponent(component)) {
    return <ModelFields component={component} onChange={onChange} onNavigate={onNavigate} />;
  }
  
  if (isTeamComponent(component)) {
    return <TeamFields component={component} onChange={onChange} onNavigate={onNavigate} />;
  }
  
  if (isToolComponent(component)) {
    return <ToolFields component={component} onChange={onChange} onNavigate={onNavigate} />;
  }
  
  if (isTerminationComponent(component)) {
    return <TerminationFields component={component} onChange={onChange} onNavigate={onNavigate} />;
  }
  
  return <div>Unknown component type: {component.component_type}</div>;
};
