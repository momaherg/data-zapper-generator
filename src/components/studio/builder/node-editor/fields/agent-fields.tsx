
import * as React from "react";
import { Form, Input } from "antd";
import DetailGroup from "../detailgroup";
import { Component, AgentConfig, AssistantAgentConfig, isAssistantAgent } from "../../../datamodel";

interface AgentFieldsProps {
  component: Component<AgentConfig>;
  onChange: (updateData: Partial<Component<any>>) => void;
  onNavigate?: (componentType: string, id: string, parentField: string) => void;
}

export const AgentFields = ({ component, onChange, onNavigate }: AgentFieldsProps) => {
  // Check if it's an AssistantAgent to show specific fields
  const isAssistant = isAssistantAgent(component);

  return (
    <>
      <Form.Item label="Name" name="name" className="mb-4">
        <Input
          placeholder="Agent name"
          defaultValue={component.config?.name || ""}
          onChange={(e) => 
            onChange({
              config: { ...component.config, name: e.target.value },
            })
          }
        />
      </Form.Item>

      <Form.Item label="Description" name="description" className="mb-4">
        <Input
          placeholder="Agent description"
          defaultValue={component.config?.description || ""}
          onChange={(e) => 
            onChange({
              config: { ...component.config, description: e.target.value },
            })
          }
        />
      </Form.Item>

      {isAssistant && (
        <>
          <DetailGroup title="Prompt">
            <Form.Item label="System Prompt" name="system_prompt" className="mb-4">
              <Input.TextArea
                placeholder="Instructions for the agent"
                defaultValue={(component.config as AssistantAgentConfig)?.system_message || ""}
                rows={4}
                onChange={(e) => onChange({
                  config: { 
                    ...component.config, 
                    system_message: e.target.value 
                  },
                })}
              />
            </Form.Item>
          </DetailGroup>

          <DetailGroup title="Advanced">
            <Form.Item label="Model Client Stream" name="model_client_stream" className="mb-4">
              <Input
                type="checkbox"
                checked={(component.config as AssistantAgentConfig)?.model_client_stream || false}
                onChange={(e) => onChange({
                  config: { 
                    ...component.config, 
                    model_client_stream: e.target.checked 
                  },
                })}
              />
            </Form.Item>
          </DetailGroup>
        </>
      )}
    </>
  );
};

export default AgentFields;
