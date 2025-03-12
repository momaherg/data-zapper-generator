
import React, { useCallback } from "react";
import { Input, InputNumber, Button, Select } from "antd";
import { NodeEditorFieldsProps } from "../index";
import {
  Component,
  ComponentConfig,
  TerminationConfig,
  MaxMessageTerminationConfig,
  TextMentionTerminationConfig,
  OrTerminationConfig,
} from "../../../datamodel";
import {
  isOrTermination,
  isMaxMessageTermination,
  isTextMentionTermination,
} from "../../../guards";
import { NestedComponentButton } from "../NestedComponentButton";

type TerminationFieldsProps = NodeEditorFieldsProps & {
  component: Component<TerminationConfig>;
};

export const TerminationFields: React.FC<TerminationFieldsProps> = ({
  component,
  onChange,
  onNavigate,
}) => {
  if (!component) return null;

  const handleComponentUpdate = useCallback(
    (updates: Partial<Component<ComponentConfig>>) => {
      if (onChange) {
        onChange({
          ...component,
          ...updates,
          config: {
            ...component.config,
            ...(updates.config || {}),
          },
        });
      }
    },
    [component, onChange]
  );

  if (isOrTermination(component)) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">OR Termination Conditions</h3>
        <p className="text-xs text-gray-500">
          Terminates when any of the conditions are met
        </p>
        <div className="space-y-2">
          {component.config.conditions?.map((condition, index) => (
            <NestedComponentButton
              key={index}
              label={condition.label || `Condition ${index + 1}`}
              description="Click to edit condition"
              onClick={() => onNavigate && onNavigate(condition.component_type, condition.label || "", "conditions")}
            />
          ))}
        </div>
        <Button 
          type="dashed" 
          className="w-full mt-2"
          onClick={() => {
            // Handle adding a new condition
          }}
        >
          Add Condition
        </Button>
      </div>
    );
  }

  if (isMaxMessageTermination(component)) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Max Messages Termination</h3>
        <label className="block">
          <span className="text-sm font-medium">Max Messages</span>
          <InputNumber
            min={1}
            value={component.config.max_messages}
            onChange={(value) =>
              handleComponentUpdate({
                config: { max_messages: value as number },
              })
            }
            className="w-full mt-1"
          />
        </label>
      </div>
    );
  }

  if (isTextMentionTermination(component)) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Text Mention Termination</h3>
        <label className="block">
          <span className="text-sm font-medium">Termination Text</span>
          <Input
            value={component.config.text}
            onChange={(e) =>
              handleComponentUpdate({
                config: { text: e.target.value },
              })
            }
            placeholder="Text that triggers termination"
            className="mt-1"
          />
        </label>
      </div>
    );
  }

  return null;
};

export default React.memo(TerminationFields);
