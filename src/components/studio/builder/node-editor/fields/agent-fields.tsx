import React from "react";
import { Form, Input, Select } from "antd";
import { Component, AgentConfig, ComponentConfig } from "../../../../../types/datamodel";
import { NestedComponentButton, NodeEditorFieldsProps } from "../../node-editor";

export interface AgentFieldsProps extends NodeEditorFieldsProps {
  component: Component<AgentConfig>;
}

export const AgentFields: React.FC<AgentFieldsProps> = ({ component, onChange, onNavigate }) => {
  const handleFieldChange = (field: string, value: any) => {
    onChange({
      config: {
        ...component.config,
        [field]: value,
      },
    });
  };

  return (
    <div>
      <Form layout="vertical">
        <Form.Item label="Name">
          <Input
            value={component.config.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Description">
          <Input.TextArea
            value={component.config.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
          />
        </Form.Item>
        {onNavigate && (
          <NestedComponentButton
            label="Model Client"
            description="Select the model client for this agent"
            onClick={() => onNavigate("model", component.config.model_client?.label || "model_client", "model_client")}
          />
        )}
        {onNavigate && (
          <NestedComponentButton
            label="Tools"
            description="Add or manage tools for this agent"
            onClick={() => onNavigate("tool", "tools", "tools")}
          />
        )}
      </Form>
    </div>
  );
};
