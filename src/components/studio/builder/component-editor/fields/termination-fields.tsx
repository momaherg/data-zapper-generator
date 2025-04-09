
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
  if (!component || !component.config) {
    return null;
  }

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

  // Render OrTermination fields
  if (isOrTermination(component.config)) {
    return (
      <div className="space-y-4">
        <DetailGroup title="OR Termination Conditions" defaultOpen={true}>
          <p className="text-sm text-gray-500 mb-4">
            Terminates when any of the conditions are met
          </p>
          <div className="space-y-2">
            {component.config.conditions?.map((condition, index) => (
              <div 
                key={index}
                className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => onNavigate && onNavigate(condition.component_type, condition.label || `Condition ${index + 1}`, "conditions")}
              >
                <div className="font-medium">{condition.label || `Condition ${index + 1}`}</div>
                <div className="text-xs text-gray-500">Click to edit condition</div>
              </div>
            ))}
          </div>
          <Button 
            type="dashed" 
            className="w-full mt-4"
            onClick={() => {
              // Handle adding a new condition
              const newConditions = [...(component.config as OrTerminationConfig).conditions];
              newConditions.push({
                provider: "maxmessage",
                component_type: "termination",
                label: `Condition ${newConditions.length + 1}`,
                config: {
                  max_messages: 10
                }
              });
              
              handleComponentUpdate({
                config: {
                  ...component.config,
                  conditions: newConditions
                }
              });
            }}
          >
            Add Condition
          </Button>
        </DetailGroup>
      </div>
    );
  }

  // Render MaxMessageTermination fields
  if (isMaxMessageTermination(component.config)) {
    return (
      <div className="space-y-4">
        <DetailGroup title="Max Messages Termination" defaultOpen={true}>
          <label className="block">
            <span className="text-sm font-medium">Max Messages</span>
            <InputNumber
              min={1}
              value={component.config.max_messages}
              onChange={(value) =>
                handleComponentUpdate({
                  config: { 
                    ...component.config,
                    max_messages: value as number 
                  },
                })
              }
              className="w-full mt-1"
            />
          </label>
        </DetailGroup>
      </div>
    );
  }

  // Render TextMentionTermination fields
  if (isTextMentionTermination(component.config)) {
    return (
      <div className="space-y-4">
        <DetailGroup title="Text Mention Termination" defaultOpen={true}>
          <label className="block">
            <span className="text-sm font-medium">Termination Text</span>
            <Input
              value={component.config.text}
              onChange={(e) =>
                handleComponentUpdate({
                  config: { 
                    ...component.config,
                    text: e.target.value 
                  },
                })
              }
              placeholder="Text that triggers termination"
              className="mt-1"
            />
          </label>
        </DetailGroup>
      </div>
    );
  }

  return (
    <div>
      <p>Unknown termination type</p>
    </div>
  );
};

export default React.memo(TerminationFields);
