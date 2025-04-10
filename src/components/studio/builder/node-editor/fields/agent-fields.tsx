
import { Form, Input } from "antd";
import DetailGroup from "../../component-editor/detailgroup";
import { Component, AgentConfig } from "../../../datamodel";

interface AgentFieldsProps {
  component: Component<AgentConfig>;
  onChange: (updateData: Partial<Component<AgentConfig>>) => void;
  onNavigate?: (componentType: string, id: string, parentField: string) => void;
}

export const AgentFields = ({ component, onChange, onNavigate }: AgentFieldsProps) => {
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

      <DetailGroup title="Prompt">
        <Form.Item label="System Prompt" name="system_prompt" className="mb-4">
          <Input.TextArea
            placeholder="Instructions for the agent"
            defaultValue={(component.config as any)?.system_prompt || ""}
            rows={4}
            onChange={(e) => onChange({
              config: { ...component.config, system_prompt: e.target.value } as any,
            })}
          />
        </Form.Item>
      </DetailGroup>

      <DetailGroup title="Advanced">
        <Form.Item label="Temperature" name="temperature" className="mb-4">
          <Input
            type="number"
            min={0}
            max={1}
            step={0.1}
            defaultValue={(component.config as any)?.temperature || 0.7}
            onChange={(e) => onChange({
              config: { ...component.config, temperature: parseFloat(e.target.value) } as any,
            })}
          />
        </Form.Item>
      </DetailGroup>
    </>
  );
};

export default AgentFields;
