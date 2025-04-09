
import React, { useCallback } from "react";
import { Input, Button } from "antd";
import { NodeEditorFieldsProps } from "../index";
import {
  Component,
  TeamConfig,
  ComponentConfig,
  RoundRobinGroupChatConfig,
  SelectorGroupChatConfig,
} from "../../../datamodel";
import { isSelectorTeam, isRoundRobinTeam } from "../../../guards";
import { NestedComponentButton } from "../NestedComponentButton";
import { Textarea } from "@/components/ui/textarea";

type TeamFieldsProps = NodeEditorFieldsProps & {
  component: Component<TeamConfig>;
};

export const TeamFields: React.FC<TeamFieldsProps> = ({
  component,
  onChange,
  onNavigate,
}) => {
  if (!isSelectorTeam(component) && !isRoundRobinTeam(component)) return null;

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

  const handleConfigUpdate = useCallback(
    (field: string, value: unknown) => {
      if (isSelectorTeam(component)) {
        handleComponentUpdate({
          config: {
            ...component.config,
            [field]: value,
          } as SelectorGroupChatConfig,
        });
      } else if (isRoundRobinTeam(component)) {
        handleComponentUpdate({
          config: {
            ...component.config,
            [field]: value,
          } as RoundRobinGroupChatConfig,
        });
      }
    },
    [component, handleComponentUpdate]
  );

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-primary">Name</span>
        <Input
          value={component.label || ""}
          onChange={(e) => handleComponentUpdate({ label: e.target.value })}
          placeholder="Team name"
          className="mt-1"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-primary">Description</span>
        <Textarea
          value={component.description || ""}
          onChange={(e) =>
            handleComponentUpdate({ description: e.target.value })
          }
          placeholder="Team description"
          rows={4}
          className="mt-1"
        />
      </label>

      {isSelectorTeam(component) && (
        <>
          <label className="block">
            <span className="text-sm font-medium text-primary">
              Selector Prompt
            </span>
            <Textarea
              value={component.config.selector_prompt || ""}
              onChange={(e) =>
                handleConfigUpdate("selector_prompt", e.target.value)
              }
              placeholder="Prompt for the selector"
              rows={4}
              className="mt-1"
            />
          </label>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-primary">Model</h3>
            {component.config.model_client ? (
              <NestedComponentButton
                label={component.config.model_client.label || component.config.model_client.config.model || "Model"}
                description="Click to edit model configuration"
                onClick={() => onNavigate && onNavigate("model", component.config.model_client?.label || "", "model_client")}
              />
            ) : (
              <div className="text-sm text-gray-500 text-center p-4 border border-dashed rounded-md">
                No model configured
              </div>
            )}
          </div>
        </>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-primary">Participants</h3>
        {component.config.participants && component.config.participants.length > 0 ? (
          <div className="space-y-2">
            {component.config.participants.map((agent, index) => (
              <NestedComponentButton
                key={index}
                label={agent.label || agent.config.name || `Agent ${index + 1}`}
                description="Click to edit agent configuration"
                onClick={() => onNavigate && onNavigate("agent", agent.label || "", "participants")}
              />
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center p-4 border border-dashed rounded-md">
            No participants added
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-primary">Termination Condition</h3>
        {component.config.termination_condition ? (
          <NestedComponentButton
            label={component.config.termination_condition.label || "Termination Condition"}
            description="Click to edit termination condition"
            onClick={() => onNavigate && onNavigate("termination", component.config.termination_condition?.label || "", "termination_condition")}
          />
        ) : (
          <div className="text-sm text-gray-500 text-center p-4 border border-dashed rounded-md">
            No termination condition configured
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TeamFields);
