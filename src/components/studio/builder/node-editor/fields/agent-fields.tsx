
import { Form, Input } from "antd";
import { DetailGroup } from "./detailgroup";
import { AgentComponent } from "../../../datamodel";
import { Component } from "../../../datamodel";

interface AgentFieldsProps {
  component: AgentComponent;
  onChange: (updateData: Partial<Component<any>>) => void;
}

export const AgentFields = ({ component, onChange }: AgentFieldsProps) => {
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

      <DetailGroup title="Prompt" defaultOpen={true}>
        <Form.Item label="System Prompt" name="system_prompt" className="mb-4">
          <Input.TextArea
            placeholder="Instructions for the agent"
            defaultValue={component.config?.system_prompt || ""}
            rows={4}
            onChange={(e) => onChange({
              config: { ...component.config, system_prompt: e.target.value },
            })}
          />
        </Form.Item>
      </DetailGroup>

      <DetailGroup title="Advanced" defaultOpen={false}>
        <Form.Item label="Temperature" name="temperature" className="mb-4">
          <Input
            type="number"
            min={0}
            max={1}
            step={0.1}
            defaultValue={component.config?.temperature || 0.7}
            onChange={(e) => onChange({
              config: { ...component.config, temperature: parseFloat(e.target.value) },
            })}
          />
        </Form.Item>
      </DetailGroup>
    </>
  );
};
