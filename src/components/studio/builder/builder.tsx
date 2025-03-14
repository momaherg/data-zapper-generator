import React, { useCallback } from "react";
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from "@dnd-kit/core";
import { Layout, Drawer } from "antd";
import "@xyflow/react/dist/style.css";
import { useTeamBuilderStore } from "./store";
import { ComponentLibrary } from "./library";
import { Team } from "../datamodel";
import { edgeTypes, nodeTypes } from "./nodes";
import "./builder.css";
import TeamBuilderToolbar from "./toolbar";
import ComponentEditor from "./component-editor/component-editor";
import { TeamBuilderHeader } from "./components/TeamBuilderHeader";
import { FlowEditor } from "./components/FlowEditor";
import { DragOverlayContent } from "./components/DragOverlayContent";
import { useTeamBuilderDnd } from "./hooks/useTeamBuilderDnd";
import { useTeamBuilderState } from "./hooks/useTeamBuilderState";
const {
  Sider,
  Content
} = Layout;
interface TeamBuilderProps {
  team: Team;
  onChange?: (team: Partial<Team>) => void;
  onDirtyStateChange?: (isDirty: boolean) => void;
}
export const TeamBuilder: React.FC<TeamBuilderProps> = ({
  team,
  onChange,
  onDirtyStateChange
}) => {
  // Use our custom hooks to manage state and drag-and-drop
  const {
    nodes,
    edges,
    isJsonMode,
    setIsJsonMode,
    isFullscreen,
    showGrid,
    showMiniMap,
    setShowMiniMap,
    validationResults,
    validationLoading,
    testDrawerVisible,
    setTestDrawerVisible,
    editorRef,
    isDirty,
    canUndo,
    canRedo,
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleJsonChange,
    handleValidate,
    handleSave,
    handleExport,
    handleToggleFullscreen,
    undo,
    redo,
    layoutNodes,
    selectedNodeId,
    setSelectedNode,
    updateNode,
    syncToJson
  } = useTeamBuilderState(team, onChange, onDirtyStateChange);
  const {
    activeDragItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  } = useTeamBuilderDnd(nodes);
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8
    }
  }));
  const handleTestDrawerClose = useCallback(() => {
    setTestDrawerVisible(false);
  }, [setTestDrawerVisible]);
  return <div>
      <TeamBuilderHeader isJsonMode={isJsonMode} setIsJsonMode={setIsJsonMode} validationResults={validationResults} validationLoading={validationLoading} isDirty={isDirty} onValidate={handleValidate} onSave={handleSave} onExport={handleExport} onTestRun={() => setTestDrawerVisible(true)} syncToJson={syncToJson} />
      
      <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDragStart={handleDragStart}>
        <Layout className="relative h-[calc(100vh-239px)] rounded bg-[#6f80e6]/0">
          {!isJsonMode && <ComponentLibrary />}

          <Layout className="bg-primary rounded">
            <Content className="relative rounded bg-tertiary">
              <FlowEditor isJsonMode={isJsonMode} jsonValue={JSON.stringify(syncToJson(), null, 2)} editorRef={editorRef} handleJsonChange={handleJsonChange} nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} edgeTypes={edgeTypes} showGrid={showGrid} showMiniMap={showMiniMap} isFullscreen={isFullscreen} />
              
              {isFullscreen && <div className="fixed inset-0 -z-10 bg-background bg-opacity-80 backdrop-blur-sm" onClick={handleToggleFullscreen} />}
              
              <TeamBuilderToolbar isJsonMode={isJsonMode} isFullscreen={isFullscreen} showGrid={showGrid} onToggleMiniMap={() => setShowMiniMap(!showMiniMap)} canUndo={canUndo} canRedo={canRedo} isDirty={isDirty} onToggleView={() => setIsJsonMode(!isJsonMode)} onUndo={undo} onRedo={redo} onSave={handleSave} onToggleGrid={() => !showGrid} onToggleFullscreen={handleToggleFullscreen} onAutoLayout={layoutNodes} />
            </Content>
          </Layout>

          {selectedNodeId && <Drawer title="Edit Component" placement="right" size="large" onClose={() => setSelectedNode(null)} open={!!selectedNodeId} className="component-editor-drawer">
              {nodes.find(n => n.id === selectedNodeId)?.data.component && <ComponentEditor component={nodes.find(n => n.id === selectedNodeId)!.data.component} onChange={updatedComponent => {
            if (selectedNodeId) {
              updateNode(selectedNodeId, {
                component: updatedComponent
              });
              handleSave();
            }
          }} onClose={() => setSelectedNode(null)} navigationDepth={true} />}
            </Drawer>}
        </Layout>
        
        <DragOverlay dropAnimation={{
        duration: 250,
        easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)"
      }}>
          <DragOverlayContent activeDragItem={activeDragItem} />
        </DragOverlay>
      </DndContext>
    </div>;
};