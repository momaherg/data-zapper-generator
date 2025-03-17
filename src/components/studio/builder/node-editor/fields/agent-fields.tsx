
import React, { useCallback } from "react";
import { Input, Button } from "antd";
import DetailGroup from "../detailgroup";
import { Component, AgentConfig, ComponentConfig } from "../../../datamodel";
import { isAssistantAgent, isUserProxyAgent, isWebSurferAgent } from "../../../guards";
import { NodeEditorFieldsProps } from "../index";
import { NestedComponentButton } from "../NestedComponentButton";

const { TextArea } = Input;

export interface AgentFieldsProps extends NodeEditorFieldsProps {
  component: Component<AgentConfig>;
  onNavigate?: (componentType: string, id: string, parentField: string) => void;
}

export const AgentFields: React.FC<AgentFieldsProps> = ({
  component,
  onChange,
  onNavigate,
}) => {
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

  return (
    <div className="space-y-4">
      <DetailGroup title="Basic Information">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-primary">Name</span>
            <Input
              value={component.label || ""}
              onChange={(e) => handleComponentUpdate({ label: e.target.value })}
              placeholder="Agent name"
              className="mt-1"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-primary">
              Description
            </span>
            <TextArea
              value={component.description || ""}
              onChange={(e) =>
                handleComponentUpdate({ description: e.target.value })
              }
              placeholder="Agent description"
              rows={4}
              className="mt-1"
            />
          </label>
        </div>
      </DetailGroup>

      {isAssistantAgent(component) && (
        <>
          <DetailGroup title="Agent Configuration">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-primary">
                  Agent Name
                </span>
                <Input
                  value={component.config.name || ""}
                  onChange={(e) =>
                    handleComponentUpdate({
                      config: {
                        ...component.config,
                        name: e.target.value,
                      },
                    })
                  }
                  placeholder="Agent name to display"
                  className="mt-1"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-primary">
                  System Message
                </span>
                <TextArea
                  value={component.config.system_message || ""}
                  onChange={(e) =>
                    handleComponentUpdate({
                      config: {
                        ...component.config,
                        system_message: e.target.value,
                      },
                    })
                  }
                  placeholder="System message for the agent"
                  rows={4}
                  className="mt-1"
                />
              </label>
            </div>
          </DetailGroup>

          <DetailGroup title="Model">
            {component.config.model_client ? (
              <NestedComponentButton
                label={component.config.model_client.label || "Model"}
                description="Click to edit model configuration"
                onClick={() =>
                  onNavigate && onNavigate("model", component.config.model_client?.label || "", "model_client")
                }
              />
            ) : (
              <div className="text-sm text-gray-500 p-2 border border-dashed rounded text-center">
                No model configured
              </div>
            )}
          </DetailGroup>

          <DetailGroup title="Tools">
            {component.config.tools && component.config.tools.length > 0 ? (
              <div className="space-y-2">
                {component.config.tools.map((tool, index) => (
                  <NestedComponentButton
                    key={index}
                    label={tool.label || tool.config.name || `Tool ${index + 1}`}
                    description="Click to edit tool configuration"
                    onClick={() =>
                      onNavigate && onNavigate("tool", tool.label || "", "tools")
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 p-2 border border-dashed rounded text-center">
                No tools configured
              </div>
            )}
          </DetailGroup>
        </>
      )}
    </div>
  );
};

export default React.memo(AgentFields);
