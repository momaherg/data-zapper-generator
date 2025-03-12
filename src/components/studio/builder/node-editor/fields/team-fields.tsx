
import React from "react";
import { Form, Input, Select } from "antd";
import { Component, TeamConfig } from "../../../../../types/datamodel";
import { NestedComponentButton, NodeEditorFieldsProps } from "../../node-editor";
import { isSelectorTeam } from "../../../guards";

export interface TeamFieldsProps extends NodeEditorFieldsProps {
  component: Component<TeamConfig>;
}

export const TeamFields: React.FC<TeamFieldsProps> = ({ component, onChange, onNavigate }) => {
  const { config } = component;
  const isSelectorType = isSelectorTeam(component);

  const handleFieldChange = (field: string, value: any) => {
    onChange({ config: { ...config, [field]: value } });
  };

  return (
    <div>
      <Form layout="vertical">
        {isSelectorType && (
          <>
            <Form.Item label="Selector Prompt">
              <Input
                value={isSelectorType ? config.selector_prompt : ""}
                onChange={(e) => handleFieldChange("selector_prompt", e.target.value)}
                disabled={!isSelectorType}
              />
            </Form.Item>

            <Form.Item label="Allow Repeated Speaker">
              <Select
                value={isSelectorType ? config.allow_repeated_speaker : false}
                onChange={(value) => handleFieldChange("allow_repeated_speaker", value)}
                disabled={!isSelectorType}
              >
                <Select.Option value={true}>True</Select.Option>
                <Select.Option value={false}>False</Select.Option>
              </Select>
            </Form.Item>
          </>
        )}

        {/* Nested Component Buttons */}
        {onNavigate && isSelectorType && 'model_client' in config && (
          <NestedComponentButton
            label="Model Client"
            description={config.model_client?.config?.model}
            onClick={() => onNavigate("model", config.model_client?.label || "Model Client", "model_client")}
          />
        )}

        {onNavigate && config.participants?.map((participant, index) => (
          <NestedComponentButton
            key={index}
            label={participant.label || `Participant ${index + 1}`}
            description={participant.config.name}
            onClick={() => onNavigate("agent", participant.label || `Participant ${index + 1}`, "participants")}
          />
        ))}
      </Form>
    </div>
  );
};
