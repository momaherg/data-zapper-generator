
import React from "react";
import { Form, Input, InputNumber } from "antd";
import NestedComponentButton from "../NestedComponentButton";
import { NodeEditorFieldsProps } from "../../node-editor";
import {
  Component,
  TerminationConfig,
  MaxMessageTerminationConfig,
  TextMentionTerminationConfig,
  OrTerminationConfig,
} from "../../../datamodel";
import {
  isMaxMessageTermination,
  isTextMentionTermination,
  isOrTermination,
} from "../../../guards";

export interface TerminationFieldsProps extends NodeEditorFieldsProps {
  component: Component<TerminationConfig>;
}

export const TerminationFields: React.FC<TerminationFieldsProps> = ({ component, onChange, onNavigate }) => {
  if (isMaxMessageTermination(component)) {
    return (
      <Form.Item label="Max Messages" name="max_messages">
        <InputNumber
          min={1}
          value={component.config.max_turns}
          onChange={(value) =>
            onChange({
              config: { ...component.config, max_turns: value },
            })
          }
        />
      </Form.Item>
    );
  }

  if (isTextMentionTermination(component)) {
    return (
      <Form.Item label="Termination Text" name="text">
        <Input
          placeholder="Termination text"
          value={component.config.text}
          onChange={(e) =>
            onChange({
              config: { ...component.config, text: e.target.value },
            })
          }
        />
      </Form.Item>
    );
  }

  if (isOrTermination(component)) {
    return (
      <Form.Item label="Conditions" className="mb-0">
        <div className="space-y-2">
          {component.config.conditions.map((condition, index) => (
            <NestedComponentButton
              key={index}
              label={`Condition ${index + 1}`}
              description={condition.provider}
              onClick={() => onNavigate(["config", "conditions", index.toString()])}
            />
          ))}
        </div>
      </Form.Item>
    );
  }

  return <div>Unknown termination condition type: {component.provider}</div>;
};

export default TerminationFields;
