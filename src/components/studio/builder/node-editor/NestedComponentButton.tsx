
import React from "react";
import { ChevronRight } from "lucide-react";
import { NestedComponentButtonProps } from "./index";

export const NestedComponentButton: React.FC<NestedComponentButtonProps> = ({
  label,
  description,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="border rounded p-3 mb-3 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors"
    >
      <div>
        <div className="font-medium">{label}</div>
        {description && <div className="text-sm text-gray-500">{description}</div>}
      </div>
      <ChevronRight className="text-gray-400" />
    </div>
  );
};
