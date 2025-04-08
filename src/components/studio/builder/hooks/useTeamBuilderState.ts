
import { useState, useCallback, useEffect, useRef } from "react";
import { useNodesState, useEdgesState, Connection, addEdge } from "@xyflow/react";
import { ValidationResponse, validationAPI } from "../../api";
import { useTeamBuilderStore } from "../store";
import { CustomNode, CustomEdge } from "../types";
import { Component, Team } from "../../datamodel";
import debounce from "lodash.debounce";
import { message } from "antd";

// Create a cache to store team changes
const teamChangeCache = new Map<string, { nodes: CustomNode[]; edges: CustomEdge[] }>();

export function useTeamBuilderState(
  team: Team,
  onChange?: (team: Partial<Team>) => void,
  onDirtyStateChange?: (isDirty: boolean) => void
) {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [validationResults, setValidationResults] = useState<ValidationResponse | null>(null);
  const [validationLoading, setValidationLoading] = useState(false);
  const [testDrawerVisible, setTestDrawerVisible] = useState(false);
  const editorRef = useRef(null);
  const currentTeamId = useRef<string | null>(null);

  const {
    loadFromJson,
    syncToJson,
    resetHistory,
    undo,
    redo,
    layoutNodes,
    updateNode,
    selectedNodeId,
    setSelectedNode,
    currentHistoryIndex,
    history,
    isDirty
  } = useTeamBuilderStore();

  const canUndo = currentHistoryIndex > 0;
  const canRedo = currentHistoryIndex < history.length - 1;

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    onDirtyStateChange?.(isDirty());
  }, [isDirty, onDirtyStateChange]);

  useEffect(() => {
    if (isDirty()) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [isDirty]);

  // Generate a team identifier
  const getTeamId = useCallback((teamData: Team): string => {
    if (teamData?.component?.provider && teamData?.component?.config) {
      return `${teamData.component.provider}-${JSON.stringify(teamData.component.config).slice(0, 50)}`;
    }
    return 'default-team';
  }, []);

  // Save current state to cache when team changes
  useEffect(() => {
    return () => {
      if (currentTeamId.current) {
        // Save current state to cache when unmounting
        teamChangeCache.set(currentTeamId.current, {
          nodes: useTeamBuilderStore.getState().nodes,
          edges: useTeamBuilderStore.getState().edges
        });
      }
    };
  }, []);

  // Load team state, either from cache or from the team data
  useEffect(() => {
    if (team?.component) {
      const teamId = getTeamId(team);
      currentTeamId.current = teamId;

      // Check if we have cached state
      const cachedState = teamChangeCache.get(teamId);
      
      if (cachedState) {
        // Load from cache
        setNodes(cachedState.nodes);
        setEdges(cachedState.edges);
        useTeamBuilderStore.setState({ 
          nodes: cachedState.nodes, 
          edges: cachedState.edges 
        });
      } else {
        // Load from team data
        const { nodes: initialNodes, edges: initialEdges } = loadFromJson(team.component);
        setNodes(initialNodes);
        setEdges(initialEdges);
      }
    }
    
    handleValidate();

    return () => {
      setValidationResults(null);
    };
  }, [team, setNodes, setEdges, loadFromJson, getTeamId]);

  const handleJsonChange = useCallback(
    debounce((value: string) => {
      try {
        const config = JSON.parse(value);
        loadFromJson(config, false);
        useTeamBuilderStore.getState().addToHistory();
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }, 1000),
    [loadFromJson]
  );

  useEffect(() => {
    return () => {
      handleJsonChange.cancel();
      setValidationResults(null);
    };
  }, [handleJsonChange]);

  useEffect(() => {
    const unsubscribe = useTeamBuilderStore.subscribe((state) => {
      setNodes(state.nodes);
      setEdges(state.edges);
    });
    return unsubscribe;
  }, [setNodes, setEdges]);

  const handleValidate = useCallback(async () => {
    const component = syncToJson();
    if (!component) {
      throw new Error("Unable to generate valid configuration");
    }

    try {
      setValidationLoading(true);
      const validationResult = await validationAPI.validateComponent(component);
      setValidationResults(validationResult);
    } catch (error) {
      console.error("Validation error:", error);
      message.error("Validation failed");
    } finally {
      setValidationLoading(false);
    }
  }, [syncToJson]);

  const handleSave = useCallback(async () => {
    try {
      const component = syncToJson();
      if (!component) {
        throw new Error("Unable to generate valid configuration");
      }

      if (onChange) {
        const teamData: Partial<Team> = team
          ? {
              ...team,
              component,
              created_at: undefined,
              updated_at: undefined,
            }
          : { component };
        await onChange(teamData);
        resetHistory();
        
        // Save to cache after successful save
        if (currentTeamId.current) {
          teamChangeCache.delete(currentTeamId.current);
        }
      }
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : "Failed to save team configuration"
      );
    }
  }, [syncToJson, onChange, resetHistory, team]);

  const handleExport = useCallback(() => {
    const json = JSON.stringify(syncToJson(), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "team-config.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [syncToJson]);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFullscreen]);

  return {
    nodes,
    edges,
    isJsonMode,
    setIsJsonMode,
    isFullscreen,
    showGrid,
    setShowGrid,
    showMiniMap,
    setShowMiniMap,
    validationResults,
    validationLoading,
    testDrawerVisible,
    setTestDrawerVisible,
    editorRef,
    isDirty: isDirty(),
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
    syncToJson,
  };
}
