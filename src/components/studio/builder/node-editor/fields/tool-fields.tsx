
import React from "react";
import { Form, Input, Switch } from "antd";
import { Component, ToolConfig, FunctionToolConfig } from "../../../../../types/datamodel";
import { NodeEditorFieldsProps } from "../../node-editor";
import { isFunctionTool } from "../../../guards";

export interface ToolFieldsProps extends NodeEditorFieldsProps {
  component: Component<ToolConfig>;
}

export const ToolFields: React.FC<ToolFieldsProps> = ({ component, onChange }) => {
  const { config } = component;

  const handleFieldChange = (field: string, value: any) => {
    onChange({
      config: {
        ...config,
        [field]: value,
      },
    });
  };

  if (isFunctionTool(component)) {
    const functionConfig = config as FunctionToolConfig;
    return (
      <div>
        <Form layout="vertical">
          <Form.Item label="Name">
            <Input
              value={functionConfig.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Description">
            <Input.TextArea
              value={functionConfig.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Source Code">
            <Input.TextArea
              value={functionConfig.source_code}
              rows={8}
              onChange={(e) => handleFieldChange("source_code", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Has Cancellation Support">
            <Switch
              checked={functionConfig.has_cancellation_support}
              onChange={(checked) =>
                handleFieldChange("has_cancellation_support", checked)
              }
            />
          </Form.Item>
        </Form>
      </div>
    );
  }

  return <div>Unknown Tool Config</div>;
};
