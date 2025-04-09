
import React from "react";
import {
  Component,
  ComponentConfig,
  TeamConfig,
  AgentConfig,
  ModelConfig,
  ToolConfig,
  TerminationConfig,
} from "../../../datamodel";
import {
  isAgentComponent,
  isModelComponent,
  isTeamComponent,
  isToolComponent,
  isTerminationComponent,
} from "../../../guards";
import TeamFields from "./team-fields";
import AgentFields from "./agent-fields";
import ModelFields from "./model-fields";
import ToolFields from "./tool-fields";
import TerminationFields from "./termination-fields";

interface FieldsProps {
  component: Component<ComponentConfig>;
  onChange: (updates: Partial<Component<ComponentConfig>>) => void;
  onNavigate?: (componentType: string, id: string, parentField: string) => void;
}

export const Fields: React.FC<FieldsProps> = ({
  component,
  onChange,
  onNavigate,
}) => {
  if (!component) {
    return <div>No component selected</div>;
  }

  if (isTeamComponent(component)) {
    return (
      <TeamFields
        component={component as Component<TeamConfig>}
        onChange={onChange}
        onNavigate={onNavigate}
      />
    );
  }

  if (isAgentComponent(component)) {
    return (
      <AgentFields
        component={component as Component<AgentConfig>}
        onChange={onChange}
        onNavigate={onNavigate}
      />
    );
  }

  if (isModelComponent(component)) {
    return (
      <ModelFields
        component={component as Component<ModelConfig>}
        onChange={onChange}
      />
    );
  }

  if (isToolComponent(component)) {
    return (
      <ToolFields
        component={component as Component<ToolConfig>}
        onChange={onChange}
      />
    );
  }

  if (isTerminationComponent(component)) {
    return (
      <TerminationFields
        component={component as Component<TerminationConfig>}
        onChange={onChange}
        onNavigate={onNavigate}
      />
    );
  }

  return <div>Unknown component type: {component?.component_type || 'undefined'}</div>;
};

export default Fields;
