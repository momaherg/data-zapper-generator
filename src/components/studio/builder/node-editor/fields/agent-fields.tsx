
import React from "react";
import { Form, Input } from "antd";
import NestedComponentButton from "../NestedComponentButton";
import { NodeEditorFieldsProps } from "../../node-editor";
import { Component, AgentConfig } from "../../../datamodel";
import { isAssistantAgent, isWebSurferAgent } from "../../../guards";

export interface AgentFieldsProps extends NodeEditorFieldsProps {
  component: Component<AgentConfig>;
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

      {(isAssistantAgent(component) || isWebSurferAgent(component)) && (
        <>
          <Form.Item label="Components" className="mb-0">
            <div className="space-y-2">
              <NestedComponentButton
                label="Model Client"
                description={component.config.model_client 
                  ? `${component.config.model_client.provider} - ${component.config.model_client.config.model}`
                  : "Not set"}
                onClick={() => onNavigate(["config", "model_client"])}
              />
            </div>
          </Form.Item>

          {isAssistantAgent(component) && component.config.tools && (
            <Form.Item label="Tools" className="mb-0">
              <div className="space-y-2">
                {component.config.tools.map((tool, index) => (
                  <NestedComponentButton
                    key={index}
                    label={tool.config.name || `Tool ${index + 1}`}
                    description={`${tool.provider}`}
                    onClick={() => onNavigate(["config", "tools", index.toString()])}
                  />
                ))}
              </div>
            </Form.Item>
          )}
        </>
      )}
    </>
  );
};

export default AgentFields;
