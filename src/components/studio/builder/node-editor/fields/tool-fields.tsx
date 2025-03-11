
import React from "react";
import { useRef } from "react";
import { Component, FunctionToolConfig } from "../../../datamodel";
import { MonacoEditor } from "../../monaco";

export interface ToolFieldsProps {
  component: Component<FunctionToolConfig>;
  onChange: (updates: Partial<Component<FunctionToolConfig>>) => void;
}

export const ToolFields: React.FC<ToolFieldsProps> = ({ component, onChange }) => {
  const editorRef = useRef(null);

  const handleSourceCodeChange = (value: string) => {
    onChange({
      config: {
        ...component.config,
        source_code: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Source Code</label>
        <MonacoEditor
          value={component.config.source_code}
          onChange={handleSourceCodeChange}
          language="python"
          editorRef={editorRef}
          minimap={false}
        />
      </div>
    </div>
  );
};

