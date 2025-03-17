
import React from "react";
import {
  Component,
  ComponentConfig,
  AgentConfig,
  TeamConfig,
  ModelConfig,
  ToolConfig,
  TerminationConfig,
} from "../../../datamodel";
import { AgentFields } from "./agent-fields";
import { TeamFields } from "./team-fields";
import { ModelFields } from "./model-fields";
import { ToolFields } from "./tool-fields";
import { TerminationFields } from "./termination-fields";
import { NodeEditorFieldsProps } from "../../node-editor";
import {
  isTeamComponent,
  isAgentComponent,
  isModelComponent,
  isToolComponent,
  isTerminationComponent,
} from "../../../guards";

export interface ComponentFieldsProps extends NodeEditorFieldsProps {
  component: Component<ComponentConfig>;
}

export const ComponentFields: React.FC<ComponentFieldsProps> = ({
  component,
  onChange,
  onNavigate,
}) => {
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
    return (
      <ModelFields
        component={component}
        onChange={onChange}
        onNavigate={onNavigate}
      />
    );
  }

  if (isTeamComponent(component)) {
    return (
      <TeamFields
        component={component}
        onChange={onChange}
        onNavigate={onNavigate}
      />
    );
  }

  if (isToolComponent(component)) {
    return (
      <ToolFields
        component={component as Component<ToolConfig>}
        onChange={onChange}
        onNavigate={onNavigate}
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

  return <div>Unknown component type: {component.component_type}</div>;
};

export default ComponentFields;
