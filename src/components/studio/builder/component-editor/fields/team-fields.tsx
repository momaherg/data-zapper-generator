
import React, { useCallback } from "react";
import { Input, Switch, Button } from "antd";
import {
  Component,
  TeamConfig,
  ComponentConfig,
  SelectorGroupChatConfig,
  RoundRobinGroupChatConfig,
} from "../../../datamodel";
import {
  isSelectorTeam,
  isRoundRobinTeam,
} from "../../../guards";
import DetailGroup from "../detailgroup";
import { Textarea } from "@/components/ui/textarea";

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

  const renderSelectorFields = () => {
    if (!isSelectorTeam(component)) return null;
    
    const config = component.config as SelectorGroupChatConfig;
    
    return (
      <DetailGroup title="Selector Configuration">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-primary">Selector Prompt</span>
            <Textarea
              value={config.selector_prompt || ""}
              onChange={(e) =>
                handleComponentUpdate({
                  config: { ...config, selector_prompt: e.target.value },
                })
              }
              placeholder="Prompt for selecting the next agent"
              rows={4}
              className="mt-1"
            />
          </label>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-primary">Model</h3>
            {config.model_client ? (
              <div className="border border-gray-200 p-3 rounded">
                <div className="flex justify-between items-center">
                  <span>{config.model_client.label || "Model"}</span>
                  <Button 
                    type="link" 
                    onClick={() => onNavigate && onNavigate(
                      "model", 
                      config.model_client.label || "model", 
                      "model_client"
                    )}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center p-4 border border-dashed rounded-md">
                No model configured
              </div>
            )}
          </div>
        </div>
      </DetailGroup>
    );
  };

  const renderRoundRobinFields = () => {
    if (!isRoundRobinTeam(component)) return null;
    
    const config = component.config as RoundRobinGroupChatConfig;
    
    return (
      <DetailGroup title="Round Robin Configuration">
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary">Allow Repeated Speaker</span>
            <Switch
              checked={config.allow_repeated_speaker}
              onChange={(checked) =>
                handleComponentUpdate({
                  config: { ...config, allow_repeated_speaker: checked },
                })
              }
            />
          </label>
        </div>
      </DetailGroup>
    );
  };

  return (
    <div className="space-y-6">
      <DetailGroup title="Team Details">
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
        </div>
      </DetailGroup>

      {renderSelectorFields()}
      {renderRoundRobinFields()}

      <DetailGroup title="Participants">
        <div className="space-y-2">
          {component.config.participants && component.config.participants.length > 0 ? (
            component.config.participants.map((agent, index) => (
              <div key={index} className="border border-gray-200 p-3 rounded">
                <div className="flex justify-between items-center">
                  <span>{agent.config.name || agent.label || `Agent ${index + 1}`}</span>
                  <Button 
                    type="link" 
                    onClick={() => onNavigate && onNavigate(
                      "agent", 
                      agent.label || `agent-${index}`, 
                      "participants"
                    )}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 text-center p-4 border border-dashed rounded-md">
              No participants added
            </div>
          )}
          
          <Button 
            type="dashed" 
            className="w-full mt-2"
            onClick={() => {
              // Handle adding a new agent
              console.log("Add agent clicked");
            }}
          >
            Add Agent
          </Button>
        </div>
      </DetailGroup>

      <DetailGroup title="Termination">
        <div className="space-y-2">
          {component.config.termination_condition ? (
            <div className="border border-gray-200 p-3 rounded">
              <div className="flex justify-between items-center">
                <span>{component.config.termination_condition.label || "Termination"}</span>
                <Button 
                  type="link" 
                  onClick={() => onNavigate && onNavigate(
                    "termination", 
                    component.config.termination_condition.label || "termination", 
                    "termination_condition"
                  )}
                >
                  Edit
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center p-4 border border-dashed rounded-md">
              No termination condition configured
            </div>
          )}
          
          {!component.config.termination_condition && (
            <Button 
              type="dashed" 
              className="w-full mt-2"
              onClick={() => {
                // Handle adding a termination condition
                console.log("Add termination clicked");
              }}
            >
              Add Termination Condition
            </Button>
          )}
        </div>
      </DetailGroup>
    </div>
  );
};

export default React.memo(TeamFields);
