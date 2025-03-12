
import React from "react";
import { Form, Input, Switch } from "antd";
import NestedComponentButton from "../NestedComponentButton";
import { NodeEditorFieldsProps } from "../../node-editor";
import { Component, TeamConfig } from "../../../datamodel";
import { isSelectorTeam, isRoundRobinTeam } from "../../../guards";

export interface TeamFieldsProps extends NodeEditorFieldsProps {
  component: Component<TeamConfig>;
}

export const TeamFields: React.FC<TeamFieldsProps> = ({ component, onChange, onNavigate }) => {
  return (
    <>
      <Form.Item label="Name" name="name">
        <Input 
          placeholder="Team Name" 
          value={component.label} 
          onChange={(e) => 
            onChange({
              label: e.target.value,
            })
          }
        />
      </Form.Item>

      {isSelectorTeam(component) && (
        <Form.Item label="Selector Prompt" name="selector_prompt">
          <Input.TextArea 
            placeholder="Prompt for the selector" 
            value={component.config.selector_prompt} 
            onChange={(e) => 
              onChange({
                config: { ...component.config, selector_prompt: e.target.value },
              })
            }
          />
        </Form.Item>
      )}

      {isSelectorTeam(component) && (
        <Form.Item label="Allow Repeated Speaker" name="allow_repeated_speaker">
          <Switch 
            checked={component.config.allow_repeated_speaker}
            onChange={(checked) => 
              onChange({
                config: { ...component.config, allow_repeated_speaker: checked },
              })
            }
          />
        </Form.Item>
      )}

      <Form.Item label="Components" className="mb-0">
        <div className="space-y-2">
          <NestedComponentButton
            label="Model Client"
            description={component.config.model_client 
              ? `${component.config.model_client.provider} - ${component.config.model_client.config.model}`
              : "Not set"}
            onClick={() => onNavigate(["config", "model_client"])}
          />

          {component.config.participants?.map((participant, index) => (
            <NestedComponentButton
              key={index}
              label={participant.config.name || `Agent ${index + 1}`}
              description={`${participant.provider}`}
              onClick={() => onNavigate(["config", "participants", index.toString()])}
            />
          ))}
        </div>
      </Form.Item>
    </>
  );
};

export default TeamFields;
