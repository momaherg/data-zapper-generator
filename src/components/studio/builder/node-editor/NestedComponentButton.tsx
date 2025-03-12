
import React from "react";
import { Button } from "antd";
import { ArrowRight } from "lucide-react";

export interface NestedComponentButtonProps {
  label: string;
  description?: string;
  onClick: () => void;
  key?: string | number;
}

export const NestedComponentButton: React.FC<NestedComponentButtonProps> = ({
  label,
  description,
  onClick,
  key,
}) => {
  return (
    <Button
      key={key}
      type="dashed"
      onClick={onClick}
      className="flex items-center justify-between w-full mb-2"
    >
      <div className="flex flex-col items-start">
        <span>{label}</span>
        {description && (
          <span className="text-xs text-gray-500">{description}</span>
        )}
      </div>
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
};

export default NestedComponentButton;
