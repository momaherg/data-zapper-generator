
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
    <div className="p-2 bg-white border rounded shadow-md text-primary">
      <div className="flex items-center gap-2">
        {activeDragItem.icon}
        <span className="text-sm font-medium">{activeDragItem.label}</span>
      </div>
    </div>
  );
};
