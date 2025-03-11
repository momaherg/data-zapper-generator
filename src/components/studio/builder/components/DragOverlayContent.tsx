
import React from "react";
import { ComponentTypes } from "../../datamodel";

interface DragItemData {
  type: ComponentTypes;
  config: any;
  label: string;
  icon: React.ReactNode;
}

interface DragOverlayContentProps {
  activeDragItem: DragItemData | null;
}

export const DragOverlayContent: React.FC<DragOverlayContentProps> = ({
  activeDragItem,
}) => {
  if (!activeDragItem) return null;

  return (
    <div className="p-2 text-primary h-full rounded">
      <div className="flex items-center gap-2">
        {activeDragItem.icon}
        <span className="text-sm">{activeDragItem.label}</span>
      </div>
    </div>
  );
};
