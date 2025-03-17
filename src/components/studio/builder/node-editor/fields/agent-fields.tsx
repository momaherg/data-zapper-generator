
import { Form, Input } from "antd";
import { DetailGroup } from "../../../builder/node-editor/detailgroup";
import { Component } from "../../../datamodel";
import { AgentConfig, AssistantAgentConfig } from "../../../datamodel";
import { isAssistantAgent } from "../../../guards";

interface AgentFieldsProps {
  component: Component<AgentConfig>;
  onChange: (updateData: Partial<Component<any>>) => void;
  onNavigate?: (componentType: string, id: string, parentField: string) => void;
}

export const AgentFields = ({ component, onChange, onNavigate }: AgentFieldsProps) => {
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
        <DetailGroup title="Prompt" defaultOpen={true}>
          <Form.Item label="System Message" name="system_message" className="mb-4">
            <Input.TextArea
              placeholder="Instructions for the agent"
              defaultValue={(component.config as AssistantAgentConfig)?.system_message || ""}
              rows={4}
              onChange={(e) => onChange({
                config: { ...component.config, system_message: e.target.value },
              })}
            />
          </Form.Item>
        </DetailGroup>
      )}

      {isAssistant && (
        <DetailGroup title="Advanced" defaultOpen={false}>
          {component.config.model_client && (
            <Form.Item label="Model Client" className="mb-4">
              <div className="text-sm text-gray-500">
                Configure temperature and other options in the model client.
                {onNavigate && (
                  <button 
                    className="ml-2 text-blue-500 underline"
                    onClick={() => onNavigate('model', 'model_client', 'model_client')}
                  >
                    Edit Model
                  </button>
                )}
              </div>
            </Form.Item>
          )}
        </DetailGroup>
      )}
    </>
  );
};
