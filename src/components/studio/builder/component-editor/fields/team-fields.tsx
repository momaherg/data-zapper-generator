
import React, { useCallback } from "react";
import { Input, Button, InputNumber, Switch } from "antd";
import { Edit, Timer } from "lucide-react";
import {
  Component,
  TeamConfig,
  ComponentConfig,
  RoundRobinGroupChatConfig,
  SelectorGroupChatConfig,
} from "../../../datamodel";
import { isSelectorTeam, isRoundRobinTeam } from "../../../guards";
import DetailGroup from "../detailgroup";

const { TextArea } = Input;

interface TeamFieldsProps {
  component: Component<TeamConfig>;
  onChange: (updates: Partial<Component<ComponentConfig>>) => void;
  onNavigate?: (componentType: string, id: string, parentField: string) => void;
}

export const TeamFields: React.FC<TeamFieldsProps> = ({
  component,
  onChange,
  onNavigate,
}) => {
  if (!isSelectorTeam(component) && !isRoundRobinTeam(component)) return null;

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

  // Get the participant count
  const participantCount = component.config.participants?.length || 0;

  return (
    <div className=" ">
      <DetailGroup title="Component Details">
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
            <span className="text-sm font-medium text-primary">
              Description
            </span>
            <TextArea
              value={component.description || ""}
              onChange={(e) =>
                handleComponentUpdate({ description: e.target.value })
              }
              placeholder="Team description"
              rows={4}
              className="mt-1"
            />
          </label>
        </div>
      </DetailGroup>

      <DetailGroup title="Configuration">
        {isSelectorTeam(component) && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-primary">
                Selector Prompt
              </span>
              <TextArea
                value={component.config.selector_prompt || ""}
                onChange={(e) =>
                  handleConfigUpdate("selector_prompt", e.target.value)
                }
                placeholder="Prompt for the selector"
                rows={4}
                className="mt-1"
              />
            </label>

            <div className="flex items-center gap-2 mt-3">
              <Switch
                checked={component.config.allow_repeated_speaker || false}
                onChange={(checked) => 
                  handleConfigUpdate("allow_repeated_speaker", checked)
                }
              />
              <span className="text-sm font-medium text-primary">
                Allow Repeated Speaker
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-primary">Model</h3>
              <div className="bg-secondary p-4 rounded-md">
                {component.config.model_client ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {component.config.model_client.config.model}
                    </span>
                    {onNavigate && (
                      <Button
                        type="text"
                        icon={<Edit className="w-4 h-4" />}
                        onClick={() =>
                          onNavigate(
                            "model",
                            component.config.model_client?.label || "",
                            "model_client"
                          )
                        }
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-secondary text-center">
                    No model configured
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Common configuration for both team types */}
        <div className="mt-4">
          <label className="block">
            <span className="text-sm font-medium text-primary">Max Turns</span>
            <InputNumber
              value={component.config.max_turns || 0}
              onChange={(value) => handleConfigUpdate("max_turns", value)}
              placeholder="Maximum number of turns"
              className="mt-1 w-full"
              min={0}
            />
          </label>
        </div>

        <div className="space-y-2 mt-4">
          <h3 className="text-sm font-medium text-primary">
            Participants ({participantCount})
          </h3>
          <div className="bg-secondary p-4 rounded-md max-h-40 overflow-y-auto">
            {participantCount > 0 ? (
              <div className="space-y-2">
                {component.config.participants?.map((participant, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm">
                      {participant.config.name || `Agent ${idx + 1}`}
                    </span>
                    {onNavigate && (
                      <Button
                        type="text"
                        size="small"
                        icon={<Edit className="w-3 h-3" />}
                        onClick={() => 
                          onNavigate(
                            "agent", 
                            participant.label || participant.config.name || "", 
                            "participants"
                          )
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-secondary text-center">
                No participants configured
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <h3 className="text-sm font-medium text-primary">
            Termination Condition
          </h3>
          <div className="bg-secondary p-4 rounded-md">
            {component.config.termination_condition ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-secondary" />
                  <span className="text-sm">
                    {component.config.termination_condition.label ||
                      component.config.termination_condition.provider}
                  </span>
                </div>
                {onNavigate && (
                  <Button
                    type="text"
                    icon={<Edit className="w-4 h-4" />}
                    onClick={() =>
                      onNavigate(
                        "termination",
                        component.config.termination_condition?.label || "",
                        "termination_condition"
                      )
                    }
                  />
                )}
              </div>
            ) : (
              <div className="text-sm text-secondary text-center">
                No termination condition configured
              </div>
            )}
          </div>
        </div>
      </DetailGroup>
    </div>
  );
};

export default React.memo(TeamFields);
