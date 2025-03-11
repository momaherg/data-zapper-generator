
import React from "react";
import {
  Component,
  ComponentConfig,
  TeamConfig,
  AgentConfig,
  ModelConfig,
  ToolConfig,
  TerminationConfig,
  FunctionToolConfig,
} from "../../../../../types/datamodel";
import {
  isAgentComponent,
  isModelComponent,
  isTeamComponent,
  isToolComponent,
  isTerminationComponent,
  isFunctionTool,
} from "../../../guards";
import { TeamFields } from "./team-fields";
import { AgentFields } from "./agent-fields";
import { ModelFields } from "./model-fields";
import { ToolFields } from "./tool-fields";
import { TerminationFields } from "./termination-fields";
import { EditPath } from "../component-editor";

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
  if (isTeamComponent(component)) {
    return (
      <TeamFields
        component={component}
        onChange={onChange}
        onNavigate={onNavigate}
      />
    );
  }

  if (isAgentComponent(component)) {
    return (
      <AgentFields
        component={component}
        onChange={onChange}
        onNavigate={onNavigate}
      />
    );
  }

  if (isModelComponent(component)) {
    return <ModelFields component={component} onChange={onChange} />;
  }

  if (isToolComponent(component) && isFunctionTool(component)) {
    return <ToolFields component={component} onChange={onChange} />;
  }

  if (isTerminationComponent(component)) {
    return (
      <TerminationFields
        component={component}
        onChange={onChange}
        onNavigate={onNavigate}
      />
    );
  }

  return <div>Unknown component type: {component.component_type}</div>;
};

export default Fields;
