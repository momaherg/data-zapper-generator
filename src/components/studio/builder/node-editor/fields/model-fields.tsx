
import React from "react";
import { Form, Input, Select } from "antd";
import { Component, ModelConfig } from "../../../../../types/datamodel";
import { NodeEditorFieldsProps } from "../../node-editor";
import { isOpenAIModel, isAzureOpenAIModel, isAnthropicModel } from "../../../guards";

export interface ModelFieldsProps extends NodeEditorFieldsProps {
  component: Component<ModelConfig>;
}

export const ModelFields: React.FC<ModelFieldsProps> = ({ component, onChange }) => {
  const { config } = component;

  const handleFieldChange = (field: string, value: any) => {
    onChange({
      config: {
        ...config,
        [field]: value,
      },
    });
  };

  return (
    <div>
      <Form layout="vertical">
        <Form.Item label="Model">
          <Input
            value={config.model}
            onChange={(e) => handleFieldChange("model", e.target.value)}
          />
        </Form.Item>

        {isOpenAIModel(component) && (
          <>
            <Form.Item label="API Key">
              <Input.Password
                value={config.api_key}
                onChange={(e) => handleFieldChange("api_key", e.target.value)}
                placeholder="Enter API key (optional)"
              />
            </Form.Item>

            <Form.Item label="Temperature">
              <Input
                type="number"
                min={0}
                max={2}
                step={0.1}
                value={config.temperature}
                onChange={(e) =>
                  handleFieldChange("temperature", parseFloat(e.target.value))
                }
              />
            </Form.Item>
          </>
        )}

        {isAzureOpenAIModel(component) && (
          <>
            <Form.Item label="Azure Endpoint">
              <Input
                value={config.azure_endpoint}
                onChange={(e) =>
                  handleFieldChange("azure_endpoint", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item label="API Version">
              <Input
                value={config.api_version}
                onChange={(e) =>
                  handleFieldChange("api_version", e.target.value)
                }
              />
            </Form.Item>
          </>
        )}

        {isAnthropicModel(component) && (
          <>
            <Form.Item label="API Key">
              <Input.Password
                value={config.api_key}
                onChange={(e) => handleFieldChange("api_key", e.target.value)}
                placeholder="Enter API key (optional)"
              />
            </Form.Item>

            <Form.Item label="Top P">
              <Input
                type="number"
                min={0}
                max={1}
                step={0.1}
                value={config.top_p}
                onChange={(e) =>
                  handleFieldChange("top_p", parseFloat(e.target.value))
                }
              />
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  );
};
