
import React from "react";
import {
  ReactFlow,
  Background,
  MiniMap,
  Connection,
} from "@xyflow/react";
import { CustomNode, CustomEdge } from "../types";
import { MonacoEditor } from "../monaco";

interface FlowEditorProps {
  isJsonMode: boolean;
  jsonValue: string;
  editorRef: React.RefObject<any>;
  handleJsonChange: (value: string) => void;
  nodes: CustomNode[];
  edges: CustomEdge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (params: Connection) => void;
  nodeTypes: any;
  edgeTypes: any;
  showGrid: boolean;
  showMiniMap: boolean;
  isFullscreen: boolean;
}

export const FlowEditor: React.FC<FlowEditorProps> = ({
  isJsonMode,
  jsonValue,
  editorRef,
  handleJsonChange,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodeTypes,
  edgeTypes,
  showGrid,
  showMiniMap,
  isFullscreen,
}) => {
  return (
    <div
      className={`w-full h-full transition-all duration-200 ${
        isFullscreen
          ? "fixed inset-4 z-50 shadow bg-tertiary backdrop-blur-sm"
          : ""
      }`}
    >
      {isJsonMode ? (
        <MonacoEditor
          value={jsonValue}
          onChange={handleJsonChange}
          editorRef={editorRef}
          language="json"
          minimap={false}
          className="h-full"
        />
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onDrop={(event) => event.preventDefault()}
          onDragOver={(event) => event.preventDefault()}
          className="rounded bg-white"
          fitView
          fitViewOptions={{ padding: 10 }}
        >
          {showGrid && <Background />}
          {showMiniMap && <MiniMap className="!bottom-5 !right-5" />}
        </ReactFlow>
      )}
    </div>
  );
};
