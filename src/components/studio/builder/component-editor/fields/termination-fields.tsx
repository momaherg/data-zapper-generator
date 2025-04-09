
import React, { useCallback } from "react";
import { Input, InputNumber, Button, Select } from "antd";
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
  PROVIDERS,
} from "../../../guards";
import DetailGroup from "../detailgroup";

interface TerminationFieldsProps {
  component: Component<TerminationConfig>;
  onChange: (updates: Partial<Component<ComponentConfig>>) => void;
  onNavigate?: (componentType: string, id: string, parentField: string) => void;
}

export const TerminationFields: React.FC<TerminationFieldsProps> = ({
  component,
  onChange,
  onNavigate,
}) => {
  const handleComponentUpdate = useCallback(
    (updates: Partial<Component<ComponentConfig>>) => {
      onChange({
        ...component,
        ...updates,
        config: {
          ...component.config,
          ...(updates.config || {}),
        },
      });
    },
    [component, onChange]
  );

  const renderByType = () => {
    if (isOrTermination(component)) {
      return (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">OR Termination Conditions</h3>
          <p className="text-xs text-gray-500">
            Terminates when any of the conditions are met
          </p>
          
          {(component.config as OrTerminationConfig).conditions?.map((condition, index) => (
            <div key={index} className="border border-gray-200 p-3 rounded">
              <div className="flex justify-between items-center">
                <span>{condition.label || `Condition ${index + 1}`}</span>
                <Button 
                  type="link" 
                  onClick={() => onNavigate && onNavigate(
                    condition.component_type, 
                    condition.label || `condition-${index}`, 
                    "conditions"
                  )}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
          
          <Button 
            type="dashed" 
            className="w-full mt-2"
            onClick={() => {
              // Handle adding a new condition
              console.log("Add condition clicked");
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
          <p className="text-xs text-gray-500">
            Terminates after a certain number of messages
          </p>
          <InputNumber
            min={1}
            value={(component.config as MaxMessageTerminationConfig).max_messages}
            onChange={(value) =>
              handleComponentUpdate({
                config: { max_messages: value as number },
              })
            }
            className="w-full"
          />
        </div>
      );
    }

    if (isTextMentionTermination(component)) {
      return (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Text Mention Termination</h3>
          <p className="text-xs text-gray-500">
            Terminates when specific text is mentioned
          </p>
          <Input
            value={(component.config as TextMentionTerminationConfig).text}
            onChange={(e) =>
              handleComponentUpdate({
                config: { text: e.target.value },
              })
            }
            placeholder="Text that triggers termination"
          />
        </div>
      );
    }

    return (
      <div>
        <p>Unknown termination type: {component.provider}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <DetailGroup title="Termination Details">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-primary">Name</span>
            <Input
              value={component.label || ""}
              onChange={(e) => handleComponentUpdate({ label: e.target.value })}
              placeholder="Termination name"
              className="mt-1"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-primary">Description</span>
            <Input.TextArea
              value={component.description || ""}
              onChange={(e) =>
                handleComponentUpdate({ description: e.target.value })
              }
              placeholder="Termination description"
              rows={2}
              className="mt-1"
            />
          </label>
        </div>
      </DetailGroup>

      <DetailGroup title="Termination Configuration">
        {renderByType()}
      </DetailGroup>
    </div>
  );
};

export default React.memo(TerminationFields);
