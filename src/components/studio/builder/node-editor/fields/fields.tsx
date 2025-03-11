
import React from 'react';
import { Component, ComponentConfig } from '../../../datamodel';
import { AgentFields } from './agent-fields';
import { ModelFields } from './model-fields';
import { TeamFields } from './team-fields';
import { ToolFields } from './tool-fields';
import { TerminationFields } from './termination-fields';

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
