
import React from "react";
import { Form, Input } from "antd";
import { 
  Component, 
  TerminationConfig,
  OrTerminationConfig,
  MaxMessageTerminationConfig,
  TextMentionTerminationConfig
} from "../../../../../types/datamodel";
import { NestedComponentButton, NodeEditorFieldsProps } from "../../node-editor";

export interface TerminationFieldsProps extends NodeEditorFieldsProps {
  component: Component<TerminationConfig>;
}

export const TerminationFields: React.FC<TerminationFieldsProps> = ({ component, onChange, onNavigate }) => {
  const { config } = component;

  const handleFieldChange = (field: string, value: any) => {
    onChange({ config: { ...config, [field]: value } });
  };

  if ("conditions" in config) {
    const orConfig = config as OrTerminationConfig;

    return (
      <div>
        <p>Or Termination Config</p>
        {orConfig.conditions &&
          orConfig.conditions.map((condition, index) => (
            <div key={index}>
              <NestedComponentButton
                label={condition.label || condition.component_type}
                description={condition.description || ""}
                onClick={() =>
                  onNavigate?.("termination", condition.label || condition.component_type, "conditions")
                }
              />
            </div>
          ))}
      </div>
    );
  }

  if ("max_messages" in config) {
    const maxMessagesConfig = config as MaxMessageTerminationConfig;

    return (
      <div>
        <p>Max Messages Termination Config</p>
        <Form.Item label="Max Messages">
          <Input
            type="number"
            value={maxMessagesConfig.max_messages}
            onChange={(e) =>
              handleFieldChange("max_messages", parseInt(e.target.value))
            }
          />
        </Form.Item>
      </div>
    );
  }

  if ("text" in config) {
    const textMentionConfig = config as TextMentionTerminationConfig;

    return (
      <div>
        <p>Text Mention Termination Config</p>
        <Form.Item label="Text">
          <Input
            type="text"
            value={textMentionConfig.text}
            onChange={(e) => handleFieldChange("text", e.target.value)}
          />
        </Form.Item>
      </div>
    );
  }

  return <div>Unknown Termination Config</div>;
};
