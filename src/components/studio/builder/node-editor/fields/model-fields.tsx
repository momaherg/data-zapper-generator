
import React from "react";
import { Form, Input, Select } from "antd";
import { NodeEditorFieldsProps } from "../../node-editor";
import {
  ModelConfig,
  OpenAIClientConfig,
  AzureOpenAIClientConfig,
  AnthropicClientConfig,
} from "../../../datamodel";
import { Component } from "../../../datamodel";
import { isOpenAIModel, isAzureOpenAIModel, isAnthropicModel } from "../../../guards";
import { Textarea } from "@/components/ui/textarea";

const { Option } = Select;

export interface ModelFieldsProps extends NodeEditorFieldsProps {
  component: Component<ModelConfig>;
}

const CommonModelFields: React.FC<ModelFieldsProps> = ({ component, onChange }) => {
  return (
    <>
      <Form.Item label="Name" name="name">
        <Input 
          placeholder="Model Name" 
          value={component.config.model} 
          onChange={(e) => 
            onChange({
              config: { ...component.config, model: e.target.value },
            })
          }
        />
      </Form.Item>
    </>
  );
};

const OpenAIModelFields: React.FC<ModelFieldsProps> = ({ component, onChange }) => {
  const config = component.config as OpenAIClientConfig;
  
  return (
    <>
      <CommonModelFields component={component} onChange={onChange} onNavigate={() => {}} />
      <Form.Item label="API Key" name="api_key">
        <Input 
          placeholder="API Key" 
          value={config.api_key} 
          onChange={(e) => 
            onChange({
              config: { ...config, api_key: e.target.value },
            })
          }
        />
      </Form.Item>
    </>
  );
};

const AzureOpenAIModelFields: React.FC<ModelFieldsProps> = ({ component, onChange }) => {
  const config = component.config as AzureOpenAIClientConfig;
  
  return (
    <>
      <CommonModelFields component={component} onChange={onChange} onNavigate={() => {}} />
      <Form.Item label="API Key" name="api_key">
        <Input 
          placeholder="API Key" 
          value={config.api_key} 
          onChange={(e) => onChange({
            config: { ...config, api_key: e.target.value },
          })}
        />
      </Form.Item>
      <Form.Item label="Azure Endpoint" name="azure_endpoint">
        <Input 
          placeholder="Azure Endpoint" 
          value={config.azure_endpoint} 
          onChange={(e) => onChange({
            config: { ...config, azure_endpoint: e.target.value },
          })}
        />
      </Form.Item>
      <Form.Item label="API Version" name="api_version">
        <Input 
          placeholder="API Version" 
          value={config.api_version} 
          onChange={(e) => onChange({
            config: { ...config, api_version: e.target.value },
          })}
        />
      </Form.Item>
    </>
  );
};

const AnthropicModelFields: React.FC<ModelFieldsProps> = ({ component, onChange }) => {
  const config = component.config as AnthropicClientConfig;
  
  return (
    <>
      <CommonModelFields component={component} onChange={onChange} onNavigate={() => {}} />
      <Form.Item label="API Key" name="api_key">
        <Input 
          placeholder="API Key" 
          value={config.api_key} 
          onChange={(e) => onChange({
            config: { ...config, api_key: e.target.value },
          })}
        />
      </Form.Item>
    </>
  );
};

export const ModelFields: React.FC<ModelFieldsProps> = (props) => {
  // Determine which model type we're dealing with and render the appropriate fields
  if (isOpenAIModel(props.component)) {
    return <OpenAIModelFields {...props} />;
  } else if (isAzureOpenAIModel(props.component)) {
    return <AzureOpenAIModelFields {...props} />;
  } else if (isAnthropicModel(props.component)) {
    return <AnthropicModelFields {...props} />;
  }
  
  // Default case
  return <CommonModelFields {...props} />;
};

export default ModelFields;
