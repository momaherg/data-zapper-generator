
import { useState, useCallback } from "react";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { ComponentTypes } from "../../datamodel";
import { useTeamBuilderStore } from "../store";
import { CustomNode } from "../types";

interface DragItemData {
  type: ComponentTypes;
  config: any;
  label: string;
  icon: React.ReactNode;
}

export function useTeamBuilderDnd(nodes: CustomNode[]) {
  const [activeDragItem, setActiveDragItem] = useState<DragItemData | null>(null);
  const { addNode } = useTeamBuilderStore();

  const validateDropTarget = useCallback(
    (draggedType: ComponentTypes, targetType: ComponentTypes): boolean => {
      const validTargets: Record<ComponentTypes, ComponentTypes[]> = {
        model: ["team", "agent"],
        tool: ["agent"],
        agent: ["team"],
        team: [],
        termination: ["team"],
      };
      return validTargets[draggedType]?.includes(targetType) || false;
    },
    []
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over?.id || !active.data.current) return;

    const draggedType = active.data.current.type;
    const targetNode = nodes.find((node) => node.id === over.id);
    if (!targetNode) return;

    const isValid = validateDropTarget(
      draggedType,
      targetNode.data.component.component_type
    );
    if (isValid) {
      targetNode.className = "drop-target-valid";
    } else {
      targetNode.className = "drop-target-invalid";
    }
  }, [nodes, validateDropTarget]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !active.data?.current?.current) return;

    const draggedItem = active.data.current.current;
    const dropZoneId = over.id as string;

    const [nodeId] = dropZoneId.split("@@@");
    const targetNode = nodes.find((node) => node.id === nodeId);
    if (!targetNode) return;

    const isValid = validateDropTarget(
      draggedItem.type,
      targetNode.data.component.component_type
    );
    if (!isValid) return;

    const position = {
      x: event.delta.x,
      y: event.delta.y,
    };

    addNode(position, draggedItem.config, nodeId);
    setActiveDragItem(null);
  }, [nodes, validateDropTarget, addNode]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current) {
      setActiveDragItem(active.data.current as DragItemData);
    }
  }, []);

  return {
    activeDragItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
