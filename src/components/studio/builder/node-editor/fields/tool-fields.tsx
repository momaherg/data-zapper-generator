
import React from "react";
import { Form, Input } from "antd";
import { NodeEditorFieldsProps } from "../../node-editor";
import { Component, ToolConfig } from "../../../datamodel";

export interface ToolFieldsProps extends NodeEditorFieldsProps {
  component: Component<ToolConfig>;
}

export const ToolFields: React.FC<ToolFieldsProps> = ({ component, onChange }) => {
  return (
    <>
      <Form.Item label="Name" name="name">
        <Input 
          placeholder="Tool Name" 
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
          placeholder="Tool Description" 
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

export default ToolFields;
