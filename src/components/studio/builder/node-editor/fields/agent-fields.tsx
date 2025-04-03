
import React from "react";
import { Form, Input } from "antd";
import { DetailGroup } from "../detailgroup";
import { AgentConfig, Component, ComponentConfig } from "../../../datamodel";

export interface AgentFieldsProps {
  component: Component<AgentConfig>;
  onChange: (updates: Partial<Component<ComponentConfig>>) => void;
  onNavigate?: (componentType: string, id: string, parentField: string) => void;
}

export const AgentFields: React.FC<AgentFieldsProps> = ({ component, onChange, onNavigate }) => {
  return (
    <>
      <Form.Item label="Name" name="name">
        <Input 
          placeholder="Agent Name" 
          value={component.config.name} 
          onChange={(e) => 
            onChange({
              config: { ...component.config, name: e.target.value },
            })
          }
        />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea 
          placeholder="Agent Description" 
          value={component.config.description} 
          onChange={(e) => 
            onChange({
              config: { ...component.config, description: e.target.value },
            })
          }
        />
      </Form.Item>
    </>
  );
};

export default AgentFields;
