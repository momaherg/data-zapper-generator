
import React from "react";
import { Component, FunctionToolConfig } from "../../../../types/datamodel";
import { Card } from "antd";
import { MonacoEditor } from "../../monaco";

interface ToolFieldsProps {
  component: Component<FunctionToolConfig>;
  onChange: (updates: Partial<Component<FunctionToolConfig>>) => void;
}

export const ToolFields: React.FC<ToolFieldsProps> = ({ component, onChange }) => {
  return (
    <div className="space-y-4">
      <Card title="Function Tool" bordered={false}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={component.config.name || ""}
            onChange={(e) => 
              onChange({
                config: {
                  ...component.config,
                  name: e.target.value
                }
              })
            }
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border rounded-md"
            value={component.config.description || ""}
            onChange={(e) => 
              onChange({
                config: {
                  ...component.config,
                  description: e.target.value
                }
              })
            }
            rows={3}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Source Code
          </label>
          <div className="h-64 border rounded-md overflow-hidden">
            <MonacoEditor
              value={component.config.source_code || ""}
              onChange={(value) => 
                onChange({
                  config: {
                    ...component.config,
                    source_code: value
                  }
                })
              }
              language="python"
              minimap={false}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
